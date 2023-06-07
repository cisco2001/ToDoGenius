from django.urls import path
from .views import view_tasks, redirect_view, create_task, update_task, delete_task, all_todos

urlpatterns = [
    path('', redirect_view),
    path('tasks/', view_tasks, name='home'),
    path('add_task/', create_task, name='create_task'),
    path('update_task/', update_task, name='update_task'),
    path('delete_task/', delete_task, name='delete_task'),
    path('all_todos/', all_todos, name='all_tasks'),
]