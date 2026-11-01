import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import ConfirmModal from '../common/ConfirmModal';

function formatAttendance(val) {
  const n = parseFloat(val);
  return isNaN(n) ? '—' : `${(n * 100).toFixed(1)}%`;
}

function formatGpa(val) {
  const n = parseFloat(val);
  return isNaN(n) ? '—' : n.toFixed(2);
}

export default function StudentTable({ students, onDelete, isAuthenticated, loading }) {
  const navigate = useNavigate();
  const [confirmTarget, setConfirmTarget] = useState(null);

  function handleDeleteClick(student) {
    setConfirmTarget(student);
  }

  function handleConfirmDelete() {
    if (confirmTarget) {
      onDelete(confirmTarget.id);
      setConfirmTarget(null);
    }
  }

  if (loading) {
    return (
      <div className="flex-center" style={{ padding: '3rem' }}>
        <div className="spinner" />
      </div>
    );
  }

  if (!students || students.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state__message">No students found matching the current filters.</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Previous GPA</th>
              <th>Attendance</th>
              <th>Study Hrs / Day</th>
              <th className="table__actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="table__name-cell">
                  <button
                    className="link-btn"
                    onClick={() => navigate(`/students/${student.id}`)}
                  >
                    {student.name}
                  </button>
                </td>
                <td>{student.age}</td>
                <td>Category {student.gender}</td>
                <td>{formatGpa(student.previous_gpa)}</td>
                <td>{formatAttendance(student.attendance_rate)}</td>
                <td>{student.study_hours_daily}</td>
                <td>
                  <div className="table__actions">
                    <button
                      className="btn btn--icon btn--ghost"
                      title="View student"
                      onClick={() => navigate(`/students/${student.id}`)}
                    >
                      <Eye size={16} />
                    </button>
                    {isAuthenticated && (
                      <>
                        <button
                          className="btn btn--icon btn--ghost"
                          title="Edit student"
                          onClick={() => navigate(`/students/${student.id}/edit`)}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn btn--icon btn--danger-ghost"
                          title="Delete student"
                          onClick={() => handleDeleteClick(student)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmTarget && (
        <ConfirmModal
          title="Delete Student"
          message={`Are you sure you want to permanently delete "${confirmTarget.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmTarget(null)}
        />
      )}
    </>
  );
}

