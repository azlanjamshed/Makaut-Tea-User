import api from './client';

export const getComments = async (postId, { page = 1, limit = 50, sort = 'desc' } = {}) => {
  return api.get(`/posts/${postId}/comments`, { params: { page, limit, sort } });
};

export const addComment = async (postId, { text, isAnonymous }) => {
  return api.post(`/posts/${postId}/comments`, { text, isAnonymous });
};

export const updateComment = async (commentId, { text, isAnonymous }) => {
  return api.put(`/comments/${commentId}`, { text, isAnonymous });
};

export const deleteComment = async (commentId) => {
  return api.delete(`/comments/${commentId}`);
};

export const getReplies = async (commentId, { page = 1, limit = 50 } = {}) => {
  return api.get(`/comments/${commentId}/replies`, { params: { page, limit } });
};

export const addReply = async (commentId, { text, isAnonymous }) => {
  return api.post(`/comments/${commentId}/replies`, { text, isAnonymous });
};

export const deleteReply = async (commentId, replyId) => {
  return api.delete(`/comments/${commentId}/replies/${replyId}`);
};
