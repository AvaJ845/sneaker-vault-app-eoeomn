
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '@/styles/commonStyles';

interface FireAnimationProps {
  onComplete?: () => void;
}

export function FireAnimation({ onComplete }: FireAnimationProps) {
  const flame1Scale = useSharedValue(0);
  const flame1Opacity = useSharedValue(0);
  const flame1TranslateY = useSharedValue(0);

  const flame2Scale = useSharedValue(0);
  const flame2Opacity = useSharedValue(0);
  const flame2TranslateY = useSharedValue(0);

  const flame3Scale = useSharedValue(0);
  const flame3Opacity = useSharedValue(0);
  const flame3TranslateY = useSharedValue(0);

  useEffect(() => {
    // Flame 1 animation (center, orange)
    flame1Scale.value = withSequence(
      withTiming(1.2, { duration: 150, easing: Easing.out(Easing.ease) }),
      withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) })
    );
    flame1Opacity.value = withSequence(
      withTiming(1, { duration: 100 }),
      withDelay(150, withTiming(0, { duration: 300 }))
    );
    flame1TranslateY.value = withSequence(
      withTiming(-20, { duration: 150 }),
      withTiming(-60, { duration: 300 })
    );

    // Flame 2 animation (left, red)
    flame2Scale.value = withDelay(
      50,
      withSequence(
        withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) })
      )
    );
    flame2Opacity.value = withDelay(
      50,
      withSequence(
        withTiming(1, { duration: 100 }),
        withDelay(150, withTiming(0, { duration: 300 }))
      )
    );
    flame2TranslateY.value = withDelay(
      50,
      withSequence(
        withTiming(-15, { duration: 150 }),
        withTiming(-50, { duration: 300 })
      )
    );

    // Flame 3 animation (right, yellow)
    flame3Scale.value = withDelay(
      100,
      withSequence(
        withTiming(0.9, { duration: 150, easing: Easing.out(Easing.ease) }),
        withTiming(0, { duration: 300, easing: Easing.in(Easing.ease) }, (finished) => {
          if (finished && onComplete) {
            runOnJS(onComplete)();
          }
        })
      )
    );
    flame3Opacity.value = withDelay(
      100,
      withSequence(
        withTiming(1, { duration: 100 }),
        withDelay(150, withTiming(0, { duration: 300 }))
      )
    );
    flame3TranslateY.value = withDelay(
      100,
      withSequence(
        withTiming(-18, { duration: 150 }),
        withTiming(-55, { duration: 300 })
      )
    );
  }, []);

  const flame1Style = useAnimatedStyle(() => ({
    transform: [
      { scale: flame1Scale.value },
      { translateY: flame1TranslateY.value },
    ],
    opacity: flame1Opacity.value,
  }));

  const flame2Style = useAnimatedStyle(() => ({
    transform: [
      { scale: flame2Scale.value },
      { translateY: flame2TranslateY.value },
      { translateX: -15 },
    ],
    opacity: flame2Opacity.value,
  }));

  const flame3Style = useAnimatedStyle(() => ({
    transform: [
      { scale: flame3Scale.value },
      { translateY: flame3TranslateY.value },
      { translateX: 15 },
    ],
    opacity: flame3Opacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.flame, styles.flame1, flame1Style]} />
      <Animated.View style={[styles.flame, styles.flame2, flame2Style]} />
      <Animated.View style={[styles.flame, styles.flame3, flame3Style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  flame: {
    position: 'absolute',
    width: 60,
    height: 80,
    borderRadius: 30,
  },
  flame1: {
    backgroundColor: colors.fireOrange,
    boxShadow: '0px 0px 30px rgba(255, 107, 53, 0.8)',
  },
  flame2: {
    backgroundColor: colors.fireRed,
    boxShadow: '0px 0px 25px rgba(255, 61, 0, 0.7)',
    width: 50,
    height: 70,
  },
  flame3: {
    backgroundColor: colors.fireYellow,
    boxShadow: '0px 0px 25px rgba(255, 214, 0, 0.7)',
    width: 50,
    height: 70,
  },
});
