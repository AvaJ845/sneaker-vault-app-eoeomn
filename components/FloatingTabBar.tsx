
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { 
  FlameIcon, 
  FeedIcon, 
  ShelfIcon, 
  PriceTagIcon, 
  SneakerRotateIcon,
  VaultIcon
} from '@/components/CustomIcons';
import { IconSymbol } from '@/components/IconSymbol';

export interface TabBarItem {
  name: string;
  route: string;
  icon: 'feed' | 'flame' | 'shelf' | 'storage' | 'price-tag' | 'profile' | 'star' | 'chart';
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
}

export default function FloatingTabBar({ tabs }: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const getIconComponent = (icon: TabBarItem['icon'], color: string) => {
    const size = 26;
    switch (icon) {
      case 'feed':
        return <FeedIcon size={size} color={color} />;
      case 'flame':
        return <FlameIcon size={size} color={color} />;
      case 'shelf':
        return <ShelfIcon size={size} color={color} />;
      case 'storage':
        return <VaultIcon size={size} color={color} />;
      case 'price-tag':
        return <PriceTagIcon size={size} color={color} />;
      case 'profile':
        return <SneakerRotateIcon size={size} color={color} />;
      case 'star':
        return (
          <IconSymbol
            ios_icon_name="star"
            android_material_icon_name="star-border"
            size={size}
            color={color}
          />
        );
      case 'chart':
        return (
          <IconSymbol
            ios_icon_name="chart.bar.xaxis"
            android_material_icon_name="bar-chart"
            size={size}
            color={color}
          />
        );
      default:
        return <FeedIcon size={size} color={color} />;
    }
  };

  const isActive = (route: string) => {
    if (route === '/(tabs)/(home)/') {
      return pathname === '/' || pathname === '/(tabs)/(home)/' || pathname.startsWith('/(tabs)/(home)');
    }
    return pathname === route || pathname.startsWith(route);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = isActive(tab.route);
          const color = active ? colors.primary : colors.textSecondary;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.tab}
              onPress={() => {
                console.log('Navigating to:', tab.route);
                router.push(tab.route as any);
              }}
            >
              {getIconComponent(tab.icon, color)}
              <Text style={[styles.label, { color }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 8,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px -4px 20px rgba(0, 0, 0, 0.6)',
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 4,
  },
});
