import React, { useState } from 'react';
import { View, ScrollView, Alert, Text } from 'react-native';
import { Button, Input } from '@rneui/themed';
import { Note } from './Note';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '../lib/api-client';

export function UserDashboard() {
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
    onError: (error) => {
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
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  // Delete note mutation
  const deleteNote = useMutation({
    mutationFn: notesApi.deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
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
      <View className="flex-1 items-center justify-center">
        <Text className="text-base text-gray-600">Loading notes...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <View className="mb-4">
        {editingNote ? (
          <>
            <Input
              placeholder="Edit note..."
              value={editingNote.text}
              onChangeText={(text) => setEditingNote({ ...editingNote, text })}
              multiline
            />
            <View className="flex-row justify-end gap-2">
              <Button
                title="Cancel"
                onPress={() => setEditingNote(null)}
                buttonStyle={{
                  backgroundColor: '#6b7280',
                  borderRadius: 8,
                  paddingHorizontal: 20,
                  paddingVertical: 8
                }}
              />
              <Button
                title="Save"
                onPress={handleUpdate}
                loading={updateNote.isPending}
                buttonStyle={{
                  backgroundColor: '#10b981',
                  borderRadius: 8,
                  paddingHorizontal: 20,
                  paddingVertical: 8
                }}
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
              buttonStyle={{
                backgroundColor: '#3b82f6',
                borderRadius: 8,
                paddingVertical: 8
              }}
            />
          </>
        )}
      </View>

      <ScrollView className="flex-1">
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