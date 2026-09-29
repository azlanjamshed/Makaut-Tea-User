import React, { useState } from 'react';
import { resolveImageUrl, getInitials } from '../../utils/helpers';
import { User, ShieldAlert, VenetianMask } from 'lucide-react';

const Avatar = ({
  src,
  name = 'Anonymous',
  isAnonymous = false,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm font-semibold',
    lg: 'w-14 h-14 text-base font-semibold',
    xl: 'w-20 h-20 text-2xl font-bold',
  };

  const imageSrc = !isAnonymous && src && !imgError ? resolveImageUrl(src) : null;

  return (
    <div
      className={`relative shrink-0 aspect-square rounded-2xl overflow-hidden flex items-center justify-center border border-black/5 ${
        sizes[size] || sizes.md
      } ${className}`}
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover"
        />
      ) : isAnonymous ? (
        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-purple-300">
          <VenetianMask className="w-1/2 h-1/2 stroke-[2]" />
        </div>
      ) : (
        <div
          className="w-full h-full bg-sky-700 flex items-center justify-center text-white font-medium"
        >
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

export default Avatar;
