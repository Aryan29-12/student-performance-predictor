import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StudentForm from '../components/students/StudentForm';
import { studentService } from '../api/studentService';
import { useToast } from '../App';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function StudentEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [initialData, setInitialData] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState({});

  useEffect(() => {
    let cancelled = false;
    setFetchLoading(true);
    studentService.getStudent(id)
      .then((data) => { if (!cancelled) setInitialData(data); })
      .catch((err) => { if (!cancelled) setFetchError(err.message); })
      .finally(() => { if (!cancelled) setFetchLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  async function handleSubmit(payload) {
    setSubmitLoading(true);
    setServerErrors({});
    try {
      await studentService.updateStudent(id, payload);
      showToast('Student updated successfully.', 'success');
      navigate(`/students/${id}`);
    } catch (err) {
      if (err.fieldErrors) {
        setServerErrors(err.fieldErrors);
        showToast('Please fix the highlighted errors.', 'error');
      } else {
        showToast(`Error: ${err.message}`, 'error');
      }
    } finally {
      setSubmitLoading(false);
    }
  }

  if (fetchLoading) return <LoadingSpinner fullPage />;
  if (fetchError) {
    return (
      <div className="page">
        <div className="alert alert--danger">{fetchError}</div>
        <button className="btn btn--ghost" onClick={() => navigate('/students')}>← Back</button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Student</h1>
          <p className="page-subtitle">{initialData?.name}</p>
        </div>
        <button className="btn btn--ghost" onClick={() => navigate(`/students/${id}`)}>
          Cancel
        </button>
      </div>

      <div className="card">
        <StudentForm
          initialData={initialData}
          onSubmit={handleSubmit}
          loading={submitLoading}
          serverErrors={serverErrors}
          isEdit
          includeNameField
        />
      </div>
    </div>
  );
}

