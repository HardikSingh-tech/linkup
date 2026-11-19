import React from 'react';

export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg border border-brand-border shadow-sm overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
