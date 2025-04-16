import { View, StyleSheet, Alert } from 'react-native';
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
      Alert.alert('Error signing out', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Sign Out"
        onPress={handleSignOut}
        buttonStyle={styles.signOutButton}
        titleStyle={styles.buttonText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  signOutButton: {
    backgroundColor: '#ef4444',
    borderRadius: 8,
    padding: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});