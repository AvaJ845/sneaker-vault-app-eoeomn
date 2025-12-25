
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
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
  scrollY?: Animated.SharedValue<number>;
  index?: number;
}

const { width } = Dimensions.get('window');
const CARD_HEIGHT = width + 200; // Approximate card height

export function ShoeboxCard({ 
  post, 
  onLike, 
  onComment, 
  onShare, 
  onUserPress,
  scrollY,
  index = 0,
}: ShoeboxCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showFireAnimation, setShowFireAnimation] = useState(false);
  const [lastTap, setLastTap] = useState(0);

  const scale = useSharedValue(1);

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

  // 3D depth and tilt animation based on scroll position
  const animatedStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return {
        transform: [{ scale: scale.value }],
      };
    }

    // Calculate card position in viewport
    const cardOffset = index * (CARD_HEIGHT + 24); // 24 is marginBottom
    const inputRange = [
      cardOffset - CARD_HEIGHT,
      cardOffset,
      cardOffset + CARD_HEIGHT,
    ];

    // Subtle tilt effect based on scroll position
    const rotateX = interpolate(
      scrollY.value,
      inputRange,
      [2, 0, -2],
      Extrapolate.CLAMP
    );

    const rotateY = interpolate(
      scrollY.value,
      inputRange,
      [-1, 0, 1],
      Extrapolate.CLAMP
    );

    // Slight scale effect for depth
    const scaleValue = interpolate(
      scrollY.value,
      inputRange,
      [0.98, 1, 0.98],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { perspective: 1000 },
        { rotateX: `${rotateX}deg` },
        { rotateY: `${rotateY}deg` },
        { scale: scale.value * scaleValue },
      ],
    };
  });

  // Layered shadow animation
  const shadowStyle = useAnimatedStyle(() => {
    if (!scrollY) {
      return {};
    }

    const cardOffset = index * (CARD_HEIGHT + 24);
    const inputRange = [
      cardOffset - CARD_HEIGHT / 2,
      cardOffset,
      cardOffset + CARD_HEIGHT / 2,
    ];

    // Shadow intensity increases when card is centered
    const shadowOpacity = interpolate(
      scrollY.value,
      inputRange,
      [0.3, 0.6, 0.3],
      Extrapolate.CLAMP
    );

    return {
      shadowOpacity,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Multiple shadow layers for depth */}
      <Animated.View style={[styles.shadowLayer1, shadowStyle]} />
      <Animated.View style={[styles.shadowLayer2, shadowStyle]} />
      <Animated.View style={[styles.shadowLayer3, shadowStyle]} />

      {/* Shoebox Lid */}
      <View style={styles.shoeboxLid}>
        <View style={styles.lidStripe} />
        <View style={styles.lidDetail1} />
        <View style={styles.lidDetail2} />
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
    position: 'relative',
  },
  // Layered shadow system for 3D depth
  shadowLayer1: {
    position: 'absolute',
    top: 12,
    left: 4,
    right: 4,
    bottom: -12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 14,
    zIndex: -3,
  },
  shadowLayer2: {
    position: 'absolute',
    top: 8,
    left: 2,
    right: 2,
    bottom: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 13,
    zIndex: -2,
  },
  shadowLayer3: {
    position: 'absolute',
    top: 4,
    left: 1,
    right: 1,
    bottom: -4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    zIndex: -1,
  },
  shoeboxLid: {
    backgroundColor: colors.shoeboxLid,
    height: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
    position: 'relative',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.4)',
    elevation: 3,
  },
  lidStripe: {
    position: 'absolute',
    top: 4,
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  lidDetail1: {
    position: 'absolute',
    top: 2,
    left: '5%',
    width: 20,
    height: 1,
    backgroundColor: colors.secondary,
    opacity: 0.6,
  },
  lidDetail2: {
    position: 'absolute',
    top: 2,
    right: '5%',
    width: 20,
    height: 1,
    backgroundColor: colors.secondary,
    opacity: 0.6,
  },
  shoeboxBase: {
    backgroundColor: colors.shoeboxBase,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.7)',
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
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
    boxShadow: '0px 2px 8px rgba(157, 78, 221, 0.4)',
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
    paddingVertical: 10,
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
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
    paddingBottom: 14,
    backgroundColor: 'rgba(28, 28, 30, 0.95)',
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  likes: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 6,
  },
  captionContainer: {
    marginBottom: 6,
  },
  caption: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 18,
  },
  viewComments: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
