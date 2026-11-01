from django.urls import path
from .views import (
    CSRFTokenView,
    LoginView,
    LogoutView,
    SessionUserView,
    StudentListView,
    StudentDetailView,
    StudentStatsView,
    PredictionView,
)

urlpatterns = [
    # Authentication endpoints
    path("auth/csrf/", CSRFTokenView.as_view(), name="auth-csrf"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/user/", SessionUserView.as_view(), name="auth-user"),

    # Student endpoints (stats placed before <int:pk>)
    path("students/", StudentListView.as_view(), name="student-list"),
    path("students/stats/", StudentStatsView.as_view(), name="student-stats"),
    path("students/<int:pk>/", StudentDetailView.as_view(), name="student-detail"),

    # ML GPA prediction endpoint
    path("predict/", PredictionView.as_view(), name="predict-gpa"),
]
