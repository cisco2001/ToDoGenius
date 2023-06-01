import requests
from django.shortcuts import render

base_url = "http://dev.hisptz.com/dhsi2/api/dataStore/mtwa_johakim_mgimwa/"
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
        session = create_session(authentication_credentials)
        response = session.get(complete_url)
        if response.status_code == 200:
            print("successful")
            #return respsonse to the user
        if response.status_code == 404:
            print("unsuccessful")
            #tell user this is his first time, add items and they will appear

# function to allow user to create tasks
def create_tasks(request):
    session = create_session(authentication_credentials)
    if request.method == "POST":
        # obtain data from user, check if they match with data model in the API then send it
        #obtain response and check then proceed to send feedback to user about task performed
        pass
    if request.method == "GET":
        # return a page to create a new tasks
        pass

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
