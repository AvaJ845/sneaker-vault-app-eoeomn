
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors, typography } from '@/styles/commonStyles';
import { Post } from '@/types/post';
import { FireAnimation } from './FireAnimation';
import { FlameIcon, CommentIcon, VaultIcon } from './CustomIcons';

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
const CARD_HEIGHT = width + 200;

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
      if (!isLiked) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsLiked(true);
        setLikesCount(likesCount + 1);
        setShowFireAnimation(true);
        onLike(post.id);

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

    const cardOffset = index * (CARD_HEIGHT + 24);
    const inputRange = [
      cardOffset - CARD_HEIGHT,
      cardOffset,
      cardOffset + CARD_HEIGHT,
    ];

    // Subtle tilt effect based on scroll position
    const rotateX = interpolate(
      scrollY.value,
      inputRange,
      [3, 0, -3],
      Extrapolate.CLAMP
    );

    const rotateY = interpolate(
      scrollY.value,
      inputRange,
      [-1.5, 0, 1.5],
      Extrapolate.CLAMP
    );

    // Slight scale effect for depth
    const scaleValue = interpolate(
      scrollY.value,
      inputRange,
      [0.97, 1, 0.97],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { perspective: 1200 },
        { rotateX: `${rotateX}deg` },
        { rotateY: `${rotateY}deg` },
        { scale: scale.value * scaleValue },
      ],
    };
  });

  // Enhanced layered shadow animation
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

    const shadowOpacity = interpolate(
      scrollY.value,
      inputRange,
      [0.4, 0.7, 0.4],
      Extrapolate.CLAMP
    );

    return {
      shadowOpacity,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      {/* Enhanced multiple shadow layers for 3D depth */}
      <Animated.View style={[styles.shadowLayer1, shadowStyle]} />
      <Animated.View style={[styles.shadowLayer2, shadowStyle]} />
      <Animated.View style={[styles.shadowLayer3, shadowStyle]} />
      <Animated.View style={[styles.shadowLayer4, shadowStyle]} />

      {/* Shoebox Lid with enhanced details */}
      <View style={styles.shoeboxLid}>
        <View style={styles.lidStripe} />
        <View style={styles.lidStripePurple} />
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
            <Text style={styles.moreIcon}>⋯</Text>
          </TouchableOpacity>
        </View>

        {/* Image with double-tap */}
        <TouchableOpacity activeOpacity={1} onPress={handleDoubleTap}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: post.mediaUrl }} style={styles.image} resizeMode="cover" />
            {showFireAnimation && <FireAnimation onComplete={handleFireAnimationComplete} />}
          </View>
        </TouchableOpacity>

        {/* Actions with custom icons */}
        <View style={styles.actions}>
          <View style={styles.leftActions}>
            <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
              <FlameIcon 
                size={28} 
                color={isLiked ? colors.fireOrange : colors.text}
                strokeWidth={isLiked ? 2.5 : 2}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onComment(post.id)} style={styles.actionButton}>
              <CommentIcon size={28} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onShare(post.id)} style={styles.actionButton}>
              <Text style={styles.shareIcon}>↗</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <VaultIcon size={28} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Info with updated typography */}
        <View style={styles.info}>
          <View style={styles.likesRow}>
            <FlameIcon size={16} color={colors.fireOrange} />
            <Text style={styles.likes}>{likesCount.toLocaleString()} fires</Text>
          </View>
          <View style={styles.captionContainer}>
            <Text style={styles.caption}>
              <Text style={styles.captionUsername}>{post.username}</Text> {post.caption}
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
  // Enhanced layered shadow system for 3D depth (8-10px lift)
  shadowLayer1: {
    position: 'absolute',
    top: 16,
    left: 6,
    right: 6,
    bottom: -16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 14,
    zIndex: -4,
    boxShadow: '0px 20px 60px rgba(0, 0, 0, 0.6)',
  },
  shadowLayer2: {
    position: 'absolute',
    top: 12,
    left: 4,
    right: 4,
    bottom: -12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 13,
    zIndex: -3,
    boxShadow: '0px 15px 45px rgba(0, 0, 0, 0.5)',
  },
  shadowLayer3: {
    position: 'absolute',
    top: 8,
    left: 2,
    right: 2,
    bottom: -8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
    zIndex: -2,
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.4)',
  },
  shadowLayer4: {
    position: 'absolute',
    top: 4,
    left: 1,
    right: 1,
    bottom: -4,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 11,
    zIndex: -1,
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)',
  },
  shoeboxLid: {
    backgroundColor: colors.shoeboxLid,
    height: 14,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
    position: 'relative',
    boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.5)',
    elevation: 4,
  },
  lidStripe: {
    position: 'absolute',
    top: 5,
    left: '10%',
    right: '10%',
    height: 2.5,
    backgroundColor: colors.primary,
    borderRadius: 1.25,
    boxShadow: '0px 1px 4px rgba(255, 107, 53, 0.6)',
  },
  lidStripePurple: {
    position: 'absolute',
    top: 9,
    left: '15%',
    right: '15%',
    height: 1.5,
    backgroundColor: colors.secondary,
    borderRadius: 0.75,
    opacity: 0.7,
  },
  lidDetail1: {
    position: 'absolute',
    top: 3,
    left: '5%',
    width: 24,
    height: 1.5,
    backgroundColor: colors.accent,
    opacity: 0.5,
  },
  lidDetail2: {
    position: 'absolute',
    top: 3,
    right: '5%',
    width: 24,
    height: 1.5,
    backgroundColor: colors.accent,
    opacity: 0.5,
  },
  shoeboxBase: {
    backgroundColor: colors.shoeboxBase,
    borderRadius: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.8)',
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(28, 28, 30, 0.98)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
    borderWidth: 2.5,
    borderColor: colors.secondary,
    boxShadow: '0px 3px 10px rgba(157, 78, 221, 0.5)',
  },
  username: {
    ...typography.username,
  },
  sneakerInfo: {
    ...typography.shoeName,
    marginTop: 2,
  },
  moreIcon: {
    fontSize: 24,
    color: colors.text,
    fontWeight: '700',
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
    paddingVertical: 12,
    backgroundColor: 'rgba(28, 28, 30, 0.98)',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginRight: 18,
  },
  shareIcon: {
    fontSize: 26,
    color: colors.text,
    fontWeight: '700',
  },
  info: {
    paddingHorizontal: 12,
    paddingBottom: 16,
    backgroundColor: 'rgba(28, 28, 30, 0.98)',
  },
  likesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  likes: {
    ...typography.body,
    fontWeight: '700',
    marginLeft: 6,
  },
  captionContainer: {
    marginBottom: 8,
  },
  caption: {
    ...typography.body,
    lineHeight: 20,
  },
  captionUsername: {
    ...typography.username,
    fontSize: 14,
  },
  viewComments: {
    ...typography.caption,
    marginBottom: 6,
  },
  timestamp: {
    ...typography.caption,
    fontSize: 11,
  },
});
