import api from './client';

export const createReport = async ({ targetType, targetId, reason, description = '' }) => {
  return api.post('/reports', { targetType, targetId, reason, description });
};

export const getMyReports = async ({ page = 1, limit = 20 } = {}) => {
  return api.get('/reports/my', { params: { page, limit } });
};
