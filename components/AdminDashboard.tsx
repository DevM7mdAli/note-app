import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Note } from './Note';
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
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
  });

  // Update note mutation
  const updateNote = useMutation({
    mutationFn: notesApi.updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
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
          <Note
            key={note.id}
            id={note.id}
            text={note.note_text}
            author={note.user?.username || note.user?.full_name}
            onDelete={(id) => deleteNote.mutate(id)}
            onEdit={(id) => {
              const noteToEdit = notes.find(n => n.id === id);
              if (noteToEdit) {
                Alert.prompt(
                  'Edit Note',
                  'Update the note text:',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Update',
                      onPress: (text) => {
                        if (text) updateNote.mutate({ id, noteText: text });
                      },
                    },
                  ],
                  'plain-text',
                  noteToEdit.note_text
                );
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