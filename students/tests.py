import json
from django.contrib.auth.models import User
from django.test import Client, TestCase
from rest_framework import status
from students.models import Student


class StudentPerformanceBackendTests(TestCase):
    def setUp(self):
        # Create standard active, non-staff test user
        self.username = "teststudent"
        self.password = "ValidPass123!"
        self.user = User.objects.create_user(
            username=self.username,
            password=self.password
        )
        self.user.is_staff = False
        self.user.is_active = True
        self.user.save()

        # Baseline sample student data
        self.sample_payload = {
            "name": "Alex Smith",
            "age": 20,
            "gender": 1,
            "urban_flag": 1,
            "family_size": 4,
            "parent_education": 3,
            "family_income": 0.25,
            "sleep_hours": 7.0,
            "physical_activity": 30.0,
            "screen_time": 4.0,
            "junk_food_freq": 2.0,
            "bmi": 22.0,
            "illness_days": 1.0,
            "mental_stress": 4.0,
            "sleep_quality": 8.0,
            "internet_access": 1,
            "private_tuition": 0,
            "tuition_hours": 0.0,
            "study_room": 1,
            "parent_involvement": 6.0,
            "scholarship_flag": 0,
            "part_time_job_hours": 5.0,
            "financial_stress": 3.0,
            "online_course_hours": 4.0,
            "lms_login_frequency": 12.0,
            "coding_practice_hours": 3.0,
            "ai_tool_usage": 1,
            "digital_literacy": 7.0,
            "video_watch_hours": 5.0,
            "forum_participation": 2,
            "device_availability": 2,
            "math_score": 75.0,
            "science_score": 80.0,
            "english_score": 78.0,
            "history_score": 72.0,
            "computer_score": 85.0,
            "attendance_rate": 0.88,
            "assignment_avg": 82.0,
            "quiz_avg": 80.0,
            "project_score": 84.0,
            "previous_gpa": 3.25,
            "study_hours_daily": 3.5,
            "revision_hours": 1.5,
            "standardized_exam_score": 79.0
        }

    # -------------------------------------------------------------
    # 1. CSRF Handshake
    # -------------------------------------------------------------
    def test_01_csrf_handshake(self):
        """Test GET /auth/csrf/ sets the csrftoken cookie and returns 200."""
        client = Client(enforce_csrf_checks=True)
        response = client.get("/auth/csrf/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("csrftoken", response.cookies)
        self.assertEqual(response.json(), {"detail": "CSRF cookie set"})

    # -------------------------------------------------------------
    # 2. Unauthenticated Session Check
    # -------------------------------------------------------------
    def test_02_unauthenticated_session_check(self):
        """Test GET /auth/user/ for anonymous user returns isAuthenticated: False."""
        client = Client()
        response = client.get("/auth/user/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"isAuthenticated": False, "username": None})

    # -------------------------------------------------------------
    # 3. Login without CSRF Token
    # -------------------------------------------------------------
    def test_03_login_without_csrf_blocked(self):
        """Test POST /auth/login/ without CSRF token is blocked with 403 Forbidden."""
        client = Client(enforce_csrf_checks=True)
        response = client.post(
            "/auth/login/",
            data=json.dumps({"username": self.username, "password": self.password}),
            content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # -------------------------------------------------------------
    # 4. Login with Invalid CSRF Token
    # -------------------------------------------------------------
    def test_04_login_with_invalid_csrf_blocked(self):
        """Test POST /auth/login/ with an invalid/tampered CSRF token is rejected with 403 Forbidden."""
        client = Client(enforce_csrf_checks=True)
        # Establish valid CSRF cookie first
        client.get("/auth/csrf/")

        # Send request with mismatched/invalid header token
        response = client.post(
            "/auth/login/",
            data=json.dumps({"username": self.username, "password": self.password}),
            content_type="application/json",
            HTTP_X_CSRFTOKEN="invalid-tampered-token-12345"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # -------------------------------------------------------------
    # 5. Login with Invalid Credentials
    # -------------------------------------------------------------
    def test_05_login_invalid_credentials(self):
        """Test POST /auth/login/ with invalid credentials returns 401 Unauthorized."""
        client = Client(enforce_csrf_checks=True)
        client.get("/auth/csrf/")
        csrf_token = client.cookies["csrftoken"].value

        response = client.post(
            "/auth/login/",
            data=json.dumps({"username": self.username, "password": "WrongPassword"}),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrf_token
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.json(), {"detail": "Invalid credentials."})

    # -------------------------------------------------------------
    # 6. Login with Valid Credentials (Active, Non-Staff User)
    # -------------------------------------------------------------
    def test_06_login_valid_credentials_active_non_staff(self):
        """Test POST /auth/login/ authenticates active, non-staff user and sets sessionid."""
        self.assertTrue(self.user.is_active)
        self.assertFalse(self.user.is_staff)

        client = Client(enforce_csrf_checks=True)
        client.get("/auth/csrf/")
        csrf_token = client.cookies["csrftoken"].value

        response = client.post(
            "/auth/login/",
            data=json.dumps({"username": self.username, "password": self.password}),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrf_token
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"isAuthenticated": True, "username": self.username})
        self.assertIn("sessionid", response.cookies)

    # -------------------------------------------------------------
    # 7. Session Persistence Across Requests and Fresh Client
    # -------------------------------------------------------------
    def test_07_session_persistence_across_requests_and_fresh_client(self):
        """Test authenticated session remains valid across requests and works in a fresh client with the session cookie."""
        client1 = Client(enforce_csrf_checks=True)
        client1.get("/auth/csrf/")
        csrf_token1 = client1.cookies["csrftoken"].value

        res_login = client1.post(
            "/auth/login/",
            data=json.dumps({"username": self.username, "password": self.password}),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrf_token1
        )
        self.assertEqual(res_login.status_code, status.HTTP_200_OK)
        session_id = client1.cookies["sessionid"].value

        # Separate request on same client remains authenticated
        res_check1 = client1.get("/auth/user/")
        self.assertEqual(res_check1.status_code, status.HTTP_200_OK)
        self.assertEqual(res_check1.json(), {"isAuthenticated": True, "username": self.username})

        # Fresh client instance without cookies is initially anonymous
        fresh_client = Client(enforce_csrf_checks=True)
        res_anon = fresh_client.get("/auth/user/")
        self.assertEqual(res_anon.json(), {"isAuthenticated": False, "username": None})

        # Attach the existing sessionid cookie to fresh client
        fresh_client.cookies["sessionid"] = session_id
        res_fresh_check = fresh_client.get("/auth/user/")
        self.assertEqual(res_fresh_check.status_code, status.HTTP_200_OK)
        self.assertEqual(res_fresh_check.json(), {"isAuthenticated": True, "username": self.username})

        # Fresh client can perform authenticated operations with its CSRF token
        fresh_client.get("/auth/csrf/")
        fresh_csrf = fresh_client.cookies["csrftoken"].value
        pred_payload = {k: v for k, v in self.sample_payload.items() if k != "name"}
        res_pred = fresh_client.post(
            "/predict/",
            data=json.dumps(pred_payload),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=fresh_csrf
        )
        self.assertEqual(res_pred.status_code, status.HTTP_200_OK)
        self.assertIn("predicted_gpa", res_pred.json())

    # -------------------------------------------------------------
    # 8. Authenticated Session Check
    # -------------------------------------------------------------
    def test_08_authenticated_session_check(self):
        """Test GET /auth/user/ for logged-in user returns isAuthenticated: True."""
        client = Client()
        client.force_login(self.user)
        response = client.get("/auth/user/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), {"isAuthenticated": True, "username": self.username})

    # -------------------------------------------------------------
    # 9. Logout Flow
    # -------------------------------------------------------------
    def test_09_logout_flow(self):
        """Test unauthenticated logout is rejected; authenticated logout terminates session."""
        client = Client(enforce_csrf_checks=True)

        # Unauthenticated logout rejected
        res_anon = client.post("/auth/logout/")
        self.assertIn(res_anon.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # Login user (Django rotates the CSRF token on login)
        client.get("/auth/csrf/")
        csrf_token_pre_login = client.cookies["csrftoken"].value
        client.post(
            "/auth/login/",
            data=json.dumps({"username": self.username, "password": self.password}),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrf_token_pre_login
        )

        # Use the fresh rotated CSRF token for the authenticated session
        csrf_token_post_login = client.cookies["csrftoken"].value

        # Authenticated logout with CSRF
        res_logout = client.post(
            "/auth/logout/",
            HTTP_X_CSRFTOKEN=csrf_token_post_login
        )
        self.assertEqual(res_logout.status_code, status.HTTP_200_OK)
        self.assertEqual(res_logout.json(), {"detail": "Successfully logged out."})

        # Subsequent session check returns unauthenticated
        res_check = client.get("/auth/user/")
        self.assertEqual(res_check.json(), {"isAuthenticated": False, "username": None})

    # -------------------------------------------------------------
    # 10. Prediction Permissions and Execution
    # -------------------------------------------------------------
    def test_10_prediction_permissions_and_execution(self):
        """Test unauthenticated POST /predict/ is rejected; authenticated POST returns predicted_gpa."""
        client = Client(enforce_csrf_checks=True)
        pred_payload = {k: v for k, v in self.sample_payload.items() if k != "name"}

        # Anonymous request rejected
        client.get("/auth/csrf/")
        csrf_token = client.cookies["csrftoken"].value
        res_anon = client.post(
            "/predict/",
            data=json.dumps(pred_payload),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrf_token
        )
        self.assertIn(res_anon.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # Login user
        client.force_login(self.user)
        res_auth = client.post(
            "/predict/",
            data=json.dumps(pred_payload),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrf_token
        )
        self.assertEqual(res_auth.status_code, status.HTTP_200_OK)
        self.assertIn("predicted_gpa", res_auth.json())
        self.assertIsInstance(res_auth.json()["predicted_gpa"], float)

    # -------------------------------------------------------------
    # 11. Student Public Reading
    # -------------------------------------------------------------
    def test_11_student_public_reading(self):
        """Test anonymous users can view student lists and individual student records."""
        student = Student.objects.create(**self.sample_payload)
        client = Client()

        # Anonymous GET /students/
        res_list = client.get("/students/")
        self.assertEqual(res_list.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(res_list.json()["count"], 1)

        # Anonymous GET /students/<id>/
        res_detail = client.get(f"/students/{student.id}/")
        self.assertEqual(res_detail.status_code, status.HTTP_200_OK)
        self.assertEqual(res_detail.json()["name"], self.sample_payload["name"])

    # -------------------------------------------------------------
    # 12. Anonymous Users Cannot Create Student
    # -------------------------------------------------------------
    def test_12_anonymous_cannot_create_student(self):
        """Test anonymous POST /students/ is rejected with 401/403."""
        client = Client(enforce_csrf_checks=True)
        client.get("/auth/csrf/")
        csrf_token = client.cookies["csrftoken"].value

        response = client.post(
            "/students/",
            data=json.dumps(self.sample_payload),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrf_token
        )
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    # -------------------------------------------------------------
    # 13. Anonymous Users Cannot Edit Student (PUT and PATCH)
    # -------------------------------------------------------------
    def test_13_anonymous_cannot_edit_student_put_or_patch(self):
        """Test anonymous PUT and PATCH requests to /students/<id>/ are rejected and record is unchanged."""
        student = Student.objects.create(**self.sample_payload)
        client = Client(enforce_csrf_checks=True)
        client.get("/auth/csrf/")
        csrf_token = client.cookies["csrftoken"].value

        # Attempt anonymous PUT
        updated_data = dict(self.sample_payload)
        updated_data["name"] = "Unauthorized Edit"
        res_put = client.put(
            f"/students/{student.id}/",
            data=json.dumps(updated_data),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrf_token
        )
        self.assertIn(res_put.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # Attempt anonymous PATCH
        res_patch = client.patch(
            f"/students/{student.id}/",
            data=json.dumps({"name": "Unauthorized Patch"}),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrf_token
        )
        self.assertIn(res_patch.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # Verify student data remains unaltered in database
        student.refresh_from_db()
        self.assertEqual(student.name, self.sample_payload["name"])

    # -------------------------------------------------------------
    # 14. Anonymous Users Cannot Delete Student
    # -------------------------------------------------------------
    def test_14_anonymous_cannot_delete_student(self):
        """Test anonymous DELETE /students/<id>/ is rejected and record persists in database."""
        student = Student.objects.create(**self.sample_payload)
        client = Client(enforce_csrf_checks=True)
        client.get("/auth/csrf/")
        csrf_token = client.cookies["csrftoken"].value

        res_del = client.delete(
            f"/students/{student.id}/",
            HTTP_X_CSRFTOKEN=csrf_token
        )
        self.assertIn(res_del.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # Verify record still exists in database
        self.assertTrue(Student.objects.filter(id=student.id).exists())

    # -------------------------------------------------------------
    # 15. Authenticated Student CRUD Operations
    # -------------------------------------------------------------
    def test_15_authenticated_student_crud(self):
        """Test authenticated user can create, update, and delete student records."""
        client = Client(enforce_csrf_checks=True)
        client.force_login(self.user)
        client.get("/auth/csrf/")
        csrf_token = client.cookies["csrftoken"].value

        # Authenticated Create (POST)
        res_create = client.post(
            "/students/",
            data=json.dumps(self.sample_payload),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrf_token
        )
        self.assertEqual(res_create.status_code, status.HTTP_201_CREATED)
        student_id = res_create.json()["id"]

        # Authenticated Update (PUT)
        updated_payload = dict(self.sample_payload)
        updated_payload["name"] = "Alex Smith Jr."
        res_update = client.put(
            f"/students/{student_id}/",
            data=json.dumps(updated_payload),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrf_token
        )
        self.assertEqual(res_update.status_code, status.HTTP_200_OK)
        self.assertEqual(res_update.json()["name"], "Alex Smith Jr.")

        # Authenticated Delete (DELETE)
        res_delete = client.delete(
            f"/students/{student_id}/",
            HTTP_X_CSRFTOKEN=csrf_token
        )
        self.assertEqual(res_delete.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Student.objects.filter(id=student_id).exists())

    # -------------------------------------------------------------
    # 16. Category A: Filter and Ordering Fix Verification
    # -------------------------------------------------------------
    def test_16_category_a_filter_and_ordering(self):
        """Verify min_attendance filter and ordering on updated fields work without FieldError."""
        Student.objects.create(**self.sample_payload)

        client = Client()
        # Test filtering by min_attendance (points to attendance_rate)
        res_filter = client.get("/students/?min_attendance=0.80")
        self.assertEqual(res_filter.status_code, status.HTTP_200_OK)
        self.assertEqual(res_filter.json()["count"], 1)

        # Test ordering by attendance_rate, previous_gpa, age, study_hours_daily
        for order_field in ["attendance_rate", "-previous_gpa", "age", "-study_hours_daily"]:
            res_order = client.get(f"/students/?ordering={order_field}")
            self.assertEqual(res_order.status_code, status.HTTP_200_OK)

    # -------------------------------------------------------------
    # 17. Category C: Stats Endpoint and Configurable Pagination
    # -------------------------------------------------------------
    def test_17_category_c_stats_and_pagination(self):
        """Verify /students/stats/ returns aggregated calculations with None checks, and pagination respects page_size."""
        client = Client()

        # Stats on empty database (testing explicit None checks)
        res_stats_empty = client.get("/students/stats/")
        self.assertEqual(res_stats_empty.status_code, status.HTTP_200_OK)
        self.assertEqual(res_stats_empty.json()["total_students"], 0)
        self.assertEqual(res_stats_empty.json()["avg_previous_gpa"], 0.0)

        # Populate a student
        Student.objects.create(**self.sample_payload)
        res_stats = client.get("/students/stats/")
        self.assertEqual(res_stats.status_code, status.HTTP_200_OK)
        data = res_stats.json()
        self.assertEqual(data["total_students"], 1)
        self.assertEqual(data["avg_previous_gpa"], 3.25)
        self.assertEqual(data["avg_attendance_rate"], 0.88)
        self.assertIn("subject_averages", data)
        self.assertEqual(data["subject_averages"]["math"], 75.0)

        # Configurable pagination: page_size=20
        res_page = client.get("/students/?page_size=20")
        self.assertEqual(res_page.status_code, status.HTTP_200_OK)
        self.assertIn("results", res_page.json())
