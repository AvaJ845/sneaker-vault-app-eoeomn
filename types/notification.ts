// Notification Types for Sneaker Vault
// Handles push notifications for messages, comments, and other activities

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  from_user_id: string;
  reference_id: string; // message_id, comment_id, or post_id
  title: string;
  content: string;
  image_url?: string;
  is_read: boolean;
  created_at: string;
  // From user info (populated from join)
  from_user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export type NotificationType =
  | 'message'
  | 'comment'
  | 'reply'
  | 'mention'
  | 'like'
  | 'follow'
  | 'trade_proposal'
  | 'price_alert'
  | 'sneaker_drop'
  | 'verification_complete'
  | 'system';

export interface NotificationSettings {
  user_id: string;
  messages_enabled: boolean;
  comments_enabled: boolean;
  mentions_enabled: boolean;
  likes_enabled: boolean;
  follows_enabled: boolean;
  trades_enabled: boolean;
  price_alerts_enabled: boolean;
  drops_enabled: boolean;
  push_enabled: boolean;
  email_enabled: boolean;
  updated_at: string;
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  data: {
    type: NotificationType;
    reference_id: string;
    from_user_id: string;
    conversation_id?: string;
    post_id?: string;
    comment_id?: string;
  };
}
