import api from './client';

export const createAnnouncementRequest = async (formData) => {
  return api.post('/announcement-requests', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getMyAnnouncementRequests = async () => {
  return api.get('/announcement-requests/my');
};

export const deleteAnnouncementRequest = async (id) => {
  return api.delete(`/announcement-requests/${id}`);
};
