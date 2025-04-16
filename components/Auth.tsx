import React, { useState } from 'react'
import { Alert, Linking, View } from 'react-native'
import { supabase } from '../lib/supabase'
import { Button, Input } from '@rneui/themed'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <View className="mt-10 p-3">
      <View className="py-1 mt-5 self-stretch">
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View className="py-1 self-stretch">
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View className="py-1 mt-5 self-stretch">
        <Button 
          title="Sign in" 
          disabled={loading} 
          onPress={() => signInWithEmail()} 
          buttonStyle={{
            backgroundColor: '#3b82f6',
            borderRadius: 8,
            paddingVertical: 12
          }}
        />
      </View>
      <View className="py-1 self-stretch">
        <Button 
          title="Sign up" 
          disabled={loading} 
          onPress={() => Linking.openURL('http://localhost:3000/auth/sign-up')} 
          buttonStyle={{
            backgroundColor: '#6b7280',
            borderRadius: 8,
            paddingVertical: 12
          }}
        />
      </View>
    </View>
  )
}