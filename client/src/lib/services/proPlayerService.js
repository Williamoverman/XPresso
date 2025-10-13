import { api } from './apiclient/api.js';

export const proPlayerService = {
  getAll: () => api.get('/pro-players'),
  getById: (id) => api.get(`/pro-players/${id}`),
  create: (proPlayerData) => api.post('/pro-players', proPlayerData),
  update: (id, proPlayerData) => api.put(`/pro-players/${id}`, proPlayerData),
  delete: (id) => api.delete(`/pro-players/${id}`),
  getGames: (id) => api.get(`/pro-players/${id}/games`),
  assignGame: (id, gameData) => api.post(`/pro-players/${id}/games`, gameData),
  updateAssignedGame: (id, game_id, gameData) => api.patch(`/pro-players/${id}/games/${game_id}`, gameData),
};