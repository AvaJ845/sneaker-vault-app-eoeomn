
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { Reel } from '@/types/reel';

interface ReelCardProps {
  reel: Reel;
  isActive: boolean;
  onLike: (reelId: string) => void;
  onComment: (reelId: string) => void;
  onShare: (reelId: string) => void;
  onUserPress: (userId: string) => void;
}

const { width, height } = Dimensions.get('window');

export function ReelCard({ reel, isActive, onLike, onComment, onShare, onUserPress }: ReelCardProps) {
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likesCount, setLikesCount] = useState(reel.likes);

  // Animation values
  const fadeAnim = useSharedValue(0);
  const rotateAnim = useSharedValue(0);
  const spotlightAnim = useSharedValue(0);
  const glowAnim = useSharedValue(0);
  const floatAnim = useSharedValue(0);
  const loadingDot1 = useSharedValue(0);
  const loadingDot2 = useSharedValue(0);
  const loadingDot3 = useSharedValue(0);

  useEffect(() => {
    if (isActive) {
      // Fade in animation
      fadeAnim.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) });

      // Continuous rotation (360° showcase)
      rotateAnim.value = withRepeat(
        withTiming(360, { duration: 8000, easing: Easing.linear }),
        -1,
        false
      );

      // Pulsing spotlight glow
      spotlightAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.6, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      // Purple accent glow
      glowAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.5, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      // Floating effect
      floatAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      // Loading dots animation
      loadingDot1.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0.3, { duration: 600 })
        ),
        -1,
        true
      );

      setTimeout(() => {
        loadingDot2.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 600 }),
            withTiming(0.3, { duration: 600 })
          ),
          -1,
          true
        );
      }, 200);

      setTimeout(() => {
        loadingDot3.value = withRepeat(
          withSequence(
            withTiming(1, { duration: 600 }),
            withTiming(0.3, { duration: 600 })
          ),
          -1,
          true
        );
      }, 400);
    } else {
      fadeAnim.value = 0;
      rotateAnim.value = 0;
      spotlightAnim.value = 0;
      glowAnim.value = 0;
      floatAnim.value = 0;
      loadingDot1.value = 0.3;
      loadingDot2.value = 0.3;
      loadingDot3.value = 0.3;
    }
  }, [isActive]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike(reel.id);
  };

  const containerAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: fadeAnim.value,
    };
  });

  const sneakerAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(floatAnim.value, [0, 1], [0, -20]);
    return {
      transform: [
        { rotateY: `${rotateAnim.value}deg` },
        { translateY },
      ],
    };
  });

  const spotlightAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(spotlightAnim.value, [0, 1], [0.3, 0.8]);
    return {
      opacity,
    };
  });

  const glowAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(glowAnim.value, [0, 1], [0.4, 0.9]);
    return {
      opacity,
    };
  });

  const dot1Style = useAnimatedStyle(() => ({
    opacity: loadingDot1.value,
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: loadingDot2.value,
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: loadingDot3.value,
  }));

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <View style={styles.container}>
      {/* Background gradient */}
      <LinearGradient
        colors={['#0A0A0A', '#1A0A1A', '#0A0A0A']}
        style={StyleSheet.absoluteFillObject}
      />

      <Animated.View style={[styles.content, containerAnimatedStyle]}>
        {/* Spotlight from above */}
        <Animated.View style={[styles.spotlight, spotlightAnimatedStyle]}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.3)', 'transparent']}
            style={styles.spotlightGradient}
          />
        </Animated.View>

        {/* Purple accent glow */}
        <Animated.View style={[styles.purpleGlow, glowAnimatedStyle]}>
          <LinearGradient
            colors={['transparent', 'rgba(138, 43, 226, 0.4)', 'transparent']}
            style={styles.purpleGlowGradient}
          />
        </Animated.View>

        {/* Pedestal platform */}
        <View style={styles.pedestalContainer}>
          <View style={styles.pedestal}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
              style={styles.pedestalGradient}
            />
          </View>
        </View>

        {/* Sneaker showcase */}
        <View style={styles.sneakerContainer}>
          <Animated.View style={[styles.sneakerWrapper, sneakerAnimatedStyle]}>
            <Image
              source={{ uri: reel.sneakerImageUrl }}
              style={styles.sneakerImage}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Loading dots at bottom */}
        <View style={styles.loadingDotsContainer}>
          <Animated.View style={[styles.loadingDot, dot1Style]} />
          <Animated.View style={[styles.loadingDot, dot2Style]} />
          <Animated.View style={[styles.loadingDot, dot3Style]} />
        </View>

        {/* User info overlay */}
        <View style={styles.overlay}>
          <View style={styles.topInfo}>
            <TouchableOpacity style={styles.userInfo} onPress={() => onUserPress(reel.userId)}>
              <Image source={{ uri: reel.userAvatar }} style={styles.avatar} />
              <View style={styles.userTextContainer}>
                <Text style={styles.username}>{reel.username}</Text>
                {reel.musicName && (
                  <View style={styles.musicInfo}>
                    <IconSymbol ios_icon_name="music.note" android_material_icon_name="music-note" size={12} color={colors.text} />
                    <Text style={styles.musicText} numberOfLines={1}>
                      {reel.musicName} • {reel.musicArtist}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          {/* Sneaker info */}
          <View style={styles.sneakerInfo}>
            <Text style={styles.sneakerBrand}>{reel.sneakerBrand}</Text>
            <Text style={styles.sneakerModel}>{reel.sneakerModel}</Text>
            <Text style={styles.sneakerColorway}>{reel.sneakerColorway}</Text>
            <Text style={styles.caption}>{reel.caption}</Text>
          </View>

          {/* Action buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <IconSymbol
                ios_icon_name={isLiked ? 'heart.fill' : 'heart'}
                android_material_icon_name={isLiked ? 'favorite' : 'favorite-border'}
                size={32}
                color={isLiked ? '#FF6B35' : colors.text}
              />
              <Text style={styles.actionText}>{formatCount(likesCount)}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => onComment(reel.id)}>
              <IconSymbol ios_icon_name="bubble.left.fill" android_material_icon_name="chat-bubble" size={32} color={colors.text} />
              <Text style={styles.actionText}>{formatCount(reel.comments)}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => onShare(reel.id)}>
              <IconSymbol ios_icon_name="paperplane.fill" android_material_icon_name="send" size={32} color={colors.text} />
              <Text style={styles.actionText}>{formatCount(reel.shares)}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <IconSymbol ios_icon_name="ellipsis" android_material_icon_name="more-vert" size={32} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spotlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
    zIndex: 1,
  },
  spotlightGradient: {
    flex: 1,
  },
  purpleGlow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '30%',
    height: height * 0.4,
    zIndex: 0,
  },
  purpleGlowGradient: {
    flex: 1,
  },
  pedestalContainer: {
    position: 'absolute',
    bottom: height * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pedestal: {
    width: 200,
    height: 20,
    borderRadius: 100,
    overflow: 'hidden',
    boxShadow: '0px 10px 30px rgba(138, 43, 226, 0.3)',
    elevation: 10,
  },
  pedestalGradient: {
    flex: 1,
  },
  sneakerContainer: {
    position: 'absolute',
    top: '25%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  sneakerWrapper: {
    width: width * 0.8,
    height: width * 0.8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sneakerImage: {
    width: '100%',
    height: '100%',
    boxShadow: '0px 20px 60px rgba(138, 43, 226, 0.5)',
    elevation: 20,
  },
  loadingDotsContainer: {
    position: 'absolute',
    bottom: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: Platform.OS === 'android' ? 60 : 50,
    paddingBottom: 120,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  topInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 12,
  },
  userTextContainer: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  musicInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  musicText: {
    fontSize: 12,
    color: colors.text,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  sneakerInfo: {
    marginBottom: 20,
  },
  sneakerBrand: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  sneakerModel: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  sneakerColorway: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  caption: {
    fontSize: 14,
    color: colors.text,
    marginTop: 12,
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  actions: {
    alignItems: 'flex-end',
    gap: 20,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
