import { View, Text, Alert } from 'react-native';
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
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <Text className="text-base mb-2">{text}</Text>
      {author && <Text className="text-sm text-gray-500 mb-3">By: {author}</Text>}
      <View className="flex-row justify-end gap-2">
        <Button
          title="Edit"
          onPress={() => onEdit(id)}
          buttonStyle={{ backgroundColor: '#3b82f6', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8 }}
          titleStyle={{ fontSize: 14 }}
        />
        <Button
          title="Delete"
          onPress={handleDelete}
          buttonStyle={{ backgroundColor: '#ef4444', borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8 }}
          titleStyle={{ fontSize: 14 }}
        />
      </View>
    </View>
  );
}