import React from 'react';
import {
  MessageSquareDashed,
  Inbox,
  Flame,
  MessageSquare,
  Search,
  BellOff,
  User,
  Heart,
  FileText,
} from 'lucide-react';
import Button from './Button';

// Safe mapping from emoji/key to polished Lucide icons
const ICON_MAP = {
  '👀': MessageSquareDashed,
  '💤': MessageSquareDashed,
  '🔥': Flame,
  '💬': MessageSquare,
  '🔍': Search,
  '🔔': BellOff,
  '👤': User,
  '❤️': Heart,
  '📝': FileText,
  '✍️': FileText,
  '📭': Inbox,
};

const EmptyState = ({
  icon: IconProp,
  emoji,
  title,
  message,
  actionText,
  actionLabel,
  onAction,
  actionIcon,
  className = '',
}) => {
  const buttonText = actionText || actionLabel;

  // Resolve icon component/element
  let renderedIcon = null;
  if (IconProp) {
    if (React.isValidElement(IconProp)) {
      renderedIcon = IconProp;
    } else if (
      typeof IconProp === 'function' ||
      (typeof IconProp === 'object' && IconProp !== null)
    ) {
      const IconComponent = IconProp;
      renderedIcon = <IconComponent className="w-7 h-7 stroke-[1.75]" />;
    } else {
      renderedIcon = IconProp;
    }
  } else if (emoji && ICON_MAP[emoji]) {
    const Mapped = ICON_MAP[emoji];
    renderedIcon = <Mapped className="w-7 h-7 stroke-[1.75]" />;
  } else if (emoji) {
    renderedIcon = <span className="text-2xl">{emoji}</span>;
  } else {
    renderedIcon = <MessageSquareDashed className="w-7 h-7 stroke-[1.75]" />;
  }

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white border border-dashed border-[var(--border-color)] shadow-xs transition-all ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[var(--color-primary)] flex items-center justify-center mb-4 border border-purple-100 shadow-xs">
        {renderedIcon}
      </div>

      {title && (
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 font-display tracking-tight">
          {title}
        </h3>
      )}

      {message && (
        <p className="text-sm text-slate-500 max-w-sm mb-5 leading-relaxed">
          {message}
        </p>
      )}

      {buttonText && onAction && (
        <Button
          onClick={onAction}
          size="sm"
          variant="primary"
          className="shadow-xs font-semibold px-5"
        >
          {actionIcon && (
            <span className="mr-1.5 inline-flex items-center">
              {React.isValidElement(actionIcon)
                ? actionIcon
                : typeof actionIcon === 'function' || (typeof actionIcon === 'object' && actionIcon !== null)
                ? React.createElement(actionIcon, { className: 'w-4 h-4' })
                : actionIcon}
            </span>
          )}
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
