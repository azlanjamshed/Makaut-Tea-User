import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Reply, Flame, Sparkles, Trash2, CheckCircle } from 'lucide-react';
import Avatar from '../common/Avatar';
import { timeAgo } from '../../utils/helpers';

const NotificationItem = ({
  notification,
  onMarkRead,
  onDelete,
  className = '',
}) => {
  const navigate = useNavigate();

  if (!notification) return null;

  const getTypeIcon = () => {
    switch (notification.type) {
      case 'comment':
        return <MessageSquare className="w-3.5 h-3.5 text-blue-400" />;
      case 'reply':
        return <Reply className="w-3.5 h-3.5 text-purple-400" />;
      case 'reaction':
        return <span className="text-xs">{notification.reactionEmoji || '🔥'}</span>;
      case 'trending':
        return <Flame className="w-3.5 h-3.5 text-sky-400 fill-sky-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-sky-400" />;
    }
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkRead?.(notification.id || notification._id);
    }
    const targetPostId =
      notification.post?._id || notification.post?.id || notification.post;
    if (targetPostId) {
      navigate(`/rants/${targetPostId}`);
    }
  };

  const senderName = notification.isAnonymous
    ? notification.sender?.anonymousUsername || 'Someone'
    : notification.sender?.name || 'Campus Student';

  const senderImage = notification.isAnonymous ? '' : notification.sender?.image;

  return (
    <div
      onClick={handleClick}
      className={`flex items-start gap-3 p-4 rounded-2xl transition-all cursor-pointer border ${
        notification.isRead
          ? 'bg-white border-[var(--border-color)] text-slate-600 hover:bg-slate-50'
          : 'bg-purple-50/40 border-purple-200 text-slate-900 shadow-sm hover:border-[var(--color-primary)]'
      } ${className}`}
    >
      {/* Icon badge or avatar */}
      <div className="relative shrink-0">
        <Avatar
          src={senderImage}
          name={senderName}
          isAnonymous={Boolean(notification.isAnonymous)}
          size="sm"
        />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border border-[var(--border-color)] flex items-center justify-center shadow-xs">
          {getTypeIcon()}
        </div>
      </div>

      {/* Message and time */}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-medium leading-snug break-words">
          {notification.message}
        </p>
        <span className="text-[11px] text-slate-500 mt-1 block">
          {timeAgo(notification.createdAt)}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 shrink-0 self-center">
        {!notification.isRead && (
          <span className="w-2 h-2 rounded-full bg-sky-400" title="Unread" />
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(notification.id || notification._id);
          }}
          className="p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors ml-1"
          title="Delete notification"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default NotificationItem;
