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
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      const projectRef = 'keeotpkdytsjgkufuybs';
      
      const authData = {
        access_token: session.access_token,
        token_type: "bearer",
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        refresh_token: session.refresh_token,
        user: session.user
      };
      
      // Use btoa for base64 encoding in React Native
      const cookieValue = `base64-${btoa(JSON.stringify(authData))}`;

      // Set both cookie and authorization header for maximum compatibility
      config.headers['Cookie'] = `sb-${projectRef}-auth-token=${cookieValue}`;
      config.headers['Authorization'] = `Bearer ${session.access_token}`;
    }
    return config;
  } catch (error) {
    console.error('Error setting auth headers:', error);
    return config;
  }
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication error: Please log in again');
      // Handle unauthorized by signing out
      supabase.auth.signOut();
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