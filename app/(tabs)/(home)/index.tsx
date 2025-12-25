
import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, ScrollView, Platform, Alert, Text, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { colors } from '@/styles/commonStyles';
import { StoryCircle } from '@/components/StoryCircle';
import { ShoeboxCard } from '@/components/ShoeboxCard';
import { mockPosts, mockStories } from '@/data/mockPosts';
import { Post } from '@/types/post';
import { StoryGroup } from '@/types/story';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [stories, setStories] = useState<StoryGroup[]>(mockStories);
  const [refreshing, setRefreshing] = useState(false);

  const scrollY = useSharedValue(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      console.log('Feed refreshed');
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleLike = (postId: string) => {
    console.log('Liked post:', postId);
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
    Alert.alert('Comments', 'Comments feature coming soon!');
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
    Alert.alert('Share', 'Share feature coming soon!');
  };

  const handleUserPress = (userId: string) => {
    console.log('View user profile:', userId);
    Alert.alert('Profile', 'User profile feature coming soon!');
  };

  const handleStoryPress = (userId: string) => {
    console.log('View story:', userId);
    Alert.alert('Story', 'Story viewer coming soon!');
  };

  const handleAddStory = () => {
    console.log('Add story');
    Alert.alert('Add Story', 'Story creation feature coming soon!');
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.logo}>Sneaker Vault</Text>
      <Text style={styles.tagline}>Track. Showcase. Connect.</Text>
    </View>
  );

  const renderStories = () => (
    <View style={styles.storiesContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
        <StoryCircle
          username="Your Story"
          userAvatar="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop"
          hasUnviewed={false}
          onPress={handleAddStory}
          isCurrentUser={true}
        />
        {stories.map((storyGroup) => (
          <StoryCircle
            key={storyGroup.userId}
            username={storyGroup.username}
            userAvatar={storyGroup.userAvatar}
            hasUnviewed={storyGroup.hasUnviewed}
            onPress={() => handleStoryPress(storyGroup.userId)}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {renderHeader()}
        <AnimatedFlatList
          data={posts}
          renderItem={({ item }) => (
            <ShoeboxCard
              post={item}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onUserPress={handleUserPress}
            />
          )}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderStories}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            Platform.OS !== 'ios' && styles.listContentWithTabBar,
          ]}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary, colors.secondary]}
            />
          }
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
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  storiesContainer: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 12,
  },
  storiesScroll: {
    paddingHorizontal: 12,
  },
  listContent: {
    paddingBottom: 20,
    paddingTop: 12,
  },
  listContentWithTabBar: {
    paddingBottom: 100,
  },
});
