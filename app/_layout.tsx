import { Stack } from 'expo-router';
import "../global.css"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function Layout() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
    <Stack>
      <Stack.Screen name='(auth)'
      options={{
        headerShown: false
      }}
      />

      <Stack.Screen name='(tabs)' 
      options={{
        headerShown: false
      }}
      />
    </Stack>
    </QueryClientProvider>

    // <Tabs
    //   screenOptions={{
    //     tabBarStyle: { paddingBottom: 5 },
    //   }}>
    //   <Tabs.Screen
    //     name="index"
    //     options={{
    //       title: 'Notes',
    //       tabBarIcon: ({ focused, color }) => (
    //         <Ionicons
    //           name={focused ? 'document-text' : 'document-text-outline'}
    //           size={24}
    //           color={color}
    //         />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="settings"
    //     options={{
    //       title: 'Settings',
    //       tabBarIcon: ({ focused, color }) => (
    //         <Ionicons
    //           name={focused ? 'settings' : 'settings-outline'}
    //           size={24}
    //           color={color}
    //         />
    //       ),
    //     }}
    //   />
    // </Tabs>
  );
}
