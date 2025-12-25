
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/commonStyles';

interface StoryCircleProps {
  username: string;
  userAvatar: string;
  hasUnviewed: boolean;
  onPress: () => void;
  isCurrentUser?: boolean;
}

export function StoryCircle({ username, userAvatar, hasUnviewed, onPress, isCurrentUser = false }: StoryCircleProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatarContainer}>
        {hasUnviewed ? (
          <LinearGradient
            colors={['#F58529', '#DD2A7B', '#8134AF', '#515BD4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.avatarInner}>
              <Image source={{ uri: userAvatar }} style={styles.avatar} />
            </View>
          </LinearGradient>
        ) : (
          <View style={[styles.gradient, styles.viewedGradient]}>
            <View style={styles.avatarInner}>
              <Image source={{ uri: userAvatar }} style={styles.avatar} />
            </View>
          </View>
        )}
        {isCurrentUser && (
          <View style={styles.addBadge}>
            <Text style={styles.addBadgeText}>+</Text>
          </View>
        )}
      </View>
      <Text style={styles.username} numberOfLines={1}>
        {isCurrentUser ? 'Your Story' : username}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 12,
    width: 80,
  },
  avatarContainer: {
    position: 'relative',
  },
  gradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewedGradient: {
    backgroundColor: colors.border,
  },
  avatarInner: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: colors.card,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  addBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  addBadgeText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    marginTop: 4,
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
});
