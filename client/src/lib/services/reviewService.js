import { api } from './apiclient/api.js';

export const reviewService = {
  getAll: (query) => api.get(`/reviews${query}`),
  getById: (id) => api.get(`/reviews/${id}`),
  create: (reviewData) => api.post('/reviews', reviewData),
  update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  delete: (id) => api.delete(`/reviews/${id}`),
};