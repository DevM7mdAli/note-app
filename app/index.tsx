import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Auth from '../components/Auth'
import { View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AdminDashboard } from '../components/AdminDashboard'
import { UserDashboard } from '../components/UserDashboard'
import { RootSafeView } from '../components/ui/view'

const queryClient = new QueryClient()

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user.id) {
        fetchUserRole(session.user.id)
      }
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user.id) {
        fetchUserRole(session.user.id)
      } else {
        setUserRole(null)
      }
    })
  }, [])

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (!error && data) {
      setUserRole(data.role)
    }
  }

  const RenderContent = () => {
    if (!session) {
      return <Auth />
    }

    return (
      <QueryClientProvider client={queryClient}>
        {userRole === 'admin' ? (
          <AdminDashboard />
        ) : (
          <UserDashboard />
        )}
      </QueryClientProvider>
    )
  }

  return (
    <RootSafeView>
      <RenderContent />
    </RootSafeView>
  )
}