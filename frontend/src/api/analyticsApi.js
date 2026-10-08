import api from './axios';

export const getAnalyticsSummary = () => api.get('/analytics/summary');

export const uploadPetData = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload-pet', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadClaimData = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload-claim', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const analyzeData = (petFile, claimFile) => {
  const formData = new FormData();
  formData.append('pet_file', petFile);
  formData.append('claim_file', claimFile);
  return api.post('/analyze-data', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};