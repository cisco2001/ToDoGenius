import requests
import datetime
import json
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
        template_name = 'task_manager/home.html'
        session = create_session(authentication_credentials)
        response = session.get(base_url + "?fields=title")
        titles = []
        if response.status_code == 200:
            titles = response.json()
            titles = titles["entries"]
        context = {
        'api_response': response,
        'titles': titles
        }
        return render(request, template_name, context)


# function to allow user to create tasks
def create_task(request):
    #session = create_session(authentication_credentials)
    if request.method == "POST":
        title = request.POST["title"]
        description = request.POST['description']
        current_timestamp = datetime.datetime.now().isoformat()

        data = {
            "id": "to-do_1",
            "title": title,
            "description": description,
            "created": current_timestamp,
            "completed": False,
            "lastUpdated": ""
        }
        # obtain data from user, check if they match with data model in the API then send it
        url = base_url + "todo_3"
        #obtain response and check then proceed to send feedback to user about task performed
        response = requests.post(url, json=data, auth=authentication_credentials)
        print(response.text)
        # redirect to the page that shows list of tasks
        return redirect('home')

# function to allow user to update tasks
def update_tasks(request):
    session = create_session(authentication_credentials)
    if request.method == "PUT":
        # obtain data from the user, check if they match with data model the send it
        # obtain reponse and then send feedback to the user
        pass

# function to allow user to delete tasks
def delete_task(request):
    session = create_session(authentication_credentials)
    if request.method == "DELETE":
        # remove task specified by the user
        # return feedback
        pass

# function to allow user to edit his task
def edit_task(request): # this seem to be a more general function
    # initialize session
    # update tasks
    # return feedback
    pass 

# function to redirect user
def redirect_view(request):
    return redirect('/tasks/')