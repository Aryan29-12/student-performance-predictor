from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Student
from django_filters.rest_framework import DjangoFilterBackend
from .filters import StudentFilter
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticatedOrReadOnly
import pandas as pd
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import StudentSerializer, PredictionSerializer
from ml.predict import predict_gpa

class StudentListView(ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = StudentFilter
    search_fields = ["name"]
    ordering_fields = ["attendance", "previous_score", "age", "study_hours"]


class StudentDetailView(RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

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