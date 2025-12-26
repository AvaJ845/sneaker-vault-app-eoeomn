// Comment Types for Sneaker Vault
// Handles comments, replies, and reactions on posts

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id?: string; // For nested replies
  media_url?: string; // Optional photo reply
  likes_count: number;
  replies_count: number;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  // User info (populated from join)
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
    is_verified?: boolean;
  };
  // Check if current user liked this comment
  is_liked_by_user?: boolean;
  // Nested replies
  replies?: Comment[];
}

export interface CommentLike {
  id: string;
  comment_id: string;
  user_id: string;
  created_at: string;
}

export interface CommentForm {
  post_id: string;
  content: string;
  parent_comment_id?: string;
  media_url?: string;
}

export interface CommentStats {
  total_comments: number;
  total_replies: number;
  top_commenters: Array<{
    user_id: string;
    username: string;
    comment_count: number;
  }>;
}

export type CommentSortOption = 'newest' | 'oldest' | 'top' | 'controversial';

export interface CommentFilters {
  sort: CommentSortOption;
  show_only_replies?: boolean;
  user_id?: string;
}
