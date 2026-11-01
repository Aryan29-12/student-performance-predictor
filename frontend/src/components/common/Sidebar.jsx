import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, UserPlus, Sparkles, GraduationCap } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__logo">
          <GraduationCap size={28} />
        </div>
        <div>
          <div className="sidebar__brand">EduMetrics</div>
          <div className="sidebar__subtitle">Performance Prediction</div>
        </div>
      </div>

      <nav className="sidebar__nav">
        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/students" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <Users size={18} />
          <span>Students Directory</span>
        </NavLink>

        <NavLink to="/students/new" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <UserPlus size={18} />
          <span>Add Student</span>
        </NavLink>

        <NavLink to="/predict" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <Sparkles size={18} />
          <span>GPA Prediction</span>
        </NavLink>
      </nav>

      <div className="sidebar__footer">
        Django REST · ML Regression
      </div>
    </aside>
  );
}
