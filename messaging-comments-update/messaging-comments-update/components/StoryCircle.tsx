
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

interface StoryCircleProps {
  username: string;
  userAvatar: string;
  hasUnviewed: boolean;
  onPress: () => void;
  isCurrentUser?: boolean;
}

export function StoryCircle({ username, userAvatar, hasUnviewed, onPress, isCurrentUser }: StoryCircleProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {hasUnviewed ? (
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBorder}
        >
          <View style={styles.innerBorder}>
            <Image source={{ uri: userAvatar }} style={styles.avatar} />
          </View>
        </LinearGradient>
      ) : (
        <View style={styles.avatarContainer}>
          <Image source={{ uri: userAvatar }} style={styles.avatar} />
        </View>
      )}
      {isCurrentUser && (
        <View style={styles.addButton}>
          <IconSymbol ios_icon_name="plus" android_material_icon_name="add" size={16} color={colors.background} />
        </View>
      )}
      <Text style={styles.username} numberOfLines={1}>
        {username}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 12,
    width: 72,
  },
  gradientBorder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 3,
    marginBottom: 4,
  },
  innerBorder: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
    padding: 3,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 3,
    backgroundColor: colors.border,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  username: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});
