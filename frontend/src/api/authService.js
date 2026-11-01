import apiClient from './client';

export const authService = {
  // Fetch /auth/csrf/ to ensure csrftoken cookie is planted in browser
  async initCsrf() {
    const res = await apiClient.get('/auth/csrf/');
    return res.data;
  },

  // Check current session
  async checkSession() {
    const res = await apiClient.get('/auth/user/');
    return res.data; // { isAuthenticated: boolean, username: string | null }
  },

  // Perform session login
  async login(username, password) {
    // Ensure CSRF cookie is active first
    await this.initCsrf();
    const res = await apiClient.post('/auth/login/', { username, password });
    return res.data; // { isAuthenticated: true, username: string }
  },

  // Perform session logout
  async logout() {
    const res = await apiClient.post('/auth/logout/');
    return res.data;
  },
};

