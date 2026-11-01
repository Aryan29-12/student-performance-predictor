from django.contrib.auth import authenticate, login, logout
from django.db.models import Avg, Count
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django_filters.rest_framework import DjangoFilterBackend
import pandas as pd
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.views import APIView

from ml.predict import predict_gpa
from .filters import StudentFilter
from .models import Student
from .serializers import PredictionSerializer, StudentSerializer


# ---------------------------------------------------------
# Pagination
# ---------------------------------------------------------
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50


# ---------------------------------------------------------
# Authentication Endpoints
# ---------------------------------------------------------
@method_decorator(ensure_csrf_cookie, name="dispatch")
class CSRFTokenView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({"detail": "CSRF cookie set"})


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Explicitly enforce CSRF validation for unauthenticated login requests
        SessionAuthentication().enforce_csrf(request)

        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"detail": "Username and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({
                "isAuthenticated": True,
                "username": user.username,
            })
        return Response(
            {"detail": "Invalid credentials."},
            status=status.HTTP_401_UNAUTHORIZED,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"detail": "Successfully logged out."})


class SessionUserView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                "isAuthenticated": True,
                "username": request.user.username,
            })
        return Response({"isAuthenticated": False, "username": None})


# ---------------------------------------------------------
# Student Endpoints
# ---------------------------------------------------------
class StudentListView(ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticatedOrReadOnly]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = StudentFilter
    search_fields = ["name"]
    ordering_fields = [
        "attendance_rate",
        "previous_gpa",
        "age",
        "study_hours_daily",
    ]


class StudentDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class StudentStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        stats = Student.objects.aggregate(
            total_students=Count("id"),
            avg_previous_gpa=Avg("previous_gpa"),
            avg_attendance_rate=Avg("attendance_rate"),
            avg_study_hours=Avg("study_hours_daily"),
            avg_math=Avg("math_score"),
            avg_science=Avg("science_score"),
            avg_english=Avg("english_score"),
            avg_history=Avg("history_score"),
            avg_computer=Avg("computer_score"),
        )

        total = stats["total_students"]
        avg_gpa = (
            round(stats["avg_previous_gpa"], 2)
            if stats["avg_previous_gpa"] is not None
            else 0.0
        )
        avg_att = (
            round(stats["avg_attendance_rate"], 4)
            if stats["avg_attendance_rate"] is not None
            else 0.0
        )
        avg_study = (
            round(stats["avg_study_hours"], 2)
            if stats["avg_study_hours"] is not None
            else 0.0
        )

        math_score = (
            round(stats["avg_math"], 1)
            if stats["avg_math"] is not None
            else 0.0
        )
        science_score = (
            round(stats["avg_science"], 1)
            if stats["avg_science"] is not None
            else 0.0
        )
        english_score = (
            round(stats["avg_english"], 1)
            if stats["avg_english"] is not None
            else 0.0
        )
        history_score = (
            round(stats["avg_history"], 1)
            if stats["avg_history"] is not None
            else 0.0
        )
        computer_score = (
            round(stats["avg_computer"], 1)
            if stats["avg_computer"] is not None
            else 0.0
        )

        return Response({
            "total_students": total,
            "avg_previous_gpa": avg_gpa,
            "avg_attendance_rate": avg_att,
            "avg_study_hours_daily": avg_study,
            "subject_averages": {
                "math": math_score,
                "science": science_score,
                "english": english_score,
                "history": history_score,
                "computer": computer_score,
            },
        })


# ---------------------------------------------------------
# GPA Prediction Endpoint
# ---------------------------------------------------------
class PredictionView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def post(self, request):
        serializer = PredictionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = pd.DataFrame([serializer.validated_data])
        prediction = predict_gpa(data)

        return Response({
            "predicted_gpa": prediction
        })
