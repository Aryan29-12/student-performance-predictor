import React from 'react';

export default function LoadingSpinner({ fullPage = false, message = 'Loading…' }) {
  if (fullPage) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        <span>{message}</span>
      </div>
    );
  }
  return (
    <div className="flex-center" style={{ padding: '3rem' }}>
      <div className="spinner" />
    </div>
  );
}
