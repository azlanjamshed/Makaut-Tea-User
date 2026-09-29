import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reply, Trash2, Flag, ChevronDown, ChevronUp, Send, ShieldCheck } from 'lucide-react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { timeAgo } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import * as commentsApi from '../../api/comments';
import { useToast } from '../../context/ToastContext';

const CommentCard = ({
  comment,
  onDeleteComment,
  onReportComment,
  onReplyAdded,
  className = '',
}) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isAnonymousReply, setIsAnonymousReply] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [showRepliesList, setShowRepliesList] = useState(true);
  const [replies, setReplies] = useState(comment.replies || []);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);

  React.useEffect(() => {
    if (comment.replies) {
      setReplies(comment.replies);
    }
  }, [comment.replies]);

  const isAdminComment = Boolean(
    comment.isAdminComment ||
    comment.user?.role === 'admin'
  );

  const currentUserId = user?._id || user?.id;
  const commentAuthorId =
    (typeof comment.user === 'object'
      ? comment.user?._id || comment.user?.id
      : comment.user) || comment.userId;

  const isOwner = Boolean(
    user && (
      user.role === 'admin' ||
      comment.isOwner === true ||
      (currentUserId && commentAuthorId && String(currentUserId) === String(commentAuthorId))
    )
  );

  const authorName = isAdminComment
    ? (comment.user?.name || 'Head of Rant Affairs 📢')
    : comment.isAnonymous
    ? comment.user?.anonymousUsername || 'Anonymous'
    : comment.user?.name || 'Student';

  const authorImage = isAdminComment
    ? (comment.user?.image || '/logo.png')
    : comment.isAnonymous
    ? ''
    : comment.user?.image;

  const authorId = !comment.isAnonymous && comment.user ? (comment.user._id || comment.user.id) : null;

  const handleAuthorClick = (e) => {
    if (authorId) {
      e.stopPropagation();
      navigate(`/profile/${authorId}`);
    }
  };

  const handleToggleReplies = async () => {
    if (!showRepliesList && replies.length === 0 && (comment.repliesCount || 0) > 0) {
      setIsLoadingReplies(true);
      try {
        const res = await commentsApi.getReplies(comment.id || comment._id);
        const fetchedReplies = res.data || res;
        if (Array.isArray(fetchedReplies)) {
          setReplies(fetchedReplies);
        }
      } catch (err) {
        showToast(err.message || 'Failed to load replies', 'error');
      } finally {
        setIsLoadingReplies(false);
      }
    }
    setShowRepliesList((prev) => !prev);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    if (!isAuthenticated) {
      showToast('Please sign in to reply', 'error');
      return;
    }

    setIsSubmittingReply(true);
    try {
      const res = await commentsApi.addReply(comment.id || comment._id, {
        text: replyText.trim(),
        isAnonymous: isAnonymousReply,
      });

      const newReply = res.data || res;
      setReplies((prev) => [...prev, newReply]);
      setReplyText('');
      setShowReplyInput(false);
      setShowRepliesList(true);
      showToast('Reply added! 💬', 'success');
      onReplyAdded?.();
    } catch (err) {
      showToast(err.message || 'Failed to post reply', 'error');
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await commentsApi.deleteReply(comment.id || comment._id, replyId);
      setReplies((prev) => prev.filter((r) => (r.id || r._id) !== replyId));
      showToast('Reply deleted', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete reply', 'error');
    }
  };

  return (
    <div className={`py-3.5 border-b border-[var(--border-color)] space-y-2.5 ${className}`}>
      {/* Top Header: Avatar, Name, Time, More */}
      <div className="flex items-start justify-between gap-3">
        <div
          onClick={authorId ? handleAuthorClick : undefined}
          className={`flex items-center gap-2.5 ${authorId ? 'cursor-pointer group' : ''}`}
          title={authorId ? `View ${authorName}'s profile` : undefined}
        >
          <Avatar
            src={authorImage}
            name={authorName}
            isAnonymous={Boolean(comment.isAnonymous)}
            size="sm"
            className={authorId ? 'group-hover:ring-2 group-hover:ring-[var(--color-primary)]/40 transition-all' : ''}
          />
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`font-bold text-xs sm:text-sm font-display ${
                  isAdminComment ? 'text-[var(--color-primary)]' : 'text-slate-900'
                } ${authorId ? 'group-hover:text-[var(--color-primary)] transition-colors' : ''}`}
              >
                {authorName}
              </span>
              {isAdminComment ? (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  <ShieldCheck className="w-2.5 h-2.5 text-[var(--color-primary)]" />
                  Admin
                </span>
              ) : comment.isAnonymous ? (
                <Badge variant="anon" size="xs">
                  Anon
                </Badge>
              ) : null}
            </div>
            <span className="text-[11px] text-slate-500">
              {timeAgo(comment.createdAt)}
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            onClick={() => setShowReplyInput((prev) => !prev)}
            className="p-1 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
            title="Reply"
          >
            <Reply className="w-3.5 h-3.5" />
          </button>

          {isOwner ? (
            <button
              type="button"
              onClick={() => onDeleteComment?.(comment)}
              className="p-1 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              title="Delete comment"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onReportComment?.(comment)}
              className="p-1 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors"
              title="Report comment"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Comment Body */}
      <p className="text-xs sm:text-sm text-slate-800 pl-10 leading-relaxed break-words whitespace-pre-line">
        {comment.text}
      </p>

      {/* Inline Reply Input */}
      {showReplyInput && (
        <form onSubmit={handleSendReply} className="pl-10 pt-2 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Replying to ${authorName}...`}
              className="flex-1 bg-white border border-[var(--border-color)] text-slate-900 placeholder-slate-400 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-[var(--color-primary)] shadow-sm"
              autoFocus
            />
            <button
              type="submit"
              disabled={isSubmittingReply || !replyText.trim()}
              className="p-2 rounded-xl bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-50 transition-colors shadow-sm"
              aria-label="Send reply"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymousReply}
                onChange={(e) => setIsAnonymousReply(e.target.checked)}
                className="rounded border-slate-700 text-sky-500 focus:ring-0"
              />
              <span>Reply anonymously</span>
            </label>
            <button
              type="button"
              onClick={() => setShowReplyInput(false)}
              className="text-slate-500 hover:text-slate-900 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Nested Replies List */}
      {(replies.length > 0 || (comment.repliesCount || 0) > 0) && (
        <div className="pl-8 pt-1">
          <button
            type="button"
            onClick={handleToggleReplies}
            className="flex items-center gap-1 text-[11px] font-semibold text-[var(--color-primary)] hover:underline mb-2"
          >
            {showRepliesList ? (
              <>
                <ChevronUp className="w-3 h-3" />
                <span>Hide {replies.length || comment.repliesCount} replies</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" />
                <span>Show {replies.length || comment.repliesCount} replies</span>
              </>
            )}
          </button>

          {isLoadingReplies ? (
            <div className="text-[11px] text-slate-500 italic pl-3 py-1">Loading replies...</div>
          ) : showRepliesList && (
            <div className="space-y-3 pl-3 border-l-2 border-[var(--border-color)]">
              {replies.map((reply) => {
                const isReplyAdmin = Boolean(
                  reply.isAdminComment ||
                  reply.user?.role === 'admin'
                );
                const replyAuthorName = isReplyAdmin
                  ? (reply.user?.name || 'Head of Rant Affairs 📢')
                  : reply.isAnonymous
                  ? reply.user?.anonymousUsername || 'Anonymous'
                  : reply.user?.name || 'Student';
                const replyAuthorImage = isReplyAdmin
                  ? (reply.user?.image || '/logo.png')
                  : reply.isAnonymous
                  ? ''
                  : reply.user?.image;
                const rawReplyAuthorId =
                  (typeof reply.user === 'object'
                    ? reply.user?._id || reply.user?.id
                    : reply.user) || reply.userId;

                const isReplyOwner = Boolean(
                  user && (
                    user.role === 'admin' ||
                    reply.isOwner === true ||
                    (currentUserId && rawReplyAuthorId && String(currentUserId) === String(rawReplyAuthorId))
                  )
                );

                const replyAuthorId = !reply.isAnonymous && reply.user ? (reply.user._id || reply.user.id) : null;

                return (
                  <div key={reply.id || reply._id} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div
                        onClick={
                          replyAuthorId
                            ? (e) => {
                                e.stopPropagation();
                                navigate(`/profile/${replyAuthorId}`);
                              }
                            : undefined
                        }
                        className={`flex items-center gap-2 ${replyAuthorId ? 'cursor-pointer group' : ''}`}
                        title={replyAuthorId ? `View ${replyAuthorName}'s profile` : undefined}
                      >
                        <Avatar
                          src={replyAuthorImage}
                          name={replyAuthorName}
                          isAnonymous={Boolean(reply.isAnonymous && !isReplyAdmin)}
                          size="xs"
                          className={replyAuthorId ? 'group-hover:ring-1 group-hover:ring-[var(--color-primary)]/40 transition-all' : ''}
                        />
                        <span
                          className={`font-bold font-display ${
                            isReplyAdmin ? 'text-[var(--color-primary)]' : 'text-slate-900'
                          } ${replyAuthorId ? 'group-hover:text-[var(--color-primary)] transition-colors' : ''}`}
                        >
                          {replyAuthorName}
                        </span>
                        {isReplyAdmin ? (
                          <span className="inline-flex items-center gap-0.5 text-[8px] font-bold px-1 py-0.2 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                            Admin
                          </span>
                        ) : reply.isAnonymous ? (
                          <span className="text-[10px] text-slate-500 font-medium">Anon</span>
                        ) : null}
                        <span className="text-[10px] text-slate-500">
                          {timeAgo(reply.createdAt)}
                        </span>
                      </div>

                      {isReplyOwner && (
                        <button
                          type="button"
                          onClick={() => handleDeleteReply(reply.id || reply._id)}
                          className="text-slate-400 hover:text-rose-600 p-0.5"
                          title="Delete reply"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <p className="text-slate-700 pl-6 leading-relaxed break-words">
                      {reply.text}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
