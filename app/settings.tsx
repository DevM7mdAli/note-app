import { View, Alert } from 'react-native';
import { Button } from '@rneui/themed';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';

export default function Settings() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/');
    } catch (error) {
      Alert.alert('Error signing out', (error as Error).message);
    }
  };

  return (
    <View className="flex-1 p-5 justify-center">
      <Button
        title="Sign Out"
        onPress={handleSignOut}
        buttonStyle={{ backgroundColor: '#EF4444', borderRadius: 8, paddingVertical: 16 }}
        titleStyle={{ fontSize: 16, fontWeight: '600' }}
      />
    </View>
  );
}