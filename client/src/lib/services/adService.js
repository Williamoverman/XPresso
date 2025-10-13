import { api } from './apiclient/api.js';

export const adService = {
  getAll: () => api.get('/ads'),
  getById: (id) => api.get(`/ads/${id}`),
  create: (adData) => api.post('/ads', adData),
  update: (id, adData) => api.put(`/ads/${id}`, adData),
  delete: (id) => api.delete(`/ads/${id}`),
};