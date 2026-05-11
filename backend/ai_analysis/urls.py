from django.urls import path
from .views import analyze_beschikking

urlpatterns = [
    path('analyze/', analyze_beschikking),
]