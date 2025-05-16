import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Medal, UsersRound, User } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function TabLayout() {
  const { user } = useAuth();

  // If no user is signed in, redirect to auth
  if (!user) {
    return null; // The app/_layout will handle the redirection
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1E90FF',
        tabBarInactiveTintColor: '#666666',
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sdgs"
        options={{
          title: 'SDGs',
          tabBarIcon: ({ color, size }) => (
            <Medal size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Community',
          tabBarIcon: ({ color, size }) => (
            <UsersRound size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}