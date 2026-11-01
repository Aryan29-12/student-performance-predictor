import django_filters
from .models import Student

class StudentFilter(django_filters.FilterSet):
    min_attendance = django_filters.NumberFilter(field_name="attendance_rate", lookup_expr="gte")
    name = django_filters.CharFilter(field_name="name", lookup_expr="icontains")
    class Meta:
        model = Student
        fields = ["gender"]
