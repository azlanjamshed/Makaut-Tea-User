import api from './client';

export const getPosts = async ({ page = 1, limit = 20, department = '', username = '', q = '' } = {}) => {
  const params = { page, limit };
  if (department && department !== 'All') params.department = department;
  if (username) params.username = username;
  if (q) params.q = q;
  return api.get('/posts', { params });
};

export const getPostById = async (id) => {
  return api.get(`/posts/${id}`);
};

export const createPost = async (formData) => {
  return api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updatePost = async (id, formData) => {
  return api.put(`/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deletePost = async (id) => {
  return api.delete(`/posts/${id}`);
};

export const reactToPost = async (postId, emoji) => {
  return api.post(`/posts/${postId}/reactions`, { emoji });
};

export const removeReaction = async (postId) => {
  return api.delete(`/posts/${postId}/reactions`);
};

export const getMyReactedPosts = async ({ page = 1, limit = 20 } = {}) => {
  return api.get('/posts/my-reactions', { params: { page, limit } });
};

export const getTrendingPosts = async ({ timeframe = 'today', page = 1, limit = 20, sortBy } = {}) => {
  const params = { page, limit };
  if (sortBy) params.sortBy = sortBy;
  if (timeframe === 'week') {
    return api.get('/posts/trending/week', { params });
  }
  if (timeframe === 'popular') {
    return api.get('/posts/popular', { params });
  }
  return api.get('/posts/trending/today', { params });
};

export const getRecentOfficialPosts = async ({ hours = 24, limit = 5 } = {}) => {
  return api.get('/posts/official/recent', { params: { hours, limit } });
};

export const searchPosts = async ({ q = '', department = '', username = '', page = 1, limit = 20 } = {}) => {
  const params = { page, limit };
  if (q) params.q = q;
  if (department && department !== 'All') params.department = department;
  if (username) params.username = username;
  return api.get('/posts/search', { params });
};

export const getPostsByUser = async (userId) => {
  return api.get(`/posts/user/${userId}`);
};
