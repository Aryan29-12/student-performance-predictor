import django_filters
from .models import Student

class StudentFilter(django_filters.FilterSet):
    min_attendance = django_filters.NumberFilter(field_name="attendance", lookup_expr="gte")

    class Meta:
        model = Student
        fields = ["gender"]