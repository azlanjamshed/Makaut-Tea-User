import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  icon: Icon,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] select-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variants = {
    primary:
      'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-sm focus:ring-[var(--color-primary)]',
    secondary:
      'bg-white border border-[var(--border-color)] text-slate-700 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 shadow-sm focus:ring-slate-300',
    accent:
      'bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white shadow-sm focus:ring-[var(--color-accent)]',
    danger:
      'bg-rose-600 text-white hover:bg-rose-700 shadow-sm focus:ring-rose-500',
    ghost:
      'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-300',
    outline:
      'border border-[var(--border-color)] text-[var(--color-primary)] hover:bg-purple-50 focus:ring-[var(--color-primary)]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5',
    md: 'text-sm px-4 py-2.5 h-11 gap-2',
    lg: 'text-base px-6 py-3.5 h-13 gap-2.5 font-semibold',
    icon: 'p-2.5 h-11 w-11 justify-center rounded-xl',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${
        sizes[size] || sizes.md
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        <>
          {Icon && (
            React.isValidElement(Icon) ? (
              Icon
            ) : typeof Icon === 'function' || (typeof Icon === 'object' && Icon !== null) ? (
              <Icon className="w-4 h-4 shrink-0" />
            ) : (
              Icon
            )
          )}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
