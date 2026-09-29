import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '../components/navigation/MobileHeader';
import RantCard from '../components/rants/RantCard';
import { RantCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as postsApi from '../api/posts';

const MyRantsPage = ({ onOpenCreate, onOpenEdit }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyRants = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await postsApi.getPostsByUser(user.id || user._id);
      if (res.success) {
        setPosts(res.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your rants');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchMyRants();
  }, [isAuthenticated, fetchMyRants, navigate]);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const postId = deleteTarget.id || deleteTarget._id;
    try {
      await postsApi.deletePost(postId);
      setPosts((prev) => prev.filter((p) => (p.id || p._id) !== postId));
      showToast('Rant deleted successfully', 'success');
      setDeleteTarget(null);
    } catch (err) {
      showToast(err.message || 'Failed to delete rant', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 max-w-2xl mx-auto w-full">
      <MobileHeader title="My Rants" showBack backUrl="/profile" />

      <main className="px-4 py-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4 pt-2">
            <RantCardSkeleton />
            <RantCardSkeleton />
          </div>
        ) : error ? (
          <ErrorState
            title="Could not load your rants"
            message={error}
            onRetry={fetchMyRants}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            emoji="✍️"
            title="You haven't posted any rants yet"
            message="Got a campus grievance or confession? Spill the tea anonymously or with your profile."
            actionText="Create Your First Rant 🔥"
            onAction={onOpenCreate}
            className="mt-8"
          />
        ) : (
          <div className="space-y-4 pt-1">
            <div className="text-xs text-slate-400 px-1">
              You have posted {posts.length} {posts.length === 1 ? 'rant' : 'rants'}
            </div>
            {posts.map((rant) => (
              <RantCard
                key={rant.id || rant._id}
                rant={rant}
                onEdit={(r) => onOpenEdit?.(r)}
                onDelete={(r) => setDeleteTarget(r)}
              />
            ))}
          </div>
        )}
      </main>

      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete this rant?"
        message="This action cannot be undone. All reactions and comments on this rant will also be removed."
        confirmText="Delete Rant"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default MyRantsPage;
