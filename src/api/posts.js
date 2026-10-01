import api from './client';
import apiCache from '../utils/apiCache';

export const getPosts = async ({
  page = 1,
  limit = 20,
  department = '',
  username = '',
  q = '',
  skipCache = false,
} = {}) => {
  const params = { page, limit };
  if (department && department !== 'All') params.department = department;
  if (username) params.username = username;
  if (q) params.q = q;

  const cacheKey = `/posts?${new URLSearchParams(params).toString()}`;
  if (skipCache) {
    const res = await api.get('/posts', { params });
    if (res && res.success) apiCache.set(cacheKey, res, 20000);
    return res;
  }

  return apiCache.cachedGet(cacheKey, () => api.get('/posts', { params }), 20000);
};

export const getPostById = async (id, skipCache = false) => {
  const cacheKey = `/posts/${id}`;
  if (skipCache) {
    const res = await api.get(`/posts/${id}`);
    if (res && res.success) apiCache.set(cacheKey, res, 30000);
    return res;
  }
  return apiCache.cachedGet(cacheKey, () => api.get(`/posts/${id}`), 30000);
};

export const createPost = async (formData) => {
  apiCache.invalidate('/posts');
  return api.post('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updatePost = async (id, formData) => {
  apiCache.invalidate('/posts');
  return api.put(`/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deletePost = async (id) => {
  apiCache.invalidate('/posts');
  return api.delete(`/posts/${id}`);
};

export const reactToPost = async (postId, emoji) => {
  apiCache.invalidate('/posts');
  return api.post(`/posts/${postId}/reactions`, { emoji });
};

export const removeReaction = async (postId) => {
  apiCache.invalidate('/posts');
  return api.delete(`/posts/${postId}/reactions`);
};

export const getMyReactedPosts = async ({ page = 1, limit = 20 } = {}) => {
  return api.get('/posts/my-reactions', { params: { page, limit } });
};

export const getTrendingPosts = async ({
  timeframe = 'today',
  page = 1,
  limit = 20,
  sortBy,
  skipCache = false,
} = {}) => {
  const params = { page, limit };
  if (sortBy) params.sortBy = sortBy;
  const endpoint =
    timeframe === 'week'
      ? '/posts/trending/week'
      : timeframe === 'popular'
      ? '/posts/popular'
      : '/posts/trending/today';

  const cacheKey = `${endpoint}?${new URLSearchParams(params).toString()}`;
  if (skipCache) {
    const res = await api.get(endpoint, { params });
    if (res && res.success) apiCache.set(cacheKey, res, 30000);
    return res;
  }

  return apiCache.cachedGet(cacheKey, () => api.get(endpoint, { params }), 30000);
};

export const getRecentOfficialPosts = async ({ hours = 24, limit = 5, skipCache = false } = {}) => {
  const params = { hours, limit };
  const cacheKey = `/posts/official/recent?${new URLSearchParams(params).toString()}`;
  if (skipCache) {
    const res = await api.get('/posts/official/recent', { params });
    if (res && res.success) apiCache.set(cacheKey, res, 45000);
    return res;
  }

  return apiCache.cachedGet(cacheKey, () => api.get('/posts/official/recent', { params }), 45000);
};

export const searchPosts = async ({ q = '', department = '', username = '', page = 1, limit = 20 } = {}) => {
  const params = { page, limit };
  if (q) params.q = q;
  if (department && department !== 'All') params.department = department;
  if (username) params.username = username;
  return api.get('/posts/search', { params });
};

export const getPostsByUser = async (userId, params) => {
  return api.get(`/posts/user/${userId}`, { params });
};
