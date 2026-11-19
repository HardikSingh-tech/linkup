import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('linkup_user') || 'null'),
  token: localStorage.getItem('linkup_token') || null,
  isAuthenticated: !!localStorage.getItem('linkup_token'),
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('linkup_token', token);
      localStorage.setItem('linkup_user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || 'Invalid email or password';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/register', payload);
      const { token, user } = res.data;
      localStorage.setItem('linkup_token', token);
      localStorage.setItem('linkup_user', JSON.stringify(user));
      set({ token, user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.errors
        ? Object.values(err.response?.data?.errors || {}).join(', ')
        : 'Registration failed';
      set({ error: msg, isLoading: false });
      return { success: false, error: msg };
    }
  },

  logout: () => {
    localStorage.removeItem('linkup_token');
    localStorage.removeItem('linkup_user');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  fetchCurrentUser: async () => {
    try {
      const res = await api.get('/auth/me');
      localStorage.setItem('linkup_user', JSON.stringify(res.data));
      set({ user: res.data });
    } catch (err) {
      console.error('Failed to sync current user', err);
    }
  },

  updateCurrentUser: (updatedUser) => {
    localStorage.setItem('linkup_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  }
}));
