
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home',
      label: 'Feed',
    },
    {
      name: 'drops',
      route: '/(tabs)/drops',
      icon: 'local-fire-department',
      label: 'Drops',
    },
    {
      name: 'collection',
      route: '/(tabs)/collection',
      icon: 'grid-view',
      label: 'Collection',
    },
    {
      name: 'marketplace',
      route: '/(tabs)/marketplace',
      icon: 'storefront',
      label: 'Market',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
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
        <Stack.Screen key="drops" name="drops" />
        <Stack.Screen key="collection" name="collection" />
        <Stack.Screen key="marketplace" name="marketplace" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
