from django.urls import path
from .views import StudentListView, StudentDetailView, PredictionView

urlpatterns = [
    path("students/", StudentListView.as_view()),
    path("students/<int:pk>/", StudentDetailView.as_view()),
    path("predict/", PredictionView.as_view()),
]