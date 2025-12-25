
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { BlurView } from 'expo-blur';
import { 
  FlameIcon, 
  FeedIcon, 
  ShelfIcon, 
  PriceTagIcon, 
  SneakerRotateIcon,
  ShoeboxAddIcon,
  VaultIcon
} from './CustomIcons';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
}

const getCustomIcon = (iconName: string, size: number, color: string) => {
  switch (iconName) {
    case 'home':
    case 'feed':
      return <FeedIcon size={size} color={color} />;
    case 'local-fire-department':
    case 'flame':
      return <FlameIcon size={size} color={color} />;
    case 'storage':
    case 'shelf':
      return <ShelfIcon size={size} color={color} />;
    case 'storefront':
    case 'price-tag':
      return <PriceTagIcon size={size} color={color} />;
    case 'person':
    case 'profile':
      return <SneakerRotateIcon size={size} color={color} />;
    case 'add':
    case 'upload':
      return <ShoeboxAddIcon size={size} color={color} />;
    case 'bookmark':
    case 'vault':
      return <VaultIcon size={size} color={color} />;
    default:
      return <FeedIcon size={size} color={color} />;
  }
};

export default function FloatingTabBar({ tabs }: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === '/(tabs)/(home)/') {
      return pathname === '/' || pathname.startsWith('/(tabs)/(home)');
    }
    return pathname.includes(route.replace('/(tabs)/', ''));
  };

  return (
    <View style={styles.container}>
      {/* Glow effect layers */}
      <View style={styles.glowContainer}>
        <View style={[styles.glowLayer, styles.glowLayer1]} />
        <View style={[styles.glowLayer, styles.glowLayer2]} />
        <View style={[styles.glowLayer, styles.glowLayer3]} />
      </View>
      
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <View style={styles.tabBar}>
          {tabs.map((tab, index) => {
            const active = isActive(tab.route);
            return (
              <TouchableOpacity
                key={index}
                style={styles.tab}
                onPress={() => router.push(tab.route as any)}
              >
                <View style={[styles.iconContainer, active && styles.iconContainerActive]}>
                  {getCustomIcon(tab.icon, 24, active ? colors.primary : colors.textSecondary)}
                </View>
                <Text style={[styles.label, active && styles.labelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    backgroundColor: 'transparent',
    pointerEvents: 'box-none',
  },
  glowContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 10,
    left: 16,
    right: 16,
    height: 70,
    borderRadius: 24,
    overflow: 'visible',
  },
  glowLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 24,
  },
  glowLayer1: {
    backgroundColor: colors.glow,
    opacity: 0.3,
    transform: [{ scale: 1.05 }],
    boxShadow: '0px 8px 32px rgba(255, 107, 53, 0.4)',
  },
  glowLayer2: {
    backgroundColor: colors.glowPurple,
    opacity: 0.2,
    transform: [{ scale: 1.03 }],
    boxShadow: '0px 6px 24px rgba(157, 78, 221, 0.3)',
  },
  glowLayer3: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    opacity: 0.5,
    transform: [{ scale: 1.01 }],
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.6)',
  },
  blurContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.8)',
    elevation: 12,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(26, 26, 26, 0.95)',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    marginBottom: 4,
    transform: [{ scale: 1 }],
  },
  iconContainerActive: {
    transform: [{ scale: 1.15 }],
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
