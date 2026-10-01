import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import MobileHeader from '../components/navigation/MobileHeader';
import SearchBar from '../components/rants/SearchBar';
import FilterBar from '../components/rants/FilterBar';
import RantCard from '../components/rants/RantCard';
import { RantCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import Button from '../components/common/Button';
import MobileAdminBroadcast from '../components/rants/MobileAdminBroadcast';

// Lazy-loaded on-demand modal components
const ConfirmationModal = React.lazy(() => import('../components/common/ConfirmationModal'));
const ReportSheet = React.lazy(() => import('../components/reports/ReportSheet'));
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as postsApi from '../api/posts';
import { Sparkles, RefreshCw, MessageSquareDashed, Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';

const HomePage = ({ onOpenCreate, onOpenEdit, unreadCount }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const observerTarget = useRef(null);

  // Modals state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  // TanStack Query: Infinite feed query with automatic caching and pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error: queryError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['posts', selectedDepartment, debouncedSearchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await postsApi.getPosts({
        page: pageParam,
        limit: 10,
        department: selectedDepartment,
        q: debouncedSearchQuery.trim(),
        skipCache: true,
      });
      return res;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage?.pagination?.hasMore) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 3, // 3 minutes fresh cache: navigating away & back uses cached posts with 0 network calls
    gcTime: 1000 * 60 * 15,   // Keep cache in memory for 15 minutes
  });

  // Cached feed: Instant synchronous read from TanStack Query cache on mount & return
  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page?.data || []) || [];
  }, [data]);

  // Helper to keep TanStack Query cache updated on local mutations
  const updateQueryCachePost = useCallback(
    (postId, updater) => {
      queryClient.setQueryData(
        ['posts', selectedDepartment, debouncedSearchQuery],
        (oldData) => {
          if (!oldData || !oldData.pages) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: Array.isArray(page.data)
                ? page.data.map((p) =>
                    (p.id || p._id) === postId ? updater(p) : p
                  )
                : page.data,
            })),
          };
        }
      );
    },
    [queryClient, selectedDepartment, debouncedSearchQuery]
  );

  const error = queryError?.message || null;
  const hasMore = Boolean(hasNextPage);
  const isLoadingMore = Boolean(isFetchingNextPage);

  // Listen for logo or home click to refresh recent rants
  useEffect(() => {
    const handleHomeRefresh = () => {
      setSelectedDepartment('All');
      setSearchQuery('');
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    };

    window.addEventListener('rantea:refresh-home-feed', handleHomeRefresh);
    return () => {
      window.removeEventListener('rantea:refresh-home-feed', handleHomeRefresh);
    };
  }, [queryClient]);

  // Infinite scroll: auto-fetch next page as user scrolls near bottom
  useEffect(() => {
    if (!hasNextPage || isLoading || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
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
  }, [hasNextPage, isLoading, isFetchingNextPage, fetchNextPage]);

  const handleReact = useCallback(
    async (targetPost, emoji) => {
      if (!isAuthenticated) {
        showToast('Please sign in to react to rants', 'warning');
        return;
      }

      const postId = targetPost.id || targetPost._id;

      // Optimistic reaction calculations
      const applyReactionUpdate = (p) => {
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

        return {
          ...p,
          reactions: {
            ...p.reactions,
            counts,
            userReaction: newUserReaction,
          },
        };
      };

      // Optimistic reaction update directly in TanStack Query cache
      updateQueryCachePost(postId, applyReactionUpdate);

      try {
        const res = await postsApi.reactToPost(postId, emoji);
        // Sync fresh server response to query cache
        if (res.data) {
          updateQueryCachePost(postId, () => res.data);
        }
      } catch (err) {
        showToast(err.message || 'Failed to save reaction', 'error');
      }
    },
    [isAuthenticated, showToast, updateQueryCachePost]
  );

  const handleEdit = useCallback((r) => onOpenEdit?.(r), [onOpenEdit]);
  const handleDelete = useCallback((r) => setDeleteTarget(r), []);
  const handleReport = useCallback((r) => setReportTarget(r), []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const postId = deleteTarget.id || deleteTarget._id;

    try {
      await postsApi.deletePost(postId);
      queryClient.setQueryData(
        ['posts', selectedDepartment, debouncedSearchQuery],
        (oldData) => {
          if (!oldData || !oldData.pages) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              data: Array.isArray(page.data)
                ? page.data.filter((p) => (p.id || p._id) !== postId)
                : page.data,
            })),
          };
        }
      );
      queryClient.invalidateQueries({ queryKey: ['posts'] });
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
          onSubmit={() => refetch()}
          placeholder="Search rants or keywords..."
        />

        {/* Department Filter Chips */}
        <FilterBar
          selectedDepartment={selectedDepartment}
          onSelectDepartment={(dept) => {
            setSelectedDepartment(dept);
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
            title="Something went wrong"
            message={error || "Could not load the rants feed. Check your internet connection and try again."}
            onRetry={() => refetch()}
            actionText="Try Again"
          />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={searchQuery ? Search : MessageSquareDashed}
            title={
              searchQuery
                ? `No rants found for "${searchQuery}"`
                : selectedDepartment !== 'All'
                ? `No rants in ${selectedDepartment} yet`
                : 'No rants yet'
            }
            message={
              searchQuery
                ? 'Try searching with different keywords or clear the search to see all posts.'
                : selectedDepartment !== 'All'
                ? `Be the first one to spill the tea in ${selectedDepartment}.`
                : 'Be the first one to spill the tea.'
            }
            actionText={searchQuery ? 'Clear Search' : 'Spill The Tea'}
            onAction={searchQuery ? () => setSearchQuery('') : onOpenCreate}
            className="mt-6"
          />
        ) : (
          <div className="space-y-4 pt-1">
            {posts.map((rant) => (
              <RantCard
                key={rant.id || rant._id}
                rant={rant}
                onReact={handleReact}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onReport={handleReport}
              />
            ))}

            {/* Infinite Scroll Sentinel */}
            {hasMore && (
              <div ref={observerTarget} className="py-2">
                {isLoadingMore ? (
                  <div className="space-y-4 pt-2">
                    <RantCardSkeleton />
                  </div>
                ) : (
                  <div className="h-8" />
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
      {deleteTarget && (
        <React.Suspense fallback={null}>
          <ConfirmationModal
            isOpen={Boolean(deleteTarget)}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDeleteConfirm}
            title="Delete this rant?"
            message="This action cannot be undone. All reactions and comments on this rant will also be removed."
            confirmText="Delete Rant"
            isLoading={isDeleting}
          />
        </React.Suspense>
      )}

      {/* Report Bottom Sheet */}
      {reportTarget && (
        <React.Suspense fallback={null}>
          <ReportSheet
            isOpen={Boolean(reportTarget)}
            onClose={() => setReportTarget(null)}
            targetType="post"
            targetId={reportTarget?.id || reportTarget?._id}
          />
        </React.Suspense>
      )}
    </div>
  );
};

export default HomePage;
