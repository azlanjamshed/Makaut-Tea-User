import React from 'react';

const Card = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[var(--border-color)] rounded-3xl p-4 sm:p-5 transition-all duration-150 shadow-sm ${
        hoverable ? 'hover:border-slate-300 hover:shadow cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
