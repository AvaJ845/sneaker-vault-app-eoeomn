
import React from 'react';
import { colors } from '@/styles/commonStyles';
import { 
  FlameIcon, 
  FeedIcon, 
  ShelfIcon, 
  PriceTagIcon, 
  SneakerRotateIcon,
  VaultIcon
} from '@/components/CustomIcons';

// Try to import Tabs with error handling
let Tabs: any;
try {
  const expoRouterTabs = require('expo-router/unstable-native-tabs');
  Tabs = expoRouterTabs.Tabs;
  console.log('✅ Successfully imported Tabs from expo-router/unstable-native-tabs');
} catch (error) {
  console.error('❌ Failed to import Tabs:', error);
  // Fallback to regular expo-router if unstable-native-tabs fails
  const expoRouter = require('expo-router');
  Tabs = expoRouter.Tabs;
  console.log('⚠️ Using fallback Tabs from expo-router');
}

export default function TabLayout() {
  console.log('iOS TabLayout rendering, Tabs:', typeof Tabs);
  
  if (!Tabs) {
    console.error('❌ Tabs is undefined!');
    return null;
  }

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
          tabBarIcon: ({ color }: { color: string }) => (
            <FeedIcon size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="drops"
        options={{
          title: 'Drops',
          tabBarIcon: ({ color }: { color: string }) => (
            <FlameIcon size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="database"
        options={{
          title: 'Database',
          tabBarIcon: ({ color }: { color: string }) => (
            <ShelfIcon size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Vault',
          tabBarIcon: ({ color }: { color: string }) => (
            <VaultIcon size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Market',
          tabBarIcon: ({ color }: { color: string }) => (
            <PriceTagIcon size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }: { color: string }) => (
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
