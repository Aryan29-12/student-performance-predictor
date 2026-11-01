import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserCheck, UserX, LogIn, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="navbar__title">
        Academic Analytics &amp; Performance Predictor
      </div>
      <div className="navbar__right">
        <Link to="/predict" className="btn btn--ghost btn--sm">
          <Sparkles size={15} />
          Predict GPA
        </Link>

        {user?.isAuthenticated ? (
          <>
            <span className="navbar__user-badge navbar__user-badge--auth">
              <UserCheck size={14} />
              {user.username}
            </span>
            <button className="btn btn--ghost btn--sm" onClick={handleLogout}>
              <LogOut size={15} />
              Log Out
            </button>
          </>
        ) : (
          <>
            <span className="navbar__user-badge">
              <UserX size={14} />
              Guest (Read-Only)
            </span>
            <Link to="/login" className="btn btn--primary btn--sm">
              <LogIn size={15} />
              Log In
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
