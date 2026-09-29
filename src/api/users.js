import api from './client';

export const getUserById = async (id) => {
  return api.get(`/users/${id}`);
};

export const searchUsers = async ({ q = '', limit = 20 } = {}) => {
  return api.get('/users/search', { params: { q, limit } });
};

export const updateMyProfile = async (formData) => {
  return api.put('/users/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteMyAccount = async () => {
  return api.delete('/users/me');
};
