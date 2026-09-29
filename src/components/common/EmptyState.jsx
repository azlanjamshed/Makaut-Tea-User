import React from 'react';
import Button from './Button';

const EmptyState = ({
  icon,
  emoji,
  title,
  message,
  actionText,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white border border-dashed border-[var(--border-color)] shadow-sm ${className}`}
    >
      {emoji ? (
        <span className="text-4xl sm:text-5xl mb-3 select-none">
          {emoji}
        </span>
      ) : icon ? (
        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-500 mb-4 border border-[var(--border-color)]">
          {icon}
        </div>
      ) : (
        <span className="text-4xl mb-3">💬</span>
      )}

      {title && (
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1 font-display">
          {title}
        </h3>
      )}

      {message && (
        <p className="text-sm text-slate-500 max-w-xs mb-5 leading-relaxed">
          {message}
        </p>
      )}

      {actionText && onAction && (
        <Button onClick={onAction} size="sm" variant="primary">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
