import { useEffect, useState } from 'react'
import { Alert, Linking, View } from 'react-native'
import { supabase } from '../../lib/supabase'
import { Button, Input } from '@rneui/themed'
import { router } from 'expo-router'
import { Session } from '@supabase/supabase-js'

export default function Auth() {
  const [authInfo, setAuthInfo] = useState({email: '' , password: ''})
  const [loading, setLoading] = useState(false)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user.id) {
        router.replace('/(tabs)')
      } else {
        setLoading(false)
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user.id) {
        router.replace('/(tabs)')
      } else {
        setLoading(false)
      }
    })
  }, [])
  
  

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: authInfo.email,
      password: authInfo.password,
    })
    if (error){
      Alert.alert(error.message)
      setLoading(false)
    } else {
      setLoading(false)
      router.replace('/(tabs)')
    } 
  }

  return (
    <View className="mt-10 p-3">
      <View className="py-1 mt-5 self-stretch">
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setAuthInfo({...authInfo, email:text})}
          value={authInfo.email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View className="py-1 self-stretch">
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setAuthInfo({...authInfo, password:text})}
          value={authInfo.password}
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