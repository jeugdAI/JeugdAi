from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api_root'),
    path("zorgaanbieders/", views.zorgaanbieders_list),
    path("behandelingen/", views.behandelingen_list),
]
