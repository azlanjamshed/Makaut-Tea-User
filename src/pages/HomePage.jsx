import React, { useState, useEffect, useCallback, useRef } from 'react';
import MobileHeader from '../components/navigation/MobileHeader';
import SearchBar from '../components/rants/SearchBar';
import FilterBar from '../components/rants/FilterBar';
import RantCard from '../components/rants/RantCard';
import { RantCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import Button from '../components/common/Button';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ReportSheet from '../components/reports/ReportSheet';
import MobileAdminBroadcast from '../components/rants/MobileAdminBroadcast';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as postsApi from '../api/posts';
import { Sparkles, RefreshCw } from 'lucide-react';

const HomePage = ({ onOpenCreate, onOpenEdit, unreadCount }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [posts, setPosts] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const observerTarget = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Modals state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  const fetchPosts = useCallback(
    async (pageNum = 1, append = false) => {
      if (pageNum === 1) setIsLoading(true);
      else setIsLoadingMore(true);
      setError(null);

      try {
        const res = await postsApi.getPosts({
          page: pageNum,
          limit: 15,
          department: selectedDepartment,
          q: searchQuery.trim(),
        });

        if (res.success) {
          const fetchedPosts = res.data || [];
          if (append) {
            setPosts((prev) => [...prev, ...fetchedPosts]);
          } else {
            setPosts(fetchedPosts);
          }
          setHasMore(pageNum < (res.pagination?.pages || 1));
          setPage(pageNum);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch rants');
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [selectedDepartment, searchQuery]
  );

  useEffect(() => {
    fetchPosts(1, false);
  }, [fetchPosts]);

  // Listen for logo or home click to refresh recent rants
  useEffect(() => {
    const handleHomeRefresh = () => {
      setSelectedDepartment('All');
      setSearchQuery('');
      fetchPosts(1, false);
    };

    window.addEventListener('rantea:refresh-home-feed', handleHomeRefresh);
    return () => {
      window.removeEventListener('rantea:refresh-home-feed', handleHomeRefresh);
    };
  }, [fetchPosts]);

  // Infinite scroll: auto-fetch next page as user scrolls near bottom
  useEffect(() => {
    if (!hasMore || isLoading || isLoadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchPosts(page + 1, true);
        }
      },
      { threshold: 0.1, rootMargin: '250px' }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, isLoadingMore, page, fetchPosts]);

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
            // Toggle off
            counts[emoji] = Math.max((counts[emoji] || 1) - 1, 0);
            newUserReaction = null;
          } else {
            // Toggle on / change
            if (prevUserReaction && counts[prevUserReaction]) {
              counts[prevUserReaction] = Math.max(counts[prevUserReaction] - 1, 0);
            }
            counts[emoji] = (counts[emoji] || 0) + 1;
          }

          return {
            ...p,
            reactions: {
              ...p.reactions,
              counts,
              userReaction: newUserReaction,
            },
          };
        }
        return p;
      })
    );

    try {
      const res = await postsApi.reactToPost(postId, emoji);
      // Sync fresh server response
      if (res.data) {
        setPosts((prev) =>
          prev.map((p) => ((p.id || p._id) === postId ? res.data : p))
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to save reaction', 'error');
      fetchPosts(page, false);
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
      {/* Mobile Top Header */}
      <MobileHeader unreadCount={unreadCount} />

      <main className="px-4 py-4 space-y-4">
        {/* Search bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onClear={() => setSearchQuery('')}
          onSubmit={() => fetchPosts(1, false)}
          placeholder="Search rants or keywords..."
        />

        {/* Department Filter Chips */}
        <FilterBar
          selectedDepartment={selectedDepartment}
          onSelectDepartment={(dept) => {
            setSelectedDepartment(dept);
            setPage(1);
          }}
        />

        {/* Mobile Head of Rant Affairs - 24h Announcements (xl:hidden) */}
        <MobileAdminBroadcast />

        {/* Content Feeds */}
        {isLoading ? (
          <div className="space-y-4 pt-2">
            <RantCardSkeleton />
            <RantCardSkeleton />
            <RantCardSkeleton />
          </div>
        ) : error ? (
          <ErrorState
            title="Could not load rants"
            message={error}
            onRetry={() => fetchPosts(1, false)}
          />
        ) : posts.length === 0 ? (
          <EmptyState
            emoji="💤"
            title="No rants yet"
            message="Be the first one to say something or spill the campus tea."
            actionText="Create Rant"
            onAction={onOpenCreate}
            className="mt-6"
          />
        ) : (
          <div className="space-y-4 pt-1">
            {posts.map((rant) => (
              <RantCard
                key={rant.id || rant._id}
                rant={rant}
                onReact={handleReact}
                onEdit={(r) => onOpenEdit?.(r)}
                onDelete={(r) => setDeleteTarget(r)}
                onReport={(r) => setReportTarget(r)}
              />
            ))}

            {/* Infinite Scroll Sentinel */}
            {hasMore && (
              <div ref={observerTarget} className="py-6 flex flex-col items-center justify-center gap-2">
                {isLoadingMore ? (
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                    <RefreshCw className="w-4 h-4 animate-spin text-[var(--color-primary)]" />
                    <span>Pouring more tea...</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400">Scroll for more rants</span>
                )}
              </div>
            )}

            {!hasMore && posts.length > 0 && (
              <div className="py-8 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
                <span className="h-px w-12 bg-slate-200" />
                <span>You're all caught up on the campus tea</span>
                <span className="h-px w-12 bg-slate-200" />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete this rant?"
        message="This action cannot be undone. All reactions and comments on this rant will also be removed."
        confirmText="Delete Rant"
        isLoading={isDeleting}
      />

      {/* Report Bottom Sheet */}
      <ReportSheet
        isOpen={Boolean(reportTarget)}
        onClose={() => setReportTarget(null)}
        targetType="post"
        targetId={reportTarget?.id || reportTarget?._id}
      />
    </div>
  );
};

export default HomePage;
