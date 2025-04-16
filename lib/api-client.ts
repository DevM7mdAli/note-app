import axios from 'axios';
import { supabase } from './supabase';
import Constants from 'expo-constants';

// Get the development server URL
const getBaseUrl = () => {
  let host = Constants.expoConfig?.hostUri?.split(':')[0];
  return host ? `http://${host}:3000/api` : 'http://localhost:3000/api';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth interceptor to include the token in every request
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    // Pass the token in a cookie named 'sb-access-token' to match Next.js expectations
    config.headers['Cookie'] = `sb-access-token=${session.access_token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication error: Please log in again');
      // Optionally redirect to login or refresh token
    } else if (error.code === 'ERR_NETWORK') {
      console.error(`Network error: Cannot connect to ${getBaseUrl()}`);
      console.error('Please ensure your Next.js server is running and accessible');
    }
    return Promise.reject(error);
  }
);

export interface Note {
  id: string;
  created_at: string;
  note_text: string;
  note_user: Array<{ user_id: string }>;
  user?: {
    id: string;
    username: string;
    full_name: string;
  };
}

export interface NotesResponse {
  notes: Note[];
}

export const notesApi = {
  getNotes: async () => {
    try {
      const { data } = await api.get<NotesResponse>('/notes');
      return data.notes;
    } catch (error) {
      console.error('Error fetching notes:', error);
      throw error;
    }
  },

  createNote: async (noteText: string) => {
    const { data } = await api.post('/notes', { noteText });
    return data;
  },

  updateNote: async ({ id, noteText }: { id: string; noteText: string }) => {
    const { data } = await api.put('/notes', { id, noteText });
    return data;
  },

  deleteNote: async (id: string) => {
    const { data } = await api.delete(`/notes?id=${id}`);
    return data;
  },
};