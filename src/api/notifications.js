import api from './client';

export const getNotifications = async ({ page = 1, limit = 20, unreadOnly = false } = {}) => {
  return api.get('/notifications', { params: { page, limit, unreadOnly } });
};

export const getUnreadCount = async () => {
  return api.get('/notifications/unread-count');
};

export const markAsRead = async (id) => {
  return api.put(`/notifications/${id}/read`);
};

export const markAllAsRead = async () => {
  return api.put('/notifications/mark-all-read');
};

export const deleteNotification = async (id) => {
  return api.delete(`/notifications/${id}`);
};

export const clearAllNotifications = async () => {
  return api.delete('/notifications');
};
