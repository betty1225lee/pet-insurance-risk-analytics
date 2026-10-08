import api from './axios';

export const getCases = () => api.get('/cases');
export const createCase = (data) => api.post('/cases', data);
export const approveCase = (id) => api.patch(`/cases/${id}/approve`);