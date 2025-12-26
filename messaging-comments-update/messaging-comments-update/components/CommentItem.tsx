import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors } from '@/styles/commonStyles';
import { Comment } from '@/types/comment';
import * as Haptics from 'expo-haptics';

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  onReply: (commentId: string, username: string) => void;
  onDelete?: (commentId: string) => void;
  onReport?: (commentId: string) => void;
  currentUserId?: string;
  level?: number; // Nesting level for indentation
  isOP?: boolean; // Is this the original poster?
}

export function CommentItem({
  comment,
  onLike,
  onReply,
  onDelete,
  onReport,
  currentUserId,
  level = 0,
  isOP = false,
}: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(comment.is_liked_by_user || false);
  const [likesCount, setLikesCount] = useState(comment.likes_count);
  const [showReplies, setShowReplies] = useState(false);

  const isOwnComment = currentUserId === comment.user_id;
  const maxLevel = 3; // Max nesting depth
  const indentation = Math.min(level, maxLevel) * 20;

  const handleLike = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    onLike(comment.id);
  };

  const handleReply = () => {
    onReply(comment.id, comment.user?.username || 'User');
  };

  const handleOptions = () => {
    const options = ['Cancel'];
    if (isOwnComment && onDelete) {
      options.unshift('Delete');
    }
    if (!isOwnComment && onReport) {
      options.unshift('Report');
    }

    Alert.alert(
      'Comment Options',
      'What would you like to do?',
      options.map(option => ({
        text: option,
        style: option === 'Cancel' ? 'cancel' : option === 'Delete' ? 'destructive' : 'default',
        onPress: () => {
          if (option === 'Delete' && onDelete) {
            Alert.alert(
              'Delete Comment',
              'Are you sure you want to delete this comment?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => onDelete(comment.id) },
              ]
            );
          } else if (option === 'Report' && onReport) {
            onReport(comment.id);
          }
        },
      }))
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffMs = now.getTime() - commentDate.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return commentDate.toLocaleDateString();
  };

  return (
    <View style={[styles.container, { marginLeft: indentation }]}>
      <View style={styles.content}>
        {/* Avatar */}
        <TouchableOpacity>
          {comment.user?.avatar_url ? (
            <Image source={{ uri: comment.user.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Comment Content */}
        <View style={styles.commentContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity>
              <Text style={styles.username}>
                {comment.user?.username || 'Anonymous'}
                {comment.user?.is_verified && (
                  <IconSymbol
                    ios_icon_name="checkmark.seal.fill"
                    android_material_icon_name="verified"
                    size={12}
                    color={colors.secondary}
                  />
                )}
                {isOP && <Text style={styles.opBadge}> OP</Text>}
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.timestamp}>
              {formatTimestamp(comment.created_at)}
              {comment.is_edited && ' (edited)'}
            </Text>

            <TouchableOpacity onPress={handleOptions} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <IconSymbol
                ios_icon_name="ellipsis"
                android_material_icon_name="more-vert"
                size={16}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Comment Text */}
          <Text style={styles.text}>{comment.content}</Text>

          {/* Comment Image */}
          {comment.media_url && (
            <Image source={{ uri: comment.media_url }} style={styles.commentImage} />
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <IconSymbol
                ios_icon_name={isLiked ? 'heart.fill' : 'heart'}
                android_material_icon_name={isLiked ? 'favorite' : 'favorite-border'}
                size={16}
                color={isLiked ? colors.error : colors.textSecondary}
              />
              {likesCount > 0 && <Text style={styles.actionText}>{likesCount}</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleReply}>
              <IconSymbol
                ios_icon_name="bubble.left"
                android_material_icon_name="chat-bubble-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.actionText}>Reply</Text>
            </TouchableOpacity>

            {comment.replies_count > 0 && level < maxLevel && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowReplies(!showReplies)}
              >
                <Text style={styles.viewRepliesText}>
                  {showReplies ? 'Hide' : 'View'} {comment.replies_count}{' '}
                  {comment.replies_count === 1 ? 'reply' : 'replies'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Nested Replies */}
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <View style={styles.repliesContainer}>
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onLike={onLike}
              onReply={onReply}
              onDelete={onDelete}
              onReport={onReport}
              currentUserId={currentUserId}
              level={level + 1}
              isOP={reply.user_id === isOP}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  commentContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  opBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.secondary,
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  text: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.backgroundSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  viewRepliesText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  repliesContainer: {
    marginTop: 12,
  },
});
