import axios from 'axios';

// Using localhost for development
const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
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
    try {
      const { data } = await api.get<NotesResponse>('/notes');
      return data?.notes ?? [];
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
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