import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

const ErrorState = ({
  title = 'Something went wrong',
  message = 'We could not load the content. Please check your connection and try again.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-rose-950/20 border border-rose-500/20 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-rose-900/40 text-rose-400 flex items-center justify-center mb-3 border border-rose-500/30">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-rose-200 mb-1 font-display">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-slate-400 max-w-xs mb-5">
        {message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="secondary"
          size="sm"
          icon={RotateCcw}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
