import { api } from './apiclient/api.js';

export const adService = {
  getAll: (queryParams = '') => api.get(`/ads${queryParams}`),
  getById: (id) => api.get(`/ads/${id}`),
  create: (adData) => api.post('/ads', adData),
  update: (id, adData) => api.patch(`/ads/${id}`, adData),
  delete: (id) => api.delete(`/ads/${id}`),
};