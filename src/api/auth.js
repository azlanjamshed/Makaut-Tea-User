import api from './client';

export const login = async ({ email, password }) => {
  return api.post('/auth/login', { email, password });
};

export const register = async (formData) => {
  return api.post('/auth/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const logout = async () => {
  return api.post('/auth/logout');
};

export const getMe = async () => {
  return api.get('/auth/me');
};

export const googleLogin = async ({ credential, clientId, devUser } = {}) => {
  return api.post('/auth/google', { credential, clientId, devUser });
};

export const supabaseLogin = async ({ accessToken, user } = {}) => {
  return api.post('/auth/supabase', { accessToken, user });
};

export const completeOnboarding = async ({ department, semester, bio } = {}) => {
  return api.put('/auth/onboarding', { department, semester, bio });
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  return api.put('/auth/change-password', { currentPassword, newPassword });
};
