
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'feed',
      label: 'Feed',
    },
    {
      name: 'drops',
      route: '/(tabs)/drops',
      icon: 'flame',
      label: 'Drops',
    },
    {
      name: 'organize',
      route: '/(tabs)/organize',
      icon: 'grid',
      label: 'Organize',
    },
    {
      name: 'collection',
      route: '/(tabs)/collection',
      icon: 'storage',
      label: 'Vault',
    },
    {
      name: 'analytics',
      route: '/(tabs)/analytics',
      icon: 'chart',
      label: 'Analytics',
    },
    
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="reels" name="reels" />
        <Stack.Screen key="drops" name="drops" />
        <Stack.Screen key="database" name="database" />
        <Stack.Screen key="organize" name="organize" />
        <Stack.Screen key="collection" name="collection" />
        <Stack.Screen key="wishlist" name="wishlist" />
        <Stack.Screen key="analytics" name="analytics" />
        <Stack.Screen key="marketplace" name="marketplace" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
