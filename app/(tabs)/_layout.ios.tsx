
import React from 'react';
import { Tabs } from 'expo-router/unstable-native-tabs';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => (
            <IconSymbol ios_icon_name="house.fill" android_material_icon_name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          title: 'Reels',
          tabBarIcon: ({ color }) => (
            <IconSymbol ios_icon_name="play.circle.fill" android_material_icon_name="play-circle" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="drops"
        options={{
          title: 'Drops',
          tabBarIcon: ({ color }) => (
            <IconSymbol ios_icon_name="flame.fill" android_material_icon_name="local-fire-department" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="database"
        options={{
          title: 'Database',
          tabBarIcon: ({ color }) => (
            <IconSymbol ios_icon_name="cylinder.fill" android_material_icon_name="storage" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Collection',
          tabBarIcon: ({ color }) => (
            <IconSymbol ios_icon_name="square.grid.2x2.fill" android_material_icon_name="grid-view" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          title: 'Market',
          tabBarIcon: ({ color }) => (
            <IconSymbol ios_icon_name="storefront.fill" android_material_icon_name="storefront" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <IconSymbol ios_icon_name="person.fill" android_material_icon_name="person" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
