import api from './axios';

export const getAllClaims = () => api.get('/all_claims');
export const createClaim = (data) => api.post('/claims', data);

export const approveClaim = (claimId) => api.put(`/claims/${claimId}/approve`);