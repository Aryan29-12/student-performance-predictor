export function validateStudentForm(data, isStudentModel = true) {
  const errors = {};

  if (isStudentModel) {
    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      errors.name = 'Full name is required.';
    } else if (data.name.length > 100) {
      errors.name = 'Name cannot exceed 100 characters.';
    }
  }

  // Backend enforced restrictions
  if (data.age === undefined || data.age === '' || Number(data.age) < 0) {
    errors.age = 'Age must be 0 or greater.';
  }

  const att = Number(data.attendance_rate);
  if (data.attendance_rate === undefined || data.attendance_rate === '' || isNaN(att) || att < 0 || att > 1) {
    errors.attendance_rate = 'Attendance rate must be between 0.00 and 1.00 (e.g. 0.85).';
  }

  const gpa = Number(data.previous_gpa);
  if (data.previous_gpa === undefined || data.previous_gpa === '' || isNaN(gpa) || gpa < 0 || gpa > 4) {
    errors.previous_gpa = 'Previous GPA must be between 0.00 and 4.00.';
  }

  const exam = Number(data.standardized_exam_score);
  if (data.standardized_exam_score === undefined || data.standardized_exam_score === '' || isNaN(exam) || exam < 0 || exam > 100) {
    errors.standardized_exam_score = 'Standardized exam score must be between 0 and 100.';
  }

  // Sensible frontend bounds based on dataset realities
  const assign = Number(data.assignment_avg);
  if (data.assignment_avg === undefined || data.assignment_avg === '' || isNaN(assign) || assign < 0 || assign > 140) {
    errors.assignment_avg = 'Assignment average must be between 0 and 140.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

