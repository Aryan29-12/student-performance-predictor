import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentTable from '../components/students/StudentTable';
import StudentFilter from '../components/students/StudentFilter';
import Pagination from '../components/students/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { studentService } from '../api/studentService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../App';

export default function StudentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [ordering, setOrdering] = useState('');

  const [students, setStudents] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await studentService.getStudents({
        page,
        pageSize,
        search,
        gender,
        ordering,
      });
      setStudents(data.results || []);
      setTotalCount(data.count || 0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search, gender, ordering]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  function handleSearchChange(val) {
    setSearch(val);
    setPage(1);
  }

  function handleGenderChange(val) {
    setGender(val);
    setPage(1);
  }

  function handleOrderingChange(val) {
    setOrdering(val);
    setPage(1);
  }

  function handleReset() {
    setSearch('');
    setGender('');
    setOrdering('');
    setPage(1);
  }

  function handlePageSizeChange(newSize) {
    setPageSize(newSize);
    setPage(1);
  }

  async function handleDelete(id) {
    try {
      await studentService.deleteStudent(id);
      showToast('Student deleted successfully.', 'success');
      fetchStudents();
    } catch (err) {
      showToast(`Delete failed: ${err.message}`, 'error');
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">{totalCount} student{totalCount !== 1 ? 's' : ''} in database</p>
        </div>
        {user?.isAuthenticated && (
          <button className="btn btn--primary" onClick={() => navigate('/students/new')}>
            + Add Student
          </button>
        )}
      </div>

      <StudentFilter
        search={search}
        onSearchChange={handleSearchChange}
        gender={gender}
        onGenderChange={handleGenderChange}
        ordering={ordering}
        onOrderingChange={handleOrderingChange}
        onReset={handleReset}
      />

      {error && (
        <div className="alert alert--danger" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <StudentTable
        students={students}
        onDelete={handleDelete}
        isAuthenticated={user?.isAuthenticated}
        loading={loading}
      />

      <Pagination
        currentPage={page}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={handlePageSizeChange}
      />
    </div>
  );
}
