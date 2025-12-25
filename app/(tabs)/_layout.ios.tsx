
import React from 'react';
import { Tabs } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';
import { 
  FlameIcon, 
  FeedIcon, 
  ShelfIcon, 
  PriceTagIcon, 
  SneakerRotateIcon,
  VaultIcon
} from '@/components/CustomIcons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(26, 26, 26, 0.95)',
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 24,
          height: 88,
          boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.6)',
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => (
            <FeedIcon size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="drops"
        options={{
          title: 'Drops',
          tabBarIcon: ({ color }) => (
            <FlameIcon size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="database"
        options={{
          title: 'Database',
          tabBarIcon: ({ color }) => (
            <ShelfIcon size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Vault',
          tabBarIcon: ({ color }) => (
            <VaultIcon size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Market',
          tabBarIcon: ({ color }) => (
            <PriceTagIcon size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <SneakerRotateIcon size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
