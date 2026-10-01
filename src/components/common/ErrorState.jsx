import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

const ErrorState = ({
  title = 'Something went wrong',
  message = 'We could not load the content. Please check your connection and try again.',
  icon: IconProp,
  onRetry,
  actionText = 'Try Again',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white border border-dashed border-rose-200 shadow-xs transition-all ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mb-4 shadow-xs">
        {IconProp ? (
          React.isValidElement(IconProp) ? (
            IconProp
          ) : typeof IconProp === 'function' ||
            (typeof IconProp === 'object' && IconProp !== null) ? (
            React.createElement(IconProp, { className: 'w-7 h-7 stroke-[1.75]' })
          ) : (
            IconProp
          )
        ) : (
          <AlertCircle className="w-7 h-7 stroke-[1.75]" />
        )}
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 font-display tracking-tight">
        {title}
      </h3>

      {message && (
        <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
          {message}
        </p>
      )}

      {onRetry && (
        <Button
          onClick={onRetry}
          variant="primary"
          size="sm"
          icon={RotateCcw}
          className="shadow-xs font-semibold px-5"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
