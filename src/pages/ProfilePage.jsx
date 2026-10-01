import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MobileHeader from '../components/navigation/MobileHeader';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ConfirmationModal from '../components/common/ConfirmationModal';
import ReportSheet from '../components/reports/ReportSheet';
import RantCard from '../components/rants/RantCard';
import { RantCardSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as postsApi from '../api/posts';
import * as usersApi from '../api/users';
import {
  Edit3,
  LogOut,
  FileText,
  Calendar,
  Building2,
  GraduationCap,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  VenetianMask,
} from 'lucide-react';

const ProfilePage = ({ onOpenEdit }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();

  // Determine if viewing own profile
  const isSelf =
    !id ||
    (authUser &&
      (String(authUser.id) === String(id) || String(authUser._id) === String(id)));

  const targetId = isSelf ? (authUser?.id || authUser?._id) : id;

  // TanStack Query for user profile details
  const {
    data: fetchedUser,
    isLoading: isLoadingUser,
    error: userQueryError,
  } = useQuery({
    queryKey: ['user-profile', targetId],
    queryFn: async () => {
      const res = await usersApi.getUserById(targetId);
      return res?.data || null;
    },
    enabled: Boolean(targetId && !isSelf),
  });

  const profileUser = isSelf ? authUser : (fetchedUser || null);
  const userError = userQueryError?.message || null;

  // TanStack Query for user posts
  const {
    data: fetchedPosts,
    isLoading: isLoadingPosts,
  } = useQuery({
    queryKey: ['user-rants', targetId],
    queryFn: async () => {
      const res = await postsApi.getPostsByUser(targetId);
      return res?.data || [];
    },
    enabled: Boolean(targetId),
  });

  // TanStack Query for self reaction stats
  const { data: myReactionsData } = useQuery({
    queryKey: ['my-reactions-count', targetId],
    queryFn: async () => {
      const res = await postsApi.getMyReactedPosts({ limit: 100 });
      return res?.data?.length || 0;
    },
    enabled: Boolean(isSelf && isAuthenticated),
  });

  const totalReactionsGiven = myReactionsData || 0;
  const [posts, setPosts] = useState([]);

  // Modals & interaction state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);

  useEffect(() => {
    if (isSelf && !isAuthenticated) {
      navigate('/login');
    }
  }, [isSelf, isAuthenticated, navigate]);

  useEffect(() => {
    if (fetchedPosts) {
      setPosts(fetchedPosts);
    }
  }, [fetchedPosts]);

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'info');
    navigate('/login');
  };

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

  if (isLoadingUser) {
    return (
      <div className="min-h-screen pb-24 md:pb-8 max-w-2xl mx-auto w-full">
        <MobileHeader title="Profile" showBack={!isSelf} />
        <main className="px-4 py-4 space-y-4">
          <div className="bg-white border border-[var(--border-color)] rounded-2xl p-4 sm:p-5 animate-pulse space-y-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-13 h-13 rounded-2xl bg-slate-100 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-1/4" />
              </div>
            </div>
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
          <RantCardSkeleton />
        </main>
      </div>
    );
  }

  if (userError || !profileUser) {
    return (
      <div className="min-h-screen pb-24 md:pb-8 max-w-2xl mx-auto w-full">
        <MobileHeader title="Profile" showBack={!isSelf} />
        <main className="px-4 py-12">
          <ErrorState
            title="User Unavailable"
            message={userError || 'This account does not exist or has been deactivated.'}
            actionText="Go Back"
            onAction={() => navigate(-1)}
          />
        </main>
      </div>
    );
  }

  const isAdmin = profileUser.role === 'admin';

  return (
    <div className="min-h-screen pb-24 md:pb-8 max-w-2xl mx-auto w-full">
      <MobileHeader
        title={isSelf ? 'My Profile' : `${profileUser.name}`}
        showBack={!isSelf}
        rightAction={
          isSelf ? (
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-colors"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          ) : null
        }
      />

      <main className="px-4 py-3 sm:py-4 space-y-4">
        {/* User Profile Card (Compact & Space-Efficient) */}
        <div className="bg-white border border-[var(--border-color)] rounded-2xl p-4 sm:p-5 relative shadow-sm space-y-3">
          {/* Top Row: Avatar + Name & Info + Edit Action */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Avatar
                src={profileUser.image}
                name={profileUser.name}
                size="lg"
                className="ring-2 ring-slate-100 shrink-0 w-14 h-14"
              />

              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 font-display truncate">
                    {profileUser.name}
                  </h2>
                  {isAdmin ? (
                    <Badge variant="primary" size="xs" icon={ShieldCheck}>
                      Admin
                    </Badge>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      Student
                    </span>
                  )}
                </div>

                {/* Identity line: anon + email */}
                {isSelf ? (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                    <span className="inline-flex items-center gap-1 font-mono text-[var(--color-primary)] font-semibold bg-[var(--color-primary-light)] px-1.5 py-0.5 rounded border border-[var(--color-primary)]/20">
                      <VenetianMask className="w-3.5 h-3.5" />
                      <span>{profileUser.anonymousUsername || 'anon_student'}</span>
                    </span>
                    <span>·</span>
                    <span className="truncate">{profileUser.email}</span>
                  </div>
                ) : (
                  profileUser.department && (
                    <p className="text-xs text-slate-500 truncate">
                      {profileUser.department} {profileUser.semester ? `· Sem ${profileUser.semester}` : ''}
                    </p>
                  )
                )}
              </div>
            </div>

            {/* Edit Profile Button at Top Right */}
            {isSelf && (
              <Link
                to="/profile/edit"
                className="px-3 py-1.5 rounded-xl border border-[var(--border-color)] hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Edit Profile</span>
                <span className="sm:hidden">Edit</span>
              </Link>
            )}
          </div>

          {/* Bio (compact if present) */}
          {profileUser.bio ? (
            <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
              {profileUser.bio}
            </p>
          ) : isSelf ? (
            <p className="text-[11px] text-slate-400 italic">
              No bio yet. Tap Edit to add one!
            </p>
          ) : null}

          {/* Compact Metadata Chips */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600 pt-0.5">
            {profileUser.department && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-[var(--border-color)]">
                <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate max-w-[150px] sm:max-w-none">{profileUser.department}</span>
              </span>
            )}
            {profileUser.semester && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-[var(--border-color)]">
                <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                <span>Sem {profileUser.semester}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-[var(--border-color)]">
              <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
              <span>Joined {new Date(profileUser.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-[var(--border-color)] font-medium">
              <MessageSquare className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{posts.length} {posts.length === 1 ? 'Rant' : 'Rants'}</span>
            </span>
          </div>

          {/* Self-only Stats Quick Links */}
          {isSelf && (
            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[var(--border-color)]">
              <Link
                to="/my-rants"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/80 hover:bg-slate-100 border border-[var(--border-color)] transition-all group"
              >
                <span className="text-xs text-slate-600 font-medium">My Rants</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-black text-[var(--color-primary)] font-display tabular-nums">
                    {posts.length}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                </div>
              </Link>

              <Link
                to="/my-reactions"
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50/80 hover:bg-slate-100 border border-[var(--border-color)] transition-all group"
              >
                <span className="text-xs text-slate-600 font-medium truncate mr-1">Reactions</span>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-sm font-black text-[var(--color-primary)] font-display tabular-nums">
                    {totalReactionsGiven}
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-slate-600" />
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Posts Feed Section */}
        <section className="space-y-4 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--color-primary)]" />
              <span>{isSelf ? 'My Rants' : `Rants by ${profileUser.name}`}</span>
            </h3>
            <span className="text-xs text-slate-600 font-semibold bg-white px-2.5 py-1 rounded-full border border-[var(--border-color)] shadow-xs">
              {posts.length} {posts.length === 1 ? 'post' : 'posts'}
            </span>
          </div>

          {isLoadingPosts ? (
            <div className="space-y-4">
              <RantCardSkeleton />
              <RantCardSkeleton />
            </div>
          ) : posts.length === 0 ? (
            <EmptyState
              icon={FileText}
              title={isSelf ? 'No rants yet' : `No rants from ${profileUser?.name || 'this student'} yet`}
              message={
                isSelf
                  ? 'Be the first one to spill the tea.'
                  : `${profileUser?.name || 'This student'} hasn't posted any public rants yet.`
              }
              actionText={isSelf ? 'Spill The Tea' : undefined}
              onAction={isSelf ? () => onOpenEdit?.(null) : undefined}
              className="py-12"
            />
          ) : (
            <div className="space-y-4">
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
        </section>
      </main>

      {/* Confirmation & Report Modals */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign out of MAKAU-TEA?"
        message="You will need your email and password to log back in."
        confirmText="Log Out"
        isDestructive={false}
      />

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

export default ProfilePage;
