from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api_root'),
    path('check-document/', views.check_document, name='check_document'),
]
