import { LoginCredentials, RegisterData, AuthResponse } from '../types/auth';
import apiClient from './client';

// For development, use mock data
const USE_MOCK_DATA = true;

const mockUser = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  avatar: undefined,
};

export const authService = {
  login: async (credentials: LoginCredentials) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const response: AuthResponse = {
        token: 'mock-token',
        user: mockUser,
      };
      localStorage.setItem('token', response.token);
      return response;
    }
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  register: async (data: RegisterData) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response: AuthResponse = {
        token: 'mock-token',
        user: {
          ...mockUser,
          name: data.name,
          email: data.email,
        },
      };
      localStorage.setItem('token', response.token);
      return response;
    }
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getCurrentUser: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockUser;
    }
    const response = await apiClient.get<AuthResponse['user']>('/auth/me');
    return response.data;
  },

  isAuthenticated: () => {
    if (USE_MOCK_DATA) {
      return true; // Always return authenticated for testing
    }
    return !!localStorage.getItem('token');
  },

  refreshToken: async () => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return 'mock-token';
    }
    try {
      const response = await apiClient.post<{ token: string }>('/auth/refresh');
      const { token } = response.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      localStorage.removeItem('token');
      throw error;
    }
  },

  updateProfile: async (data: { name?: string; email?: string; avatar?: File }) => {
    if (USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 800));
      return {
        ...mockUser,
        ...data,
        avatar: data.avatar ? URL.createObjectURL(data.avatar) : undefined,
      };
    }
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    
    const response = await apiClient.patch<AuthResponse['user']>('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
