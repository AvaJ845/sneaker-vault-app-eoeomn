
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { colors } from '@/styles/commonStyles';

interface PullToRefreshShoeboxProps {
  progress: Animated.SharedValue<number>;
}

export function PullToRefreshShoebox({ progress }: PullToRefreshShoeboxProps) {
  const lidStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      progress.value,
      [0, 1],
      [0, -25],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      progress.value,
      [0, 1],
      [0, -10],
      Extrapolate.CLAMP
    );

    return {
      transform: [
        { translateY },
        { rotateX: `${rotation}deg` },
      ],
    };
  });

  const baseStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      progress.value,
      [0, 0.5, 1],
      [0.3, 0.7, 1],
      Extrapolate.CLAMP
    );

    return {
      opacity,
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.lid, lidStyle]}>
        <View style={styles.lidStripe} />
      </Animated.View>
      <Animated.View style={[styles.base, baseStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lid: {
    width: 60,
    height: 8,
    backgroundColor: colors.shoeboxLid,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  lidStripe: {
    position: 'absolute',
    top: 2,
    left: 6,
    right: 6,
    height: 2,
    backgroundColor: colors.primary,
    borderRadius: 1,
  },
  base: {
    width: 60,
    height: 32,
    backgroundColor: colors.shoeboxBase,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'absolute',
    bottom: 0,
  },
});
