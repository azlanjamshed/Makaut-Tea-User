import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '../components/navigation/MobileHeader';
import RantCard from '../components/rants/RantCard';
import { RantCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ReportSheet from '../components/reports/ReportSheet';
import MobileAdminBroadcast from '../components/rants/MobileAdminBroadcast';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as postsApi from '../api/posts';
import { Flame, Trophy, RefreshCw, Clock, Sparkles } from 'lucide-react';

const TrendingPage = ({ onOpenEdit }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [timeframe, setTimeframe] = useState('today');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Modals
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  // Only Today (24h) and All-Time Popular
  const tabs = [
    { id: 'today', label: 'Today (24h)', icon: Flame },
    { id: 'popular', label: 'All-Time Popular', icon: Trophy },
  ];

  const fetchTrending = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);
    try {
      // Strictly 10 posts for Today, 20 for Popular
      const limit = timeframe === 'today' ? 10 : 20;
      const res = await postsApi.getTrendingPosts({ timeframe, limit });
      if (res?.success) {
        setPosts(res.data || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to load trending rants');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [timeframe]);

  useEffect(() => {
    fetchTrending(false);
  }, [fetchTrending]);

  const handleReact = async (targetPost, emoji) => {
    if (!isAuthenticated) {
      showToast('Please sign in to react to rants', 'warning');
      return;
    }
    const postId = targetPost.id || targetPost._id;

    // Optimistic UI updates
    setPosts((prev) =>
      prev.map((p) => {
        if ((p.id || p._id) === postId) {
          const counts = { ...(p.reactions?.counts || {}) };
          const prevUserReaction = p.reactions?.userReaction;
          let newUserReaction = emoji;

          if (prevUserReaction === emoji) {
            counts[emoji] = Math.max((counts[emoji] || 1) - 1, 0);
            newUserReaction = null;
          } else {
            if (prevUserReaction && counts[prevUserReaction]) {
              counts[prevUserReaction] = Math.max(counts[prevUserReaction] - 1, 0);
            }
            counts[emoji] = (counts[emoji] || 0) + 1;
          }

          const total = Object.values(counts).reduce((a, b) => a + b, 0);

          return {
            ...p,
            reactions: {
              ...p.reactions,
              counts,
              total,
              userReaction: newUserReaction,
            },
          };
        }
        return p;
      })
    );

    try {
      const res = await postsApi.reactToPost(postId, emoji);
      if (res?.data) {
        setPosts((prev) =>
          prev.map((p) => ((p.id || p._id) === postId ? res.data : p))
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to save reaction', 'error');
      fetchTrending(false);
    }
  };

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
      <MobileHeader title="🔥 Trending Rants" />

      <main className="px-4 py-4 space-y-4">
        {/* Timeframe Tabs & Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center p-1 rounded-2xl bg-white border border-[var(--border-color)] shadow-xs">
            {tabs.map((tab) => {
              const isSelected = timeframe === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTimeframe(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all select-none font-display ${
                    isSelected
                      ? 'bg-[var(--color-primary)] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => fetchTrending(true)}
            disabled={isLoading || isRefreshing}
            className="p-3 rounded-2xl bg-white border border-[var(--border-color)] text-slate-600 hover:text-slate-900 transition-colors shrink-0 disabled:opacity-50 cursor-pointer shadow-sm"
            title="Refresh rankings"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[var(--color-primary)]' : ''}`} />
          </button>
        </div>

        {/* Section Context Info Banner */}
        <div className="flex items-center justify-between px-2 py-1 text-[11px] font-mono text-slate-500">
          <span className="flex items-center gap-1.5 font-semibold text-slate-700">
            {timeframe === 'today' ? (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-amber-800">Top 10 Most Liked & Commented</span>
                <span className="text-slate-400 font-normal">· Last 24 Hours</span>
              </>
            ) : (
              <>
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-amber-800">All-Time Hall of Fame</span>
                <span className="text-slate-400 font-normal">· Most Liked & Commented</span>
              </>
            )}
          </span>
          <span className="text-slate-400 text-[10px]">
            {posts.length > 0 ? `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}` : ''}
          </span>
        </div>

        {/* Mobile Head of Rant Affairs - 24h Announcements (xl:hidden) */}
        <MobileAdminBroadcast />

        {/* Feed List */}
        {isLoading ? (
          <div className="space-y-4 pt-2">
            <RantCardSkeleton />
            <RantCardSkeleton />
          </div>
        ) : error ? (
          <ErrorState
            title="Could not load trending"
            message={error}
            onRetry={() => fetchTrending(false)}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            emoji="🔥"
            title="No trending rants yet"
            message={
              timeframe === 'today'
                ? 'No rants have gained reactions or comments in the past 24 hours. React to a rant or spill the tea to kickstart the buzz!'
                : 'No popular rants recorded yet. Be the first to share something memorable!'
            }
            actionText="Explore Home Feed 🏠"
            onAction={() => navigate('/')}
            className="mt-6"
          />
        ) : (
          <div className="space-y-4 pt-1">
            {posts.map((rant, idx) => {
              const rank = idx + 1;
              return (
                <div key={rant.id || rant._id} className="space-y-1.5">
                  {/* Rank Header Pill */}
                  <div className="flex items-center justify-between px-2 text-xs font-mono">
                    <div className="flex items-center gap-2">
                      {rank === 1 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-900 shadow-xs">
                          <span>👑</span>
                          <span>#1 Campus Buzz</span>
                          <span className="text-[10px] text-amber-700 font-normal hidden sm:inline">
                            · Leader
                          </span>
                        </span>
                      ) : rank === 2 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 border border-slate-200 text-slate-800">
                          <span>🥈</span>
                          <span>#2 Trending</span>
                        </span>
                      ) : rank === 3 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-800">
                          <span>🥉</span>
                          <span>#3 Trending</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white border border-[var(--border-color)] text-slate-600 shadow-xs">
                          <span>#{rank} Trending</span>
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                      <span className="text-orange-400 font-bold">
                        🔥 {rant.reactions?.total || 0} reactions
                      </span>
                    </div>
                  </div>

                  <RantCard
                    rant={rant}
                    onReact={handleReact}
                    onEdit={(r) => onOpenEdit?.(r)}
                    onDelete={(r) => setDeleteTarget(r)}
                    onReport={(r) => setReportTarget(r)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </main>

      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete this rant?"
        message="This action cannot be undone."
        confirmText="Delete Rant"
        isLoading={isDeleting}
      />

      <ReportSheet
        isOpen={Boolean(reportTarget)}
        onClose={() => setReportTarget(null)}
        targetType="post"
        targetId={reportTarget?.id || reportTarget?._id}
      />
    </div>
  );
};

export default TrendingPage;
