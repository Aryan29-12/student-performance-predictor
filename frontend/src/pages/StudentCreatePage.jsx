import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentForm from '../components/students/StudentForm';
import { studentService } from '../api/studentService';
import { useToast } from '../App';

export default function StudentCreatePage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  async function handleSubmit(payload) {
    setLoading(true);
    setServerErrors({});
    try {
      const created = await studentService.createStudent(payload);
      showToast(`Student "${created.name}" created successfully.`, 'success');
      navigate('/students');
    } catch (err) {
      if (err.fieldErrors) {
        setServerErrors(err.fieldErrors);
        showToast('Please fix the highlighted errors.', 'error');
      } else {
        showToast(`Error: ${err.message}`, 'error');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Add Student</h1>
          <p className="page-subtitle">Fill in all sections to create a new student record.</p>
        </div>
        <button className="btn btn--ghost" onClick={() => navigate('/students')}>
          Cancel
        </button>
      </div>

      <div className="card">
        <StudentForm
          onSubmit={handleSubmit}
          loading={loading}
          serverErrors={serverErrors}
          isEdit={false}
          includeNameField
        />
      </div>
    </div>
  );
}

