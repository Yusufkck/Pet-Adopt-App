import { View, Text } from 'react-native'
import React from 'react'
import {Tabs} from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import  Colors  from './../../constants/Colors'
import { Redirect } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function TabLayout() {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) {
    return <Redirect href={'/login'} />
  }
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor:Colors.PRIMARY
    }}
    >
        <Tabs.Screen name='home'
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon:({Color})=><Ionicons name="home" size={24} color={Color} />
          }}
        />
        <Tabs.Screen name='favorite'
         options={{
            title: 'Favorite',
            headerShown: false,
            tabBarIcon:({Color})=><Ionicons name="heart" size={24} color={Color} />
          }}
            />
        <Tabs.Screen name='inbox'
           options={{
            title: 'Chat',
            headerShown: false,
            tabBarIcon:({Color})=> <Ionicons name="chatbox-ellipses" size={24} color={Color} />
          }}
        />
        <Tabs.Screen name='profile'
             options={{
            title: 'Profile',
            headerShown: false,
            tabBarIcon:({Color})=><Ionicons name="people-circle-sharp" size={24} color="black" />
            }}
        />
    </Tabs>
  
  )
}