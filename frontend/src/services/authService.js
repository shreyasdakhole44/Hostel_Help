import api from './api';

export const authService = {
  login: async (credentials) => {
    // credentials: { email, password }
    const response = await api.post('/api/auth/login', credentials);
    return response.data; // Expected response: { token, role, name, userId }
  },

  register: async (userData) => {
    // userData: { name, roomNumber, email, phone, password }
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/student/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/api/student/profile', profileData);
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put('/api/student/change-password', passwordData);
    return response.data;
  }
};

export default authService;
