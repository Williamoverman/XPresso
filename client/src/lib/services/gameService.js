import { api } from './apiclient/api.js';

export const gameService = {
  getAll: () => api.get('/games'),
  getById: (id) => api.get(`/games/${id}`),
  create: (gameData) => api.post('/games', gameData),
  update: (id, gameData) => api.put(`/games/${id}`, gameData),
  delete: (id) => api.delete(`/games/${id}`),
};