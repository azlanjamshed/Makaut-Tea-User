import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import MobileHeader from '../components/navigation/MobileHeader';
import NotificationItem from '../components/notifications/NotificationItem';
import { NotificationSkeleton } from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import ErrorState from '../components/common/ErrorState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as notifApi from '../api/notifications';
import { CheckCheck, Trash2, Filter } from 'lucide-react';

const NotificationsPage = ({ onRefreshUnreadCount }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await notifApi.getNotifications({ unreadOnly, limit: 40 });
      if (res.success) {
        setNotifications(res.data || []);
        setUnreadCount(res.unreadCount || 0);
        onRefreshUnreadCount?.();
      }
    } catch (err) {
      setError(err.message || 'Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  }, [unreadOnly, onRefreshUnreadCount]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchNotifications();
  }, [isAuthenticated, fetchNotifications, navigate]);

  const handleMarkAsRead = async (id) => {
    try {
      await notifApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => ((n.id || n._id) === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(c - 1, 0));
      onRefreshUnreadCount?.();
    } catch (err) {
      // silently handle
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notifApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      onRefreshUnreadCount?.();
      showToast('All marked as read', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to mark all as read', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await notifApi.deleteNotification(id);
      setNotifications((prev) => prev.filter((n) => (n.id || n._id) !== id));
      onRefreshUnreadCount?.();
    } catch (err) {
      showToast(err.message || 'Failed to delete notification', 'error');
    }
  };

  const handleClearAll = async () => {
    setIsClearing(true);
    try {
      await notifApi.clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      onRefreshUnreadCount?.();
      showToast('All notifications cleared', 'success');
      setShowClearConfirm(false);
    } catch (err) {
      showToast(err.message || 'Failed to clear notifications', 'error');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-8 max-w-2xl mx-auto w-full">
      <MobileHeader
        title="Notifications"
        rightAction={
          notifications.length > 0 ? (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                title="Mark all as read"
              >
                <CheckCheck className="w-5 h-5 text-sky-400" />
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(true)}
                className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                title="Clear all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : null
        }
      />

      <main className="px-4 py-4 space-y-4">
        {/* Filter Toggle: All vs Unread */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setUnreadOnly(false)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                !unreadOnly
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-white border border-[var(--border-color)] text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
            >
              All Notifications
            </button>
            <button
              type="button"
              onClick={() => setUnreadOnly(true)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                unreadOnly
                  ? 'bg-[var(--color-primary)] text-white shadow-sm'
                  : 'bg-white border border-[var(--border-color)] text-slate-600 hover:text-slate-900 shadow-sm'
              }`}
            >
              <span>Unread</span>
              {unreadCount > 0 && (
                <span className="bg-white/20 text-white text-[10px] px-1.5 rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Notification Feed */}
        {isLoading ? (
          <div className="space-y-3 pt-2">
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </div>
        ) : error ? (
          <ErrorState
            title="Could not load notifications"
            message={error}
            onRetry={fetchNotifications}
          />
        ) : notifications.length === 0 ? (
          <EmptyState
            emoji="🔔"
            title="You're all caught up"
            message={
              unreadOnly
                ? 'No unread notifications right now.'
                : 'When someone reacts, comments on, or replies to your rants, you will see alerts here.'
            }
            className="mt-8"
          />
        ) : (
          <div className="space-y-2.5">
            {notifications.map((notif) => (
              <NotificationItem
                key={notif.id || notif._id}
                notification={notif}
                onMarkRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <ConfirmationModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearAll}
        title="Clear all notifications?"
        message="This will delete your entire notification history."
        confirmText="Clear All"
        isLoading={isClearing}
      />
    </div>
  );
};

export default NotificationsPage;
