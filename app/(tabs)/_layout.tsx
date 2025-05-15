import { Tabs } from "expo-router";
import { MaterialIcons } from '@expo/vector-icons'


const Layout = () => {
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: "#d81313",
      tabBarInactiveTintColor: "#5E5E5E",
      tabBarHideOnKeyboard: true,
    }}
    >
      <Tabs.Screen 
      name="index"
      options={{
        headerShown: false,
        tabBarIcon: ({ focused, color }) => ( 
        <MaterialIcons 
        name="notes" 
        size={24} 
        color={color} 
        /> 
      ),
        title: 'Notes'
      }}
      />
      <Tabs.Screen 
      name="settings"
      options={{
        headerShown: false,
        tabBarIcon: ({ focused, color }) => ( 
        <MaterialIcons 
        name="settings" 
        size={24} 
        color={color}/> 
      ),
        title: 'Setting'
      }}
      />
    </Tabs>
  );
}



export default Layout;
