import { View, Text, StyleSheet, Alert } from 'react-native';
import { Button } from '@rneui/themed';

interface NoteProps {
  id: string;
  text: string;
  author?: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  isAdmin?: boolean;
}

export function Note({ id, text, author, onDelete, onEdit, isAdmin }: NoteProps) {
  const handleDelete = () => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => onDelete(id), style: 'destructive' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.noteText}>{text}</Text>
      {author && <Text style={styles.authorText}>By: {author}</Text>}
      <View style={styles.buttonContainer}>
        <Button
          title="Edit"
          onPress={() => onEdit(id)}
          buttonStyle={styles.editButton}
          titleStyle={styles.buttonText}
        />
        <Button
          title="Delete"
          onPress={handleDelete}
          buttonStyle={styles.deleteButton}
          titleStyle={styles.buttonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  noteText: {
    fontSize: 16,
    marginBottom: 8,
  },
  authorText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  editButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  buttonText: {
    fontSize: 14,
  },
});