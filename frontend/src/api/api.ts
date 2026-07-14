import axios from 'axios';
import type { TicketCreate, TicketUpdate, TicketResponse, TicketListResponse, NoteCreate, NoteResponse, AnalyticsSummary, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const ticketsApi = {
  list: async (search?: string, status?: string, assignedToMe?: boolean): Promise<TicketListResponse[]> => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (assignedToMe) params.append('assigned_to_me', 'true');
    const response = await apiClient.get('/tickets/', { params });
    return response.data;
  },
  
  get: async (id: number): Promise<TicketResponse> => {
    const response = await apiClient.get(`/tickets/${id}`);
    return response.data;
  },
  
  create: async (data: TicketCreate): Promise<TicketResponse> => {
    const response = await apiClient.post('/tickets/', data);
    return response.data;
  },
  
  update: async (id: number, data: TicketUpdate): Promise<TicketResponse> => {
    const response = await apiClient.put(`/tickets/${id}`, data);
    return response.data;
  }
};

export const notesApi = {
  list: async (ticketId: number): Promise<NoteResponse[]> => {
    const response = await apiClient.get(`/tickets/${ticketId}/notes`);
    return response.data;
  },
  
  create: async (ticketId: number, data: NoteCreate): Promise<NoteResponse> => {
    const response = await apiClient.post(`/tickets/${ticketId}/notes`, data);
    return response.data;
  }
};

export const analyticsApi = {
  getSummary: async (): Promise<AnalyticsSummary> => {
    const response = await apiClient.get('/analytics/summary');
    return response.data;
  }
};

export const usersApi = {
  getAgents: async (): Promise<User[]> => {
    const response = await apiClient.get('/users/agents');
    return response.data;
  }
};
