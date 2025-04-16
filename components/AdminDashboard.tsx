import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Note as NoteComponent } from './Note';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notesApi } from '../lib/api-client';
import { Input } from '@rneui/themed';
import Button from './ui/button';

export function AdminDashboard() {
  const [editingNote, setEditingNote] = useState<{ id: string; text: string } | null>(null);
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
      <View className="flex-1 items-center justify-center">
        <Text className="text-base text-gray-600">Loading notes...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-1">Admin Dashboard</Text>
      <Text className="text-base text-gray-500 mb-4">Manage all user notes</Text>
      
      {editingNote && (
        <View className="mb-4">
          <Input
            placeholder="Edit note..."
            value={editingNote.text}
            onChangeText={(text) => setEditingNote({ ...editingNote, text })}
            multiline
          />
          <View className="flex-row justify-end gap-2">
            <Button
              title="Cancel"
              variant="secondary"
              onPress={() => setEditingNote(null)}
            />
            <Button
              title="Save"
              variant="primary"
              loading={updateNote.isPending}
              onPress={() => {
                updateNote.mutate({ 
                  id: editingNote.id, 
                  noteText: editingNote.text 
                });
                setEditingNote(null);
              }}
            />
          </View>
        </View>
      )}
      
      <ScrollView className="flex-1">
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
                setEditingNote({ 
                  id, 
                  text: noteToEdit.note_text 
                });
              }
            }}
            isAdmin
          />
        ))}
      </ScrollView>
    </View>
  );
}