
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { Post } from '@/types/post';

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onUserPress: (userId: string) => void;
}

const { width } = Dimensions.get('window');

export function PostCard({ post, onLike, onComment, onShare, onUserPress }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike(post.id);
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

  return (
    <View style={styles.container}>
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

      <Image source={{ uri: post.mediaUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <IconSymbol
              ios_icon_name={isLiked ? 'heart.fill' : 'heart'}
              android_material_icon_name={isLiked ? 'favorite' : 'favorite-border'}
              size={28}
              color={isLiked ? colors.primary : colors.text}
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

      <View style={styles.info}>
        <Text style={styles.likes}>{likesCount.toLocaleString()} likes</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    borderColor: colors.border,
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
  image: {
    width: width,
    height: width,
    backgroundColor: colors.backgroundSecondary,
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
  likes: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
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
