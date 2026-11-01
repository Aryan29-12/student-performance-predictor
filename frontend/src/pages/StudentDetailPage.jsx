import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit2, ArrowLeft, Cpu } from 'lucide-react';
import { studentService } from '../api/studentService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FORM_SECTIONS, CATEGORICAL_OPTIONS } from '../utils/constants';

function formatValue(field, value) {
  if (value === null || value === undefined || value === '') return '—';

  const options = CATEGORICAL_OPTIONS[field.name];
  if (options) {
    const match = options.find((o) => String(o.value) === String(value));
    return match ? match.label : String(value);
  }

  if (field.name === 'attendance_rate') {
    return `${(parseFloat(value) * 100).toFixed(1)}%`;
  }
  if (field.name === 'previous_gpa') {
    return `${parseFloat(value).toFixed(2)} / 4.00`;
  }
  if (field.name === 'family_income') {
    return parseFloat(value).toFixed(4);
  }

  return String(value);
}

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    studentService.getStudent(id)
      .then((data) => { if (!cancelled) setStudent(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) {
    return (
      <div className="page">
        <div className="alert alert--danger">{error}</div>
        <button className="btn btn--ghost" onClick={() => navigate('/students')}>← Back</button>
      </div>
    );
  }
  if (!student) return null;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <button className="btn btn--ghost btn--sm" onClick={() => navigate('/students')} style={{ marginBottom: '0.5rem' }}>
            <ArrowLeft size={14} /> Back
          </button>
          <h1 className="page-title">{student.name}</h1>
          <p className="page-subtitle">Student ID: {student.id}</p>
        </div>
        <div className="page-header__actions">
          <button
            className="btn btn--secondary"
            onClick={() => navigate('/predict', { state: { prefill: student } })}
          >
            <Cpu size={16} /> Predict GPA
          </button>
          {user?.isAuthenticated && (
            <button className="btn btn--primary" onClick={() => navigate(`/students/${id}/edit`)}>
              <Edit2 size={16} /> Edit
            </button>
          )}
        </div>
      </div>

      {/* Field sections */}
      {FORM_SECTIONS.map((section) => (
        <div key={section.id} className="card" style={{ marginBottom: '1rem' }}>
          <div className="card__header">
            <span className="card__title">{section.title}</span>
          </div>
          <div className="detail-grid">
            {section.fields.map((field) => (
              <div key={field.name} className="detail-item">
                <dt className="detail-item__label">{field.label}</dt>
                <dd className="detail-item__value">{formatValue(field, student[field.name])}</dd>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

