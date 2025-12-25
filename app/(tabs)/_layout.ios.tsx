
import React from 'react';
import { Tabs } from 'expo-router/unstable-native-tabs';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol ios_icon_name="house.fill" android_material_icon_name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="drops"
        options={{
          title: 'Drops',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol ios_icon_name="flame.fill" android_material_icon_name="whatshot" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="organize"
        options={{
          title: 'Organize',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol ios_icon_name="square.grid.2x2.fill" android_material_icon_name="grid_view" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Vault',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol ios_icon_name="shippingbox.fill" android_material_icon_name="inventory_2" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          title: 'Analytics',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol ios_icon_name="chart.bar.fill" android_material_icon_name="bar_chart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="database"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="marketplace"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
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
      <Tabs.Screen
        name="wishlist"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
