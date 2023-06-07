import requests
import datetime
import json
from django.http import JsonResponse
from django.http import HttpResponse
from django.http import QueryDict
from django.shortcuts import render, redirect

base_url = "https://dev.hisptz.com/dhis2/api/dataStore/mtwa_johakim_mgimwa/"
authentication_credentials = ("admin", "district")
response = None
session = None

# function to handle session
def create_session(credentials):
    # create a session object
    session = requests.Session()
    # set authentication credentials for the session
    session.auth = credentials
    return session


# function to allow user to view his or her to-do list
def view_tasks(request):
    if request.method == "GET":
        keyword = request.GET.get('keyword')
        template_name = 'task_manager/home.html'
        session = create_session(authentication_credentials)
        response = session.get(base_url + "?fields=.")
        context = {}
        if response.status_code == 200:
            items = response.json()
            entries = items["entries"]

            if keyword:
                entries = filter(lambda entry: keyword in entry["value"]["title"] or keyword in entry["value"]["description"], entries)
                filtered_entries = list(entries)

                # Return the filtered entries as JSON response
                context["entries"] = filtered_entries
            else:
                context["entries"] = entries
        context["api_response"] = response
        return render(request, template_name, context)

def all_todos(request):
    session = create_session(authentication_credentials)
    response = session.get(base_url + "?fields=.")
    if response.status_code == 200:
        items = response.json()
        entries = items["entries"]
        extracted_data = [
            {"title": item["value"]["title"], "start": item["value"]["created"]}
            for item in entries
        ]
        return JsonResponse(extracted_data, safe=False)
    else:
        return HttpResponse(status=response.status_code)

# function to allow user to create tasks
def create_task(request):
    #session = create_session(authentication_credentials)
    if request.method == "POST":
        title = request.POST["title"]
        description = request.POST['description']
        current_timestamp = datetime.datetime.now().isoformat()
        id = None

        # determine the latest ID and increment to obtain the current ID to use
        session = create_session(authentication_credentials)
        response = session.get(base_url + "?fields=.")
        if response.status_code == 200:
            data = response.json()
            if not len(data['entries']) == 0:
                last_entry_key = data['entries'][-1]['key']
                id = f"todo_{int(last_entry_key[last_entry_key.index('_') + 1:]) + 1}"
                print(id)
            else:
                id = 'todo_1'
        elif response.status_code == 404:
            id = 'todo_1'
        data = {
            "id": id,
            "title": title,
            "description": description,
            "created": current_timestamp,
            "completed": False,
            "lastUpdated": ""
        }
        # obtain data from user, check if they match with data model in the API then send it
        url = base_url + id
        #obtain response and check then proceed to send feedback to user about task performed
        response = requests.post(url, json=data, auth=authentication_credentials)
        # redirect to the page that shows list of tasks
        return redirect('home')

# function to allow user to update tasks
def update_task(request):
    if request.method == "PUT" and request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        # obtain todo item ID
        put_data = QueryDict(request.body)
        id = put_data.get('item_id')
        url = base_url + id
        #title = request.PUT["title"]
        session = create_session(authentication_credentials)
        response = session.get(url)
        data = response.json()
        data["completed"] = True
        current_timestamp = datetime.datetime.now().isoformat()
        data["lastUpdated"] = current_timestamp
        print(data)
        response = requests.put(url, json=data, auth=authentication_credentials)
        # obtain reponse and then send feedback to the user
        return JsonResponse({'message': 'Item marked as completed.'})
    elif request.method == "POST": # edit item contents
        title = request.POST['title']
        description = request.POST['description']
        id = request.POST['item_id']
        url = base_url + id
        session = create_session(authentication_credentials)
        response = session.get(url)
        data = response.json()
        data['title'] = title
        data['description'] = description
        current_timestamp = datetime.datetime.now().isoformat()
        data["lastUpdated"] = current_timestamp
        response = requests.put(url, json=data, auth=authentication_credentials)
        print(response)
        return redirect('home')

# function to allow user to delete tasks
def delete_task(request):
    if request.method == "DELETE" and request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        put_data = QueryDict(request.body)
        id = put_data.get('item_id')
        url = base_url + id
        print("to deletion")
    # remove task specified by the user
        response = requests.delete(url, auth=authentication_credentials)
    # return feedback
        return JsonResponse({'message': 'Item deleted.'})

# function to allow user to edit his task
def edit_task(request): # this seem to be a more general function
    # initialize session
    # update tasks
    # return feedback
    pass 

# function to redirect user
def redirect_view(request):
    return redirect('/tasks/')
