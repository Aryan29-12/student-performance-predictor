from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"

    def validate_age(self, value):
        if value < 0:
            raise serializers.ValidationError("Age cannot be negative")
        return value

    def validate_attendance_rate(self, value):
        if value < 0 or value > 1:
            raise serializers.ValidationError("Attendance rate must be between 0 and 1")
        return value

    def validate_previous_gpa(self, value):
        if value < 0 or value > 4:
            raise serializers.ValidationError("Previous GPA must be between 0 and 4")
        return value

    def validate_standardized_exam_score(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Standardized exam score must be between 0 and 100"
            )
        return value

class PredictionSerializer(serializers.Serializer):
    age = serializers.IntegerField()
    gender = serializers.IntegerField()
    urban_flag = serializers.IntegerField()
    family_size = serializers.IntegerField()
    parent_education = serializers.IntegerField()
    family_income = serializers.FloatField()

    sleep_hours = serializers.FloatField()
    physical_activity = serializers.FloatField()
    screen_time = serializers.FloatField()
    junk_food_freq = serializers.FloatField()
    bmi = serializers.FloatField()
    illness_days = serializers.FloatField()
    mental_stress = serializers.FloatField()
    sleep_quality = serializers.FloatField()

    internet_access = serializers.IntegerField()
    private_tuition = serializers.IntegerField()
    tuition_hours = serializers.FloatField()
    study_room = serializers.IntegerField()
    parent_involvement = serializers.FloatField()
    scholarship_flag = serializers.IntegerField()
    part_time_job_hours = serializers.FloatField()
    financial_stress = serializers.FloatField()

    online_course_hours = serializers.FloatField()
    lms_login_frequency = serializers.FloatField()
    coding_practice_hours = serializers.FloatField()
    ai_tool_usage = serializers.IntegerField()
    digital_literacy = serializers.FloatField()
    video_watch_hours = serializers.FloatField()
    forum_participation = serializers.IntegerField()
    device_availability = serializers.IntegerField()

    math_score = serializers.FloatField()
    science_score = serializers.FloatField()
    english_score = serializers.FloatField()
    history_score = serializers.FloatField()
    computer_score = serializers.FloatField()
    attendance_rate = serializers.FloatField()
    assignment_avg = serializers.FloatField()
    quiz_avg = serializers.FloatField()
    project_score = serializers.FloatField()
    previous_gpa = serializers.FloatField()
    study_hours_daily = serializers.FloatField()
    revision_hours = serializers.FloatField()
    standardized_exam_score = serializers.FloatField()

    def validate_age(self, value):
        if value < 0:
            raise serializers.ValidationError("Age cannot be negative")
        return value

    def validate_attendance_rate(self, value):
        if value < 0 or value > 1:
            raise serializers.ValidationError(
                "Attendance rate must be between 0 and 1"
            )
        return value

    def validate_previous_gpa(self, value):
        if value < 0 or value > 4:
            raise serializers.ValidationError(
                "Previous GPA must be between 0 and 4"
            )
        return value

    def validate_standardized_exam_score(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError(
                "Standardized exam score must be between 0 and 100"
            )
        return value