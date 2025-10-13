import { authState } from '../state/authState.svelte.js';
import { api } from './apiclient/api.js';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    authState.login(response.token);
    return response;
  },

  async logout() {
    await api.post('/auth/logout');
    authState.logout();
  }
};