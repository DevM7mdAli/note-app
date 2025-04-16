import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Note as NoteComponent } from './Note';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '../lib/api-client';

export function AdminDashboard() {
  const queryClient = useQueryClient();

  // Fetch all notes
  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: notesApi.getNotes
  });

  // Delete note mutation
  const deleteNote = useMutation({
    mutationFn: notesApi.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });

  // Update note mutation
  const updateNote = useMutation({
    mutationFn: notesApi.updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    }
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading notes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.subtitle}>Manage all user notes</Text>
      
      <ScrollView style={styles.notesList}>
        {notes?.map((note) => (
          <NoteComponent
            key={note.id}
            id={note.id}
            text={note.note_text}
            author={note.user?.username || note.user?.full_name}
            onDelete={(id) => deleteNote.mutate(id)}
            onEdit={(id) => {
              const noteToEdit = notes.find(n => n.id === id);
              if (noteToEdit) {
                // Handle edit through the API
                updateNote.mutate({ id, noteText: noteToEdit.note_text });
              }
            }}
            isAdmin
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  notesList: {
    flex: 1,
  },
});