import React from 'react';
import {
  Inbox,
  Flame,
  MessageSquare,
  Search,
  Bell,
  User,
  Heart,
  FileText,
  AlertTriangle,
  Users,
  Lightbulb,
  Ghost,
} from 'lucide-react';
import Button from './Button';

const EMOJI_ICON_MAP = {
  '📭': Inbox,
  '💤': Ghost,
  '🔥': Flame,
  '💬': MessageSquare,
  '🔍': Search,
  '🔔': Bell,
  '👤': User,
  '👥': Users,
  '❤️': Heart,
  '📝': FileText,
  '✍️': FileText,
  '🚨': AlertTriangle,
  '💡': Lightbulb,
};

const EmptyState = ({
  icon,
  emoji,
  title,
  message,
  actionText,
  onAction,
  className = '',
}) => {
  const MappedIcon = emoji && EMOJI_ICON_MAP[emoji] ? EMOJI_ICON_MAP[emoji] : null;

  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-3xl bg-white border border-dashed border-[var(--border-color)] shadow-sm ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-[var(--color-primary)] mb-4 border border-[var(--border-color)]">
        {icon ? (
          icon
        ) : MappedIcon ? (
          <MappedIcon className="w-7 h-7 stroke-[1.75]" />
        ) : (
          <MessageSquare className="w-7 h-7 stroke-[1.75]" />
        )}
      </div>

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
