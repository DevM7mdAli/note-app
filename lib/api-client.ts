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
  withCredentials: true // Enable sending cookies
});

// Add auth interceptor to include the token as a cookie
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    const projectRef = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_REF || 'your-project-ref';
    const cookieValue = encodeURIComponent(JSON.stringify({
      access_token: session.access_token,
      token_type: "bearer",
      expires_in: 3600,
      expires_at: session.expires_at,
      refresh_token: session.refresh_token,
      user: session.user
    }));
    
    config.headers['Cookie'] = `sb-${projectRef}-auth-token=${cookieValue}`;
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