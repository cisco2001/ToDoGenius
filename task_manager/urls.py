from django.urls import path
from .views import view_tasks, redirect_view, create_task, update_task

urlpatterns = [
    path('', redirect_view),
    path('tasks/', view_tasks, name='home'),
    path('add_task/', create_task, name='create_task'),
    path('mark_completed/', update_task, name='update_task')
]