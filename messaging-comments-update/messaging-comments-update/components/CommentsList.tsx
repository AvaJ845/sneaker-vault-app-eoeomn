import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { CommentItem } from './CommentItem';
import { CommentInput } from './CommentInput';
import { colors } from '@/styles/commonStyles';
import { Comment, CommentSortOption } from '@/types/comment';

interface CommentsListProps {
  postId: string;
  onLoadComments: (postId: string, sort: CommentSortOption) => Promise<Comment[]>;
  onAddComment: (postId: string, content: string, mediaUrl?: string, parentId?: string) => Promise<void>;
  onLikeComment: (commentId: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  onReportComment?: (commentId: string) => void;
  currentUserId?: string;
  originalPosterId?: string;
}

export function CommentsList({
  postId,
  onLoadComments,
  onAddComment,
  onLikeComment,
  onDeleteComment,
  onReportComment,
  currentUserId,
  originalPosterId,
}: CommentsListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [sortBy, setSortBy] = useState<CommentSortOption>('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string; username: string } | null>(null);

  useEffect(() => {
    loadComments();
  }, [postId, sortBy]);

  const loadComments = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const loadedComments = await onLoadComments(postId, sortBy);
      setComments(loadedComments);
    } catch (error) {
      console.error('Error loading comments:', error);
      Alert.alert('Error', 'Failed to load comments. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleAddComment = async (content: string, mediaUrl?: string) => {
    try {
      await onAddComment(postId, content, mediaUrl, replyingTo?.id);
      setReplyingTo(null);
      await loadComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await onLikeComment(commentId);
      // Optimistic update
      setComments(prevComments =>
        prevComments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              is_liked_by_user: !comment.is_liked_by_user,
              likes_count: comment.is_liked_by_user
                ? comment.likes_count - 1
                : comment.likes_count + 1,
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReply = (commentId: string, username: string) => {
    setReplyingTo({ id: commentId, username });
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!onDeleteComment) return;

    try {
      await onDeleteComment(commentId);
      setComments(prevComments => prevComments.filter(c => c.id !== commentId));
      Alert.alert('Success', 'Comment deleted');
    } catch (error) {
      console.error('Error deleting comment:', error);
      Alert.alert('Error', 'Failed to delete comment');
    }
  };

  const handleSortChange = () => {
    const sortOptions: CommentSortOption[] = ['newest', 'oldest', 'top'];
    const sortLabels = {
      newest: 'Newest First',
      oldest: 'Oldest First',
      top: 'Most Liked',
    };

    Alert.alert(
      'Sort Comments',
      'Choose sorting option',
      sortOptions.map(option => ({
        text: sortLabels[option],
        onPress: () => setSortBy(option),
      })).concat({ text: 'Cancel', style: 'cancel' })
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>
        Comments ({comments.length})
      </Text>
      <TouchableOpacity onPress={handleSortChange} style={styles.sortButton}>
        <IconSymbol
          ios_icon_name="arrow.up.arrow.down"
          android_material_icon_name="sort"
          size={20}
          color={colors.primary}
        />
        <Text style={styles.sortText}>
          {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : 'Top'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol
        ios_icon_name="bubble.left"
        android_material_icon_name="chat-bubble-outline"
        size={48}
        color={colors.textSecondary}
      />
      <Text style={styles.emptyTitle}>No comments yet</Text>
      <Text style={styles.emptyText}>Be the first to comment!</Text>
    </View>
  );

  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading comments...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <CommentItem
            comment={item}
            onLike={handleLikeComment}
            onReply={handleReply}
            onDelete={onDeleteComment ? handleDeleteComment : undefined}
            onReport={onReportComment}
            currentUserId={currentUserId}
            isOP={item.user_id === originalPosterId}
          />
        )}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadComments(true)}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Comment Input */}
      <CommentInput
        onSubmit={handleAddComment}
        placeholder={replyingTo ? `Reply to @${replyingTo.username}...` : 'Add a comment...'}
        replyingTo={replyingTo?.username}
        onCancelReply={handleCancelReply}
        autoFocus={!!replyingTo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
