import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '../components/navigation/MobileHeader';
import RantCard from '../components/rants/RantCard';
import { RantCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import ReportSheet from '../components/reports/ReportSheet';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as postsApi from '../api/posts';

const MyReactionsPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);

  const fetchReactedPosts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await postsApi.getMyReactedPosts({ limit: 30 });
      if (res.success) {
        setPosts(res.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load your reacted posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchReactedPosts();
  }, [isAuthenticated, fetchReactedPosts, navigate]);

  const handleReact = async (targetPost, emoji) => {
    const postId = targetPost.id || targetPost._id;
    try {
      const res = await postsApi.reactToPost(postId, emoji);
      if (res.data) {
        // If user removed their reaction, remove it from the list
        if (!res.data.reactions?.userReaction) {
          setPosts((prev) => prev.filter((p) => (p.id || p._id) !== postId));
          showToast('Reaction removed', 'info');
        } else {
          setPosts((prev) =>
            prev.map((p) => ((p.id || p._id) === postId ? res.data : p))
          );
        }
      }
    } catch (err) {
      showToast(err.message || 'Failed to update reaction', 'error');
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 max-w-2xl mx-auto w-full">
      <MobileHeader title="My Reactions" showBack backUrl="/profile" />

      <main className="px-4 py-4 space-y-4">
        {isLoading ? (
          <div className="space-y-4 pt-2">
            <RantCardSkeleton />
            <RantCardSkeleton />
          </div>
        ) : error ? (
          <ErrorState
            title="Could not load reacted rants"
            message={error}
            onRetry={fetchReactedPosts}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            emoji="❤️"
            title="You haven't reacted to any rants yet"
            message="Browse the home feed or trending rants and tap ❤️ 👎 💀 to save your reactions."
            actionText="Explore Feed"
            onAction={() => navigate('/')}
            className="mt-8"
          />
        ) : (
          <div className="space-y-4 pt-1">
            <div className="text-xs text-slate-400 px-1">
              You reacted to {posts.length} {posts.length === 1 ? 'rant' : 'rants'}
            </div>
            {posts.map((rant) => (
              <RantCard
                key={rant.id || rant._id}
                rant={rant}
                onReact={handleReact}
                onReport={(r) => setReportTarget(r)}
              />
            ))}
          </div>
        )}
      </main>

      <ReportSheet
        isOpen={Boolean(reportTarget)}
        onClose={() => setReportTarget(null)}
        targetType="post"
        targetId={reportTarget?.id || reportTarget?._id}
      />
    </div>
  );
};

export default MyReactionsPage;
