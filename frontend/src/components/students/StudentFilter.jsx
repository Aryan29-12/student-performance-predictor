import React, { useEffect, useRef } from 'react';
import { Search, RotateCcw } from 'lucide-react';

const GENDER_OPTIONS = [
  { value: '', label: 'All Genders' },
  { value: '0', label: 'Category 0' },
  { value: '1', label: 'Category 1' },
  { value: '2', label: 'Category 2' },
];

const ORDERING_OPTIONS = [
  { value: '', label: 'Default Order' },
  { value: 'age', label: 'Age ↑' },
  { value: '-age', label: 'Age ↓' },
  { value: 'attendance_rate', label: 'Attendance ↑' },
  { value: '-attendance_rate', label: 'Attendance ↓' },
  { value: 'previous_gpa', label: 'Previous GPA ↑' },
  { value: '-previous_gpa', label: 'Previous GPA ↓' },
  { value: 'study_hours_daily', label: 'Study Hours ↑' },
  { value: '-study_hours_daily', label: 'Study Hours ↓' },
];

export default function StudentFilter({
  search,
  onSearchChange,
  gender,
  onGenderChange,
  ordering,
  onOrderingChange,
  onReset,
}) {
  const debounceRef = useRef(null);

  function handleSearchInput(e) {
    const val = e.target.value;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchChange(val);
    }, 300);
  }

  // Clean up on unmount
  useEffect(() => () => clearTimeout(debounceRef.current), []);

  return (
    <div className="filter-bar">
      <div className="filter-bar__search">
        <Search size={16} className="filter-bar__search-icon" />
        <input
          type="text"
          className="input filter-bar__search-input"
          placeholder="Search by name…"
          defaultValue={search}
          onChange={handleSearchInput}
        />
      </div>

      <select
        className="input filter-bar__select"
        value={gender}
        onChange={(e) => onGenderChange(e.target.value)}
      >
        {GENDER_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select
        className="input filter-bar__select"
        value={ordering}
        onChange={(e) => onOrderingChange(e.target.value)}
      >
        {ORDERING_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <button className="btn btn--ghost btn--sm" onClick={onReset} title="Reset filters">
        <RotateCcw size={14} />
        Reset
      </button>
    </div>
  );
}

