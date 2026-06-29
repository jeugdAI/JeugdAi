from django.urls import path
from . import views

urlpatterns = [
    path('', views.api_root, name='api_root'),
    path("zorgaanbieders/", views.zorgaanbieders_list),
    path("problematieken/", views.problematieken_list),
    path("producten/", views.producten_list),
    path("opmerkingen/", views.opmerkingen_list),
    path('zorgaanbieders/<int:pk>/', views.zorgaanbieder_wachtrij_opmerking, name='zorgaanbieder_wachtrij_opmerking'),
]
