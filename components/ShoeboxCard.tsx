
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { Post } from '@/types/post';
import { FireAnimation } from './FireAnimation';

interface ShoeboxCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onUserPress: (userId: string) => void;
}

const { width } = Dimensions.get('window');

export function ShoeboxCard({ post, onLike, onComment, onShare, onUserPress }: ShoeboxCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showFireAnimation, setShowFireAnimation] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  const scale = useSharedValue(1);
  const elevation = useSharedValue(4);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (!isLiked) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsLiked(true);
        setLikesCount(likesCount + 1);
        setShowFireAnimation(true);
        onLike(post.id);

        // Animate card
        scale.value = withSpring(0.95, { damping: 10 });
        setTimeout(() => {
          scale.value = withSpring(1);
        }, 100);
      }
    }
    setLastTap(now);
  };

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    if (!isLiked) {
      setShowFireAnimation(true);
    }
    onLike(post.id);
  };

  const handleFireAnimationComplete = () => {
    setShowFireAnimation(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const diffMs = now.getTime() - postDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return postDate.toLocaleDateString();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Shoebox Lid */}
      <View style={styles.shoeboxLid}>
        <View style={styles.lidStripe} />
      </View>

      {/* Shoebox Base */}
      <View style={styles.shoeboxBase}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.userInfo} onPress={() => onUserPress(post.userId)}>
            <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
            <View>
              <Text style={styles.username}>{post.username}</Text>
              {post.sneakerBrand && post.sneakerModel && (
                <Text style={styles.sneakerInfo}>
                  {post.sneakerBrand} {post.sneakerModel}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <IconSymbol ios_icon_name="ellipsis" android_material_icon_name="more-vert" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Image with double-tap */}
        <TouchableOpacity activeOpacity={1} onPress={handleDoubleTap}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: post.mediaUrl }} style={styles.image} resizeMode="cover" />
            {showFireAnimation && <FireAnimation onComplete={handleFireAnimationComplete} />}
          </View>
        </TouchableOpacity>

        {/* Actions */}
        <View style={styles.actions}>
          <View style={styles.leftActions}>
            <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
              <IconSymbol
                ios_icon_name={isLiked ? 'flame.fill' : 'flame'}
                android_material_icon_name={isLiked ? 'local-fire-department' : 'local-fire-department'}
                size={28}
                color={isLiked ? colors.fireOrange : colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onComment(post.id)} style={styles.actionButton}>
              <IconSymbol ios_icon_name="bubble.left" android_material_icon_name="chat-bubble-outline" size={28} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onShare(post.id)} style={styles.actionButton}>
              <IconSymbol ios_icon_name="paperplane" android_material_icon_name="send" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <IconSymbol ios_icon_name="bookmark" android_material_icon_name="bookmark-border" size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <View style={styles.likesRow}>
            <IconSymbol ios_icon_name="flame.fill" android_material_icon_name="local-fire-department" size={16} color={colors.fireOrange} />
            <Text style={styles.likes}>{likesCount.toLocaleString()} fires</Text>
          </View>
          <View style={styles.captionContainer}>
            <Text style={styles.caption}>
              <Text style={styles.username}>{post.username}</Text> {post.caption}
            </Text>
          </View>
          {post.comments > 0 && (
            <TouchableOpacity onPress={() => onComment(post.id)}>
              <Text style={styles.viewComments}>View all {post.comments} comments</Text>
            </TouchableOpacity>
          )}
          <Text style={styles.timestamp}>{formatTimestamp(post.timestamp)}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    marginHorizontal: 12,
  },
  shoeboxLid: {
    backgroundColor: colors.shoeboxLid,
    height: 8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
    position: 'relative',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.3)',
  },
  lidStripe: {
    position: 'absolute',
    top: 2,
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  shoeboxBase: {
    backgroundColor: colors.shoeboxBase,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.6)',
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  username: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  sneakerInfo: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  imageContainer: {
    width: '100%',
    height: width - 24,
    backgroundColor: colors.concrete,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 16,
  },
  info: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  likes: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 6,
  },
  captionContainer: {
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 18,
  },
  viewComments: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
