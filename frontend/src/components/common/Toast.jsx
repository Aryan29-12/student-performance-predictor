import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ICON_MAP = {
  success: <CheckCircle2 size={17} />,
  error:   <AlertCircle size={17} />,
  warning: <AlertTriangle size={17} />,
  info:    <Info size={17} />,
};

export default function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;
  return (
    <div className={`toast toast--${type}`}>
      {ICON_MAP[type] || ICON_MAP.info}
      <span style={{ flex: 1 }}>{message}</span>
      <button className="toast__close" onClick={onClose} aria-label="Dismiss">
        <X size={15} />
      </button>
    </div>
  );
}
