import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ isAuthenticated: false, username: null });
  const [loading, setLoading] = useState(true);

  // Check active session on initial load
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        // Initial handshake to plant CSRF cookie if absent
        await authService.initCsrf();
        // Check if an existing session cookie is valid
        const session = await authService.checkSession();
        if (isMounted) {
          setUser(session);
        }
      } catch (err) {
        console.warn('Initial session check failed:', err.message);
        if (isMounted) {
          setUser({ isAuthenticated: false, username: null });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (username, password) => {
    const data = await authService.login(username, password);
    setUser(data);
    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser({ isAuthenticated: false, username: null });
    }
  };

  const refreshUser = async () => {
    try {
      const session = await authService.checkSession();
      setUser(session);
      return session;
    } catch {
      setUser({ isAuthenticated: false, username: null });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

