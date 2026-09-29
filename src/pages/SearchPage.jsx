import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '../components/navigation/MobileHeader';
import SearchBar from '../components/rants/SearchBar';
import FilterBar from '../components/rants/FilterBar';
import RantCard from '../components/rants/RantCard';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import { RantCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ReportSheet from '../components/reports/ReportSheet';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as postsApi from '../api/posts';
import * as usersApi from '../api/users';
import {
  SlidersHorizontal,
  User,
  Users,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Building2,
  GraduationCap,
} from 'lucide-react';

const SearchPage = ({ onOpenEdit }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [query, setQuery] = useState('');
  const [username, setUsername] = useState('');
  const [department, setDepartment] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchTab, setSearchTab] = useState('rants'); // 'rants' | 'accounts'

  // Results
  const [posts, setPosts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  // Modals
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const qTrimmed = query.trim();
      const [postsRes, usersRes] = await Promise.all([
        postsApi.searchPosts({
          q: qTrimmed,
          username: username.trim(),
          department: department !== 'All' ? department : '',
          limit: 30,
        }),
        qTrimmed
          ? usersApi.searchUsers({ q: qTrimmed, limit: 20 })
          : Promise.resolve({ success: true, data: [] }),
      ]);

      if (postsRes.success) {
        let results = postsRes.data || [];
        if (sortBy === 'popular') {
          results = [...results].sort((a, b) => {
            const countA = (a.reactions?.total || 0) + (a.commentsCount || 0);
            const countB = (b.reactions?.total || 0) + (b.commentsCount || 0);
            return countB - countA;
          });
        }
        setPosts(results);
      }

      if (usersRes.success) {
        setAccounts(usersRes.data || []);
      }
    } catch (err) {
      setError(err.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, [query, username, department, sortBy]);

  // Initial search on mount
  useEffect(() => {
    handleSearch();
  }, []);

  const handleReact = async (targetPost, emoji) => {
    if (!isAuthenticated) {
      showToast('Please sign in to react', 'warning');
      return;
    }
    const postId = targetPost.id || targetPost._id;
    try {
      const res = await postsApi.reactToPost(postId, emoji);
      if (res.data) {
        setPosts((prev) =>
          prev.map((p) => ((p.id || p._id) === postId ? res.data : p))
        );
      }
    } catch (err) {
      showToast(err.message || 'Failed to save reaction', 'error');
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
      <MobileHeader title="Explore & Search" />

      <main className="px-4 py-4 space-y-4">
        {/* Main Search Bar */}
        <div className="flex items-center gap-2">
          <SearchBar
            value={query}
            onChange={setQuery}
            onClear={() => {
              setQuery('');
              handleSearch();
            }}
            onSubmit={handleSearch}
            placeholder={
              searchTab === 'accounts'
                ? 'Search students or faculty by name...'
                : 'Search keywords, professors, canteen...'
            }
            className="flex-1"
          />
          {searchTab === 'rants' && (
            <button
              type="button"
              onClick={() => setShowAdvanced((prev) => !prev)}
              className={`p-3 rounded-2xl border transition-colors ${
                showAdvanced || username
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                  : 'bg-white border-[var(--border-color)] text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
              title="Filter options"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Tab Switcher: Rants vs Accounts */}
        <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-1">
          <button
            type="button"
            onClick={() => setSearchTab('rants')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              searchTab === 'rants'
                ? 'bg-purple-100 text-[var(--color-primary)] border border-purple-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Rants ({posts.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSearchTab('accounts')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              searchTab === 'accounts'
                ? 'bg-purple-100 text-[var(--color-primary)] border border-purple-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>People ({accounts.length})</span>
          </button>
        </div>

        {/* RANTS VIEW */}
        {searchTab === 'rants' && (
          <div className="space-y-4">
            {/* Quick Found People Preview Banner */}
            {query.trim() && accounts.length > 0 && (
              <div
                onClick={() => setSearchTab('accounts')}
                className="p-3 rounded-2xl bg-white border border-purple-200 flex items-center justify-between gap-3 cursor-pointer hover:border-purple-300 shadow-sm transition-all group"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="flex -space-x-2 shrink-0">
                    {accounts.slice(0, 3).map((acc) => (
                      <Avatar
                        key={acc.id || acc._id}
                        src={acc.image}
                        name={acc.name}
                        size="xs"
                        className="ring-2 ring-white"
                      />
                    ))}
                  </div>
                  <span className="text-xs text-slate-900 font-semibold truncate">
                    Found {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'} matching "{query.trim()}"
                  </span>
                </div>
                <span className="text-xs font-bold text-[var(--color-primary)] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0">
                  <span>View People</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            )}

            {/* Advanced Filters Drawer */}
            {showAdvanced && (
              <div className="p-4 rounded-3xl bg-white border border-[var(--border-color)] shadow-sm space-y-3 animate-in fade-in zoom-in-95">
                <Input
                  label="Search by Username / Handle"
                  placeholder="e.g. Alex or anon_123"
                  icon={User}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-semibold text-slate-700 uppercase">
                    Sort Results
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSortBy('latest')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                        sortBy === 'latest'
                          ? 'bg-[var(--color-primary)] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Latest
                    </button>
                    <button
                      type="button"
                      onClick={() => setSortBy('popular')}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                        sortBy === 'popular'
                          ? 'bg-[var(--color-primary)] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Most Reacted
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Department Chips */}
            <FilterBar
              selectedDepartment={department}
              onSelectDepartment={(dept) => {
                setDepartment(dept);
                setTimeout(handleSearch, 50);
              }}
            />

            {/* Search Results */}
            {isLoading ? (
              <div className="space-y-4 pt-2">
                <RantCardSkeleton />
                <RantCardSkeleton />
              </div>
            ) : error ? (
              <ErrorState
                title="Search error"
                message={error}
                onRetry={handleSearch}
              />
            ) : posts.length === 0 && hasSearched ? (
              <EmptyState
                emoji="🔍"
                title="No rants found"
                message="Try searching for a different keyword, professor name, or department."
                actionText="Clear All Filters"
                onAction={() => {
                  setQuery('');
                  setUsername('');
                  setDepartment('All');
                  setTimeout(handleSearch, 50);
                }}
                className="mt-6"
              />
            ) : (
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span>{posts.length} {posts.length === 1 ? 'rant' : 'rants'} found</span>
                </div>
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
              </div>
            )}
          </div>
        )}

        {/* ACCOUNTS VIEW */}
        {searchTab === 'accounts' && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-3 pt-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-3xl bg-white border border-[var(--border-color)] animate-pulse flex items-center gap-3.5 shadow-sm"
                  >
                    <div className="w-12 h-12 rounded-full bg-slate-200 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : accounts.length === 0 ? (
              <EmptyState
                emoji="👤"
                title="No accounts found"
                message={
                  query.trim()
                    ? `No students or faculty accounts found matching "${query.trim()}".`
                    : 'Search for classmates, friends, or faculty members by name.'
                }
                className="mt-6"
              />
            ) : (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>{accounts.length} {accounts.length === 1 ? 'account' : 'accounts'} found</span>
                </div>

                {accounts.map((account) => (
                  <div
                    key={account.id || account._id}
                    onClick={() => navigate(`/profile/${account.id || account._id}`)}
                    className="p-4 rounded-3xl bg-white border border-[var(--border-color)] hover:border-purple-300 shadow-sm transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <Avatar
                        src={account.image}
                        name={account.name}
                        size="md"
                        className="group-hover:ring-2 group-hover:ring-purple-300 transition-all shrink-0"
                      />
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-[var(--color-primary)] transition-colors truncate">
                            {account.name}
                          </h4>
                          {account.role === 'admin' ? (
                            <Badge variant="primary" size="xs" icon={ShieldCheck}>
                              Admin
                            </Badge>
                          ) : null}
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500">
                          {account.department && (
                            <span className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 truncate max-w-[160px]">
                              {account.department}
                            </span>
                          )}
                          {account.semester && (
                            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              Sem {account.semester}
                            </span>
                          )}
                        </div>

                        {account.bio && (
                          <p className="text-xs text-slate-500 line-clamp-1 pt-0.5">
                            {account.bio}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-2 rounded-2xl bg-slate-100 text-slate-400 group-hover:bg-[var(--color-primary-light)] group-hover:text-[var(--color-primary)] transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
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

export default SearchPage;
