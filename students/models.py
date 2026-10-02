from django.db import models

# Create your models here.

class Student(models.Model):
    name = models.CharField(max_length=100)

    age = models.IntegerField()
    gender = models.IntegerField()
    urban_flag = models.IntegerField()
    family_size = models.IntegerField()
    parent_education = models.IntegerField()
    family_income = models.FloatField()

    sleep_hours = models.FloatField()
    physical_activity = models.FloatField()
    screen_time = models.FloatField()
    junk_food_freq = models.FloatField()
    bmi = models.FloatField()
    illness_days = models.FloatField()
    mental_stress = models.FloatField()
    sleep_quality = models.FloatField()

    internet_access = models.IntegerField()
    private_tuition = models.IntegerField()
    tuition_hours = models.FloatField()
    study_room = models.IntegerField()
    parent_involvement = models.FloatField()
    scholarship_flag = models.IntegerField()
    part_time_job_hours = models.FloatField()
    financial_stress = models.FloatField()

    online_course_hours = models.FloatField()
    lms_login_frequency = models.FloatField()
    coding_practice_hours = models.FloatField()
    ai_tool_usage = models.IntegerField()
    digital_literacy = models.FloatField()
    video_watch_hours = models.FloatField()
    forum_participation = models.IntegerField()
    device_availability = models.IntegerField()

    math_score = models.FloatField()
    science_score = models.FloatField()
    english_score = models.FloatField()
    history_score = models.FloatField()
    computer_score = models.FloatField()
    attendance_rate = models.FloatField()
    assignment_avg = models.FloatField()
    quiz_avg = models.FloatField()
    project_score = models.FloatField()
    previous_gpa = models.FloatField()
    study_hours_daily = models.FloatField()
    revision_hours = models.FloatField()
    standardized_exam_score = models.FloatField()

    def __str__(self):
        return self.name

class Subject(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Marks(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    marks = models.IntegerField()

    def __str__(self):
        return f"{self.student.name} - {self.subject.name}"