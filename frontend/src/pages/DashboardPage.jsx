import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Clock, Activity } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import SubjectRadar from '../components/dashboard/SubjectRadar';
import GpaChart from '../components/dashboard/GpaChart';
import { studentService } from '../api/studentService';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

function formatPct(val) {
  if (val === null || val === undefined) return '—';
  return `${(parseFloat(val) * 100).toFixed(1)}%`;
}

function formatNum(val, decimals = 2) {
  if (val === null || val === undefined) return '—';
  return parseFloat(val).toFixed(decimals);
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stats, setStats] = useState(null);
  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [statsRes, studentsRes] = await Promise.all([
          studentService.getStudentStats(),
          studentService.getStudents({ page: 1, page_size: 10 }),
        ]);
        if (!cancelled) {
          setStats(statsRes);
          setRecentStudents(studentsRes.results || []);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <LoadingSpinner fullPage />;

  if (error) {
    return (
      <div className="alert alert--danger" style={{ margin: '2rem' }}>
        Failed to load dashboard data: {error}
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of student performance metrics</p>
        </div>
        <div className="page-header__actions">
          {user?.isAuthenticated && (
            <>
              <button className="btn btn--primary" onClick={() => navigate('/students/new')}>
                + Add Student
              </button>
              <button className="btn btn--secondary" onClick={() => navigate('/predict')}>
                Run Prediction
              </button>
            </>
          )}
          <button className="btn btn--ghost" onClick={() => navigate('/students')}>
            View All Students
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        <StatCard
          label="Total Students"
          value={stats?.total_students ?? '—'}
          icon={Users}
          color="primary"
        />
        <StatCard
          label="Avg Previous GPA"
          value={formatNum(stats?.avg_previous_gpa)}
          icon={TrendingUp}
          sub="Scale 0.00 – 4.00"
          color="success"
        />
        <StatCard
          label="Avg Attendance Rate"
          value={formatPct(stats?.avg_attendance_rate)}
          icon={Activity}
          color="info"
        />
        <StatCard
          label="Avg Study Hours / Day"
          value={formatNum(stats?.avg_study_hours_daily, 1)}
          icon={Clock}
          sub="Hours per day"
          color="warning"
        />
      </div>

      {/* Charts row */}
      <div className="charts-grid">
        <SubjectRadar subjectAverages={stats?.subject_averages} />
        <GpaChart students={recentStudents} />
      </div>

      {/* Recent students table */}
      {recentStudents.length > 0 && (
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card__header">
            <span className="card__title">Recent Students</span>
            <button className="btn btn--ghost btn--sm" onClick={() => navigate('/students')}>
              View All →
            </button>
          </div>
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Previous GPA</th>
                  <th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((s) => (
                  <tr
                    key={s.id}
                    className="table__row--clickable"
                    onClick={() => navigate(`/students/${s.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{s.name}</td>
                    <td>{s.age}</td>
                    <td>{parseFloat(s.previous_gpa).toFixed(2)}</td>
                    <td>{(parseFloat(s.attendance_rate) * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
