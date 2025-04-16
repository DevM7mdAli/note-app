import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { Note } from './Note';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '../lib/api-client';

export function UserDashboard({ userId }: { userId: string }) {
  const [noteText, setNoteText] = useState('');
  const [editingNote, setEditingNote] = useState<{ id: string; text: string } | null>(null);
  const queryClient = useQueryClient();

  // Fetch user's notes
  const { data: notes, isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: notesApi.getNotes
  });

  // Create note mutation
  const createNote = useMutation({
    mutationFn: notesApi.createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      setNoteText('');
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
      setEditingNote(null);
    },
    onError: (error: Error) => {
      Alert.alert('Error', error.message);
    },
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

  const handleCreate = () => {
    if (!noteText.trim()) return;
    createNote.mutate(noteText);
  };

  const handleEdit = (id: string) => {
    const note = notes?.find(n => n.id === id);
    if (note) {
      setEditingNote({ id, text: note.note_text });
    }
  };

  const handleUpdate = () => {
    if (!editingNote || !editingNote.text.trim()) return;
    updateNote.mutate({ id: editingNote.id, noteText: editingNote.text });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading notes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {editingNote ? (
          <>
            <Input
              placeholder="Edit note..."
              value={editingNote.text}
              onChangeText={(text) => setEditingNote({ ...editingNote, text })}
              multiline
            />
            <View style={styles.editButtons}>
              <Button
                title="Cancel"
                onPress={() => setEditingNote(null)}
                buttonStyle={styles.cancelButton}
              />
              <Button
                title="Save"
                onPress={handleUpdate}
                loading={updateNote.isPending}
                buttonStyle={styles.saveButton}
              />
            </View>
          </>
        ) : (
          <>
            <Input
              placeholder="Add a new note..."
              value={noteText}
              onChangeText={setNoteText}
              multiline
            />
            <Button
              title="Create Note"
              onPress={handleCreate}
              loading={createNote.isPending}
              buttonStyle={styles.createButton}
            />
          </>
        )}
      </View>

      <ScrollView style={styles.notesList}>
        {notes?.map((note) => (
          <Note
            key={note.id}
            id={note.id}
            text={note.note_text}
            onDelete={(id) => deleteNote.mutate(id)}
            onEdit={handleEdit}
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
  inputContainer: {
    marginBottom: 16,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  notesList: {
    flex: 1,
  },
  createButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
  },
  saveButton: {
    backgroundColor: '#10b981',
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    borderRadius: 8,
    paddingHorizontal: 20,
  },
});