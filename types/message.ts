// Message Types for Sneaker Vault
// Handles direct messages, conversations, and real-time chat

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: MessageType;
  media_url?: string;
  sneaker_id?: string; // For sneaker card shares
  trade_proposal_id?: string;
  reply_to_message_id?: string;
  is_read: boolean;
  is_edited: boolean;
  created_at: string;
  updated_at: string;
  // Sender info (populated from join)
  sender?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  // For sneaker shares
  sneaker?: {
    id: string;
    brand: string;
    model: string;
    image_url: string;
    price?: number;
  };
}

export type MessageType = 
  | 'text'
  | 'image'
  | 'video'
  | 'voice'
  | 'sneaker_card'
  | 'trade_proposal'
  | 'location'
  | 'system';

export interface Conversation {
  id: string;
  type: ConversationType;
  name?: string; // For group chats
  avatar_url?: string; // For group chats
  created_by: string;
  created_at: string;
  last_message_at: string;
  last_message?: Message;
  unread_count: number;
  // Participants info
  participants?: ConversationParticipant[];
  // For 1-on-1, the other user
  other_user?: {
    id: string;
    username: string;
    avatar_url?: string;
    is_online?: boolean;
  };
}

export type ConversationType = 'direct' | 'group';

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'member' | 'admin';
  is_muted: boolean;
  last_read_at: string;
  joined_at: string;
  user?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface TypingIndicator {
  conversation_id: string;
  user_id: string;
  username: string;
  is_typing: boolean;
  timestamp: number;
}

export interface MessageForm {
  conversation_id: string;
  content: string;
  message_type: MessageType;
  media_url?: string;
  sneaker_id?: string;
  reply_to_message_id?: string;
}

export interface VoiceMessage {
  duration: number; // in seconds
  audio_url: string;
  waveform?: number[]; // For visualization
}

export interface TradeProposal {
  id: string;
  from_user_id: string;
  to_user_id: string;
  offered_sneaker_ids: string[];
  requested_sneaker_ids: string[];
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  message?: string;
  created_at: string;
  updated_at: string;
}
