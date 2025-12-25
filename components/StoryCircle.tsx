
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
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
      <View style={[styles.avatarContainer, hasUnviewed && styles.avatarContainerUnviewed]}>
        <Image source={{ uri: userAvatar }} style={styles.avatar} />
        {isCurrentUser && (
          <View style={styles.addButton}>
            <IconSymbol ios_icon_name="plus" android_material_icon_name="add" size={16} color={colors.text} />
          </View>
        )}
      </View>
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
  avatarContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 3,
    backgroundColor: colors.border,
    marginBottom: 4,
  },
  avatarContainerUnviewed: {
    background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
    borderWidth: 0,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    borderColor: colors.card,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  username: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});
