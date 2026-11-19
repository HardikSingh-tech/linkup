import React from 'react';

export default function Avatar({ src, name, size = 'md', className = '' }) {
  const sizeMap = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base font-semibold',
    xl: 'w-24 h-24 text-xl font-bold border-4 border-white',
    xxl: 'w-32 h-32 text-2xl font-bold border-4 border-white',
  };

  const initials = (name || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('');

  if (!src) {
    return (
      <div
        className={`${sizeMap[size] || sizeMap.md} rounded-full bg-slate-300 text-slate-700 flex items-center justify-center select-none flex-shrink-0 ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || 'Avatar'}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=faces';
      }}
      className={`${sizeMap[size] || sizeMap.md} rounded-full object-cover flex-shrink-0 ${className}`}
    />
  );
}
