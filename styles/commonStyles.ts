
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Sneaker culture-inspired color palette - dark mode with purple/orange accents
export const colors = {
  // Dark mode primary (industrial concrete backgrounds)
  background: '#0A0A0A',
  backgroundSecondary: '#141414',
  concrete: '#1C1C1E',
  
  // Card and surface colors (shoebox inspired)
  card: '#1A1A1A',
  cardElevated: '#222222',
  shoeboxLid: '#2C2C2E',
  shoeboxBase: '#1C1C1E',
  
  // Text colors
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textTertiary: '#666666',
  
  // Accent colors - purple/orange sneaker culture
  primary: '#FF6B35', // Vibrant orange
  secondary: '#9D4EDD', // Purple accent
  accent: '#FFE66D', // Highlight yellow
  
  // Fire animation colors
  fireOrange: '#FF6B35',
  fireRed: '#FF3D00',
  fireYellow: '#FFD600',
  
  // Status colors
  success: '#4ECCA3',
  error: '#FF6B6B',
  warning: '#FFD93D',
  
  // Border and divider
  border: '#2A2A2A',
  divider: '#333333',
  
  // Special effects
  overlay: 'rgba(0, 0, 0, 0.7)',
  shimmer: 'rgba(255, 255, 255, 0.1)',
  glow: 'rgba(255, 107, 53, 0.4)',
  glowPurple: 'rgba(157, 78, 221, 0.4)',
  
  // Gradient colors for premium feel
  gradientStart: '#FF6B35',
  gradientEnd: '#9D4EDD',
  
  // Light mode (for users who prefer it)
  lightBackground: '#F5F5F5',
  lightCard: '#FFFFFF',
  lightText: '#0A0A0A',
  lightTextSecondary: '#666666',
  lightBorder: '#E0E0E0',
};

// Typography system - Sneaker Vault brand
export const typography = {
  // App Name - Helvetica Neue Black equivalent (using system fonts)
  appName: {
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-CondensedBlack' : 'sans-serif-condensed',
    fontSize: 32,
    fontWeight: '900' as const,
    letterSpacing: -0.96, // -0.03em of 32px
    color: colors.text,
  },
  
  // Tagline - Futura PT Medium equivalent
  tagline: {
    fontFamily: Platform.OS === 'ios' ? 'Futura-Medium' : 'sans-serif',
    fontSize: 13,
    fontWeight: '500' as const,
    letterSpacing: 1.95, // +0.15em of 13px
    textTransform: 'uppercase' as const,
    color: colors.textSecondary,
  },
  
  // Username - SF Pro Display Semibold
  username: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 16,
    fontWeight: '600' as const,
    letterSpacing: 0,
    color: colors.text,
  },
  
  // Shoe Name - SF Pro Display Regular
  shoeName: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 14,
    fontWeight: '400' as const,
    letterSpacing: 0,
    color: colors.textSecondary,
  },
  
  // Body text
  body: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: colors.text,
  },
  
  // Caption
  caption: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    color: colors.textSecondary,
  },
  
  // Button text
  button: {
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    fontSize: 16,
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(255, 107, 53, 0.3)',
    elevation: 4,
  },
  secondary: {
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(157, 78, 221, 0.3)',
    elevation: 4,
  },
  accent: {
    backgroundColor: colors.accent,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    backgroundColor: colors.shimmer,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    ...typography.appName,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  text: {
    ...typography.body,
  },
  textSecondary: {
    ...typography.caption,
  },
  section: {
    width: '100%',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.4)',
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardElevated: {
    backgroundColor: colors.cardElevated,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.5)',
    elevation: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
});
