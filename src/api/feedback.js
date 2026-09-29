import api from './client';

export const submitFeedback = async (formData) => {
  return api.post('/feedback', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getMyFeedback = async () => {
  return api.get('/feedback/my');
};
