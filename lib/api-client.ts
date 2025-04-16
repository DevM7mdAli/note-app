import axios from 'axios';
import { supabase } from './supabase';
import { Platform } from 'react-native';

// Use localhost for iOS and 10.0.2.2 for Android emulator
const baseURL = Platform.select({
  ios: 'http://localhost:3000/api',
  android: 'http://10.0.2.2:3000/api',
});

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

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
    const { data } = await api.get<NotesResponse>('/notes');
    return data.notes;
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