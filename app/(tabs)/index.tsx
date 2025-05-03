import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { View, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { AdminDashboard } from '../../components/AdminDashboard'
import { UserDashboard } from '../../components/UserDashboard'
import { RootSafeView } from '../../components/ui/view'



export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user.id) {
        fetchUserRole(session.user.id)
      } else {
        setIsLoading(false)
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user.id) {
        fetchUserRole(session.user.id)
      } else {
        setUserRole(null)
        setIsLoading(false)
      }
    })
  }, [])

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user role:', error)
      } else {
        setUserRole(data?.role || 'user') // Default to 'user' if no role is set
      }
    } catch (error) {
      console.error('Error in fetchUserRole:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const RenderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg">Loading...</Text>
        </View>
      )
    }

    return (
      <>
        {userRole === 'admin' ? (
          <AdminDashboard />
        ) : (
          <UserDashboard />
        )}
      </>
    )
  }

  return (
    <RootSafeView>
      <RenderContent />
    </RootSafeView>
  )
}