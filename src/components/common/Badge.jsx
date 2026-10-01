import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
  icon: Icon,
}) => {
  const variants = {
    default: 'bg-slate-100 border border-slate-200 text-slate-700',
    primary: 'bg-indigo-50 border border-indigo-200 text-indigo-700',
    purple: 'bg-purple-50 border border-purple-200 text-purple-700',
    success: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
    danger: 'bg-rose-50 border border-rose-200 text-rose-700',
    warning: 'bg-amber-50 border border-amber-200 text-amber-800',
    anon: 'bg-slate-100 border border-slate-200 text-slate-600',
    trending: 'bg-amber-50 border border-amber-200 text-amber-800 font-bold',
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 gap-1 rounded-lg',
    sm: 'text-xs px-2.5 py-1 gap-1.5 rounded-xl',
    md: 'text-sm px-3 py-1.5 gap-2 rounded-xl',
  };

  return (
    <span
      className={`inline-flex items-center font-medium select-none ${
        variants[variant] || variants.default
      } ${sizes[size] || sizes.sm} ${className}`}
    >
      {Icon && (
        React.isValidElement(Icon) ? (
          Icon
        ) : typeof Icon === 'function' || (typeof Icon === 'object' && Icon !== null) ? (
          <Icon className="w-3.5 h-3.5 shrink-0" />
        ) : (
          Icon
        )
      )}
      {children}
    </span>
  );
};

export default Badge;
