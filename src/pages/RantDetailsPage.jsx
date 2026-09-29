import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MobileHeader from '../components/navigation/MobileHeader';
import RantCard from '../components/rants/RantCard';
import CommentCard from '../components/comments/CommentCard';
import CommentInput from '../components/comments/CommentInput';
import { RantCardSkeleton, CommentSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ReportSheet from '../components/reports/ReportSheet';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as postsApi from '../api/posts';
import * as commentsApi from '../api/comments';
import { MessageSquare } from 'lucide-react';

const RantDetailsPage = ({ onOpenEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState(null);

  // Modals
  const [deleteRantTarget, setDeleteRantTarget] = useState(null);
  const [deleteCommentTarget, setDeleteCommentTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  const fetchPostDetails = useCallback(async () => {
    setIsLoadingPost(true);
    setError(null);
    try {
      const res = await postsApi.getPostById(id);
      if (res.success && res.data) {
        setPost(res.data);
      }
    } catch (err) {
      setError(err.message || 'Post not found');
    } finally {
      setIsLoadingPost(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    setIsLoadingComments(true);
    try {
      const res = await commentsApi.getComments(id);
      if (res.success) {
        setComments(res.data || []);
      }
    } catch (err) {
      // silently handle comment fetch fail
    } finally {
      setIsLoadingComments(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPostDetails();
    fetchComments();
  }, [fetchPostDetails, fetchComments]);

  const handleReact = async (targetPost, emoji) => {
    if (!isAuthenticated) {
      showToast('Please sign in to react', 'warning');
      return;
    }

    try {
      const res = await postsApi.reactToPost(id, emoji);
      if (res.data) {
        setPost(res.data);
      }
    } catch (err) {
      showToast(err.message || 'Failed to react', 'error');
    }
  };

  const handleAddComment = async ({ text, isAnonymous }) => {
    setIsSubmittingComment(true);
    try {
      const res = await commentsApi.addComment(id, { text, isAnonymous });
      if (res.data) {
        setComments((prev) => [res.data, ...prev]);
        setPost((prev) =>
          prev ? { ...prev, commentsCount: (prev.commentsCount || 0) + 1 } : prev
        );
        showToast('Comment added! 💬', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to add comment', 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteRantConfirm = async () => {
    if (!deleteRantTarget) return;
    setIsDeleting(true);
    try {
      await postsApi.deletePost(deleteRantTarget.id || deleteRantTarget._id);
      showToast('Rant deleted successfully', 'success');
      navigate('/', { replace: true });
    } catch (err) {
      showToast(err.message || 'Failed to delete rant', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteRantTarget(null);
    }
  };

  const handleDeleteCommentConfirm = async () => {
    if (!deleteCommentTarget) return;
    setIsDeleting(true);
    const commentId = deleteCommentTarget.id || deleteCommentTarget._id;
    try {
      await commentsApi.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => (c.id || c._id) !== commentId));
      setPost((prev) =>
        prev ? { ...prev, commentsCount: Math.max((prev.commentsCount || 1) - 1, 0) } : prev
      );
      showToast('Comment deleted', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete comment', 'error');
    } finally {
      setIsDeleting(false);
      setDeleteCommentTarget(null);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 max-w-2xl mx-auto w-full flex flex-col justify-between">
      <div>
        <MobileHeader title="Rant Details" showBack />

        <main className="px-4 py-4 space-y-5">
          {isLoadingPost ? (
            <RantCardSkeleton />
          ) : error ? (
            <ErrorState
              title="Post unavailable"
              message={error}
              onRetry={fetchPostDetails}
            />
          ) : post ? (
            <>
              {/* Detailed Rant Card */}
              <RantCard
                rant={post}
                isDetail
                onReact={handleReact}
                onEdit={(r) => onOpenEdit?.(r)}
                onDelete={(r) => setDeleteRantTarget(r)}
                onReport={(r) =>
                  setReportTarget({ type: 'post', id: r.id || r._id })
                }
              />

              {/* Comments Section */}
              <section className="pt-2">
                <div className="flex items-center gap-2 pb-3 mb-2 border-b border-dark-border">
                  <MessageSquare className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-slate-100 font-display">
                    Comments ({post.commentsCount || comments.length})
                  </h3>
                </div>

                {isLoadingComments ? (
                  <div className="space-y-2">
                    <CommentSkeleton />
                    <CommentSkeleton />
                  </div>
                ) : comments.length === 0 ? (
                  <EmptyState
                    emoji="💬"
                    title="No comments yet"
                    message="Be the first one to share what you think."
                    className="my-3 py-6"
                  />
                ) : (
                  <div className="divide-y divide-dark-border/40">
                    {comments.map((comment) => (
                      <CommentCard
                        key={comment.id || comment._id}
                        comment={comment}
                        onDeleteComment={(c) => setDeleteCommentTarget(c)}
                        onReportComment={(c) =>
                          setReportTarget({ type: 'comment', id: c.id || c._id })
                        }
                        onReplyAdded={() => {
                          setPost((prev) =>
                            prev
                              ? { ...prev, commentsCount: (prev.commentsCount || 0) + 1 }
                              : prev
                          );
                        }}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          ) : null}
        </main>
      </div>

      {/* Sticky Bottom Comment Input Bar */}
      {post && (
        <CommentInput
          onSendComment={handleAddComment}
          isSubmitting={isSubmittingComment}
        />
      )}

      {/* Delete Rant Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteRantTarget)}
        onClose={() => setDeleteRantTarget(null)}
        onConfirm={handleDeleteRantConfirm}
        title="Delete this rant?"
        message="This action cannot be undone. All comments will be permanently erased."
        confirmText="Delete Rant"
        isLoading={isDeleting}
      />

      {/* Delete Comment Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deleteCommentTarget)}
        onClose={() => setDeleteCommentTarget(null)}
        onConfirm={handleDeleteCommentConfirm}
        title="Delete comment?"
        message="Are you sure you want to remove your comment?"
        confirmText="Delete Comment"
        isLoading={isDeleting}
      />

      {/* Report Sheet */}
      <ReportSheet
        isOpen={Boolean(reportTarget)}
        onClose={() => setReportTarget(null)}
        targetType={reportTarget?.type || 'post'}
        targetId={reportTarget?.id}
      />
    </div>
  );
};

export default RantDetailsPage;
