from django.urls import path
from .views import view_tasks, redirect_view

urlpatterns = [
    path('', redirect_view),
    path('view_tasks/', view_tasks, name='home')
]