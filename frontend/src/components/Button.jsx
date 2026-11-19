import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
}) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-full transition-all focus:outline-none select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-brand-blue text-white hover:bg-brand-hover active:scale-95 shadow-sm',
    secondary: 'border border-brand-blue text-brand-blue hover:bg-brand-light active:scale-95',
    outline: 'border border-gray-400 text-gray-700 hover:bg-gray-100 hover:border-gray-600',
    ghost: 'text-gray-600 hover:bg-gray-100 active:bg-gray-200',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-3 py-1 text-xs gap-1',
    md: 'px-4 py-1.5 text-sm gap-1.5',
    lg: 'px-6 py-2.5 text-base gap-2',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
