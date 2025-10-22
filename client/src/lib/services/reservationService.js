import { api } from './apiclient/api.js';

export const reservationService = {
  getAllForAdmin: () => api.get('/reservations/admin/all'),
  getAll: (query = '') => api.get(`/reservations${query}`),
  getById: (id) => api.get(`/reservations/${id}`),
  create: (reservationData) => api.post('/reservations', reservationData),
  update: (id, reservationData) => api.patch(`/reservations/${id}`, reservationData),
  delete: (id) => api.delete(`/reservations/${id}`),
};