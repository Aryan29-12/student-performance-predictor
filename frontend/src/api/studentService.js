import apiClient from './client';

export const studentService = {
  // Paginated list with search, filter, and ordering
  async getStudents({ page = 1, pageSize = 10, search = '', gender = '', minAttendance = '', ordering = '' } = {}) {
    const params = {
      page,
      page_size: pageSize,
    };
    if (search && search.trim()) params.search = search.trim();
    if (gender !== '' && gender !== null && gender !== undefined) params.gender = gender;
    if (minAttendance !== '' && minAttendance !== null && minAttendance !== undefined) params.min_attendance = minAttendance;
    if (ordering) params.ordering = ordering;

    const res = await apiClient.get('/students/', { params });
    return res.data; // { count, next, previous, results: [...] }
  },

  // Database-wide aggregated statistics
  async getStudentStats() {
    const res = await apiClient.get('/students/stats/');
    return res.data; // { total_students, avg_previous_gpa, avg_attendance_rate, avg_study_hours_daily, subject_averages }
  },

  // Single student record
  async getStudent(id) {
    const res = await apiClient.get(`/students/${id}/`);
    return res.data;
  },

  // Create student
  async createStudent(data) {
    const res = await apiClient.post('/students/', data);
    return res.data;
  },

  // Update student (PUT)
  async updateStudent(id, data) {
    const res = await apiClient.put(`/students/${id}/`, data);
    return res.data;
  },

  // Delete student (DELETE)
  async deleteStudent(id) {
    const res = await apiClient.delete(`/students/${id}/`);
    return res.data;
  },
};

