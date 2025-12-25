
import React, { useState, useRef, useCallback } from 'react';
import { View, StyleSheet, FlatList, ViewToken, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { ReelCard } from '@/components/ReelCard';
import { mockReels } from '@/data/mockReels';
import { Reel } from '@/types/reel';

export default function SoleStoriesScreen() {
  const [reels, setReels] = useState<Reel[]>(mockReels);
  const [activeReelId, setActiveReelId] = useState<string>(mockReels[0]?.id || '');
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].item) {
      setActiveReelId(viewableItems[0].item.id);
    }
  }, []);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const handleLike = (reelId: string) => {
    console.log('Liked Sole Story:', reelId);
    setReels(prevReels =>
      prevReels.map(reel =>
        reel.id === reelId
          ? { ...reel, isLiked: !reel.isLiked, likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1 }
          : reel
      )
    );
  };

  const handleComment = (reelId: string) => {
    console.log('Comment on Sole Story:', reelId);
    Alert.alert('Comments', 'Comments feature coming soon!');
  };

  const handleShare = (reelId: string) => {
    console.log('Share Sole Story:', reelId);
    Alert.alert('Share', 'Share feature coming soon!');
  };

  const handleUserPress = (userId: string) => {
    console.log('View user profile:', userId);
    Alert.alert('Profile', 'User profile feature coming soon!');
  };

  const renderReel = ({ item }: { item: Reel }) => (
    <ReelCard
      reel={item}
      isActive={item.id === activeReelId}
      onLike={handleLike}
      onComment={handleComment}
      onShare={handleShare}
      onUserPress={handleUserPress}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={reels}
          renderItem={renderReel}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={Platform.select({ ios: undefined, android: undefined })}
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          removeClippedSubviews={true}
          maxToRenderPerBatch={2}
          windowSize={3}
          initialNumToRender={1}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
