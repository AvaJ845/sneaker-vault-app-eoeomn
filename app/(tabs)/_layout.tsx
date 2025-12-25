
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
      name: 'database',
      route: '/(tabs)/database',
      icon: 'shelf',
      label: 'Database',
    },
    {
      name: 'collection',
      route: '/(tabs)/collection',
      icon: 'storage',
      label: 'Vault',
    },
    {
      name: 'marketplace',
      route: '/(tabs)/marketplace',
      icon: 'price-tag',
      label: 'Market',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'profile',
      label: 'Profile',
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
        <Stack.Screen key="collection" name="collection" />
        <Stack.Screen key="marketplace" name="marketplace" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
