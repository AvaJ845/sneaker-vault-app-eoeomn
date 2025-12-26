# 💬 Messaging & Comments System - Setup Guide

## 🎉 What We Built

A complete iMessage-style messaging and Instagram-style comments system for Sneaker Vault!

### ✅ Components Created:

#### **Comments System:**
1. `types/comment.ts` - TypeScript interfaces
2. `components/CommentItem.tsx` - Individual comment with replies
3. `components/CommentInput.tsx` - Add comment interface
4. `components/CommentsList.tsx` - Full comments section

#### **Messaging System:**
5. `types/message.ts` - Message & conversation interfaces
6. `types/notification.ts` - Notification system types
7. `components/MessageBubble.tsx` - Chat message bubbles
8. `components/MessageInput.tsx` - iMessage-style input
9. `app/(tabs)/messages.tsx` - Messages screen

---

## 🗄️ Database Setup (Supabase)

### Step 1: Create Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- ============================================
-- COMMENTS TABLES
-- ============================================

-- Comments table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  media_url TEXT,
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  is_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comment likes table
CREATE TABLE comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id)
);

-- Indexes for comments
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_comment_likes_user_id ON comment_likes(user_id);

-- ============================================
-- MESSAGING TABLES
-- ============================================

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(20) NOT NULL CHECK (type IN ('direct', 'group')),
  name VARCHAR(200),
  avatar_url TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation participants
CREATE TABLE conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  is_muted BOOLEAN DEFAULT false,
  last_read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(conversation_id, user_id)
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT,
  message_type VARCHAR(20) NOT NULL DEFAULT 'text',
  media_url TEXT,
  sneaker_id UUID,
  trade_proposal_id UUID,
  reply_to_message_id UUID REFERENCES messages(id),
  is_read BOOLEAN DEFAULT false,
  is_edited BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message reactions
CREATE TABLE message_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- Indexes for messages
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE INDEX idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(30) NOT NULL,
  from_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reference_id VARCHAR(200) NOT NULL,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can add comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);

-- Comment likes policies
CREATE POLICY "Comment likes are viewable by everyone"
  ON comment_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can like comments"
  ON comment_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments"
  ON comment_likes FOR DELETE
  USING (auth.uid() = user_id);

-- Conversations policies
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (
    id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Messages policies
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants
      WHERE user_id = auth.uid()
    )
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);
```

### Step 2: Create Database Functions

```sql
-- Function to update comment counts
CREATE OR REPLACE FUNCTION update_comment_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.parent_comment_id IS NOT NULL THEN
      UPDATE comments
      SET replies_count = replies_count + 1
      WHERE id = NEW.parent_comment_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.parent_comment_id IS NOT NULL THEN
      UPDATE comments
      SET replies_count = replies_count - 1
      WHERE id = OLD.parent_comment_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comment_counts_trigger
AFTER INSERT OR DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_comment_counts();

-- Function to update likes count
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE comments
    SET likes_count = likes_count + 1
    WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE comments
    SET likes_count = likes_count - 1
    WHERE id = OLD.comment_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER likes_count_trigger
AFTER INSERT OR DELETE ON comment_likes
FOR EACH ROW
EXECUTE FUNCTION update_likes_count();

-- Function to update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversation_timestamp_trigger
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_timestamp();
```

---

## 🔧 Integration Guide

### Step 3: Add to Navigation

Update `app/(tabs)/_layout.tsx` or `_layout.ios.tsx` to add the Messages tab:

```typescript
<Tabs.Screen
  name="messages"
  options={{
    title: 'Messages',
    tabBarIcon: ({ color }) => (
      <IconSymbol
        ios_icon_name="bubble.left.and.bubble.right.fill"
        android_material_icon_name="chat"
        size={28}
        color={color}
      />
    ),
  }}
/>
```

### Step 4: Add Comments to Posts

In your `ShoeboxCard.tsx` or any post component, add the comments button:

```typescript
import { CommentsList } from '@/components/CommentsList';

// In your post component
const [showComments, setShowComments] = useState(false);

// Add comment button
<TouchableOpacity onPress={() => setShowComments(true)}>
  <IconSymbol ios_icon_name="bubble.left" android_material_icon_name="comment" />
  <Text>{post.comments_count}</Text>
</TouchableOpacity>

// Show comments modal
{showComments && (
  <Modal visible={showComments} animationType="slide">
    <CommentsList
      postId={post.id}
      onLoadComments={loadCommentsFromSupabase}
      onAddComment={addCommentToSupabase}
      onLikeComment={likeCommentInSupabase}
      currentUserId={currentUser?.id}
      originalPosterId={post.user_id}
    />
    <TouchableOpacity onPress={() => setShowComments(false)}>
      <Text>Close</Text>
    </TouchableOpacity>
  </Modal>
)}
```

### Step 5: Create Supabase Helper Functions

Create `lib/supabase/comments.ts`:

```typescript
import { supabase } from './supabaseClient';
import { Comment, CommentForm, CommentSortOption } from '@/types/comment';

export async function loadComments(
  postId: string,
  sort: CommentSortOption = 'newest'
): Promise<Comment[]> {
  let query = supabase
    .from('comments')
    .select(`
      *,
      user:user_id(id, username, avatar_url, is_verified),
      replies:comments(
        *,
        user:user_id(id, username, avatar_url, is_verified)
      )
    `)
    .eq('post_id', postId)
    .is('parent_comment_id', null);

  // Apply sorting
  switch (sort) {
    case 'newest':
      query = query.order('created_at', { ascending: false });
      break;
    case 'oldest':
      query = query.order('created_at', { ascending: true });
      break;
    case 'top':
      query = query.order('likes_count', { ascending: false });
      break;
  }

  const { data, error } = await query;

  if (error) throw error;
  return data || [];
}

export async function addComment(
  postId: string,
  content: string,
  mediaUrl?: string,
  parentCommentId?: string
): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      content,
      media_url: mediaUrl,
      parent_comment_id: parentCommentId,
    });

  if (error) throw error;
}

export async function likeComment(commentId: string): Promise<void> {
  const { data: existing } = await supabase
    .from('comment_likes')
    .select('id')
    .eq('comment_id', commentId)
    .single();

  if (existing) {
    // Unlike
    await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId);
  } else {
    // Like
    await supabase
      .from('comment_likes')
      .insert({ comment_id: commentId });
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
}
```

Create `lib/supabase/messages.ts`:

```typescript
import { supabase } from './supabaseClient';
import { Message, Conversation } from '@/types/message';

export async function loadConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participants:conversation_participants(
        *,
        user:user_id(id, username, avatar_url)
      ),
      last_message:messages(*)
    `)
    .order('last_message_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function loadMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:sender_id(id, username, avatar_url)
    `)
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function sendMessage(
  conversationId: string,
  content: string,
  messageType: string,
  mediaUrl?: string
): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      content,
      message_type: messageType,
      media_url: mediaUrl,
    });

  if (error) throw error;
}
```

---

## 🔔 Real-time Setup

Enable real-time updates:

```typescript
// Subscribe to new comments
const commentsChannel = supabase
  .channel('comments')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'comments',
      filter: `post_id=eq.${postId}`
    },
    (payload) => {
      console.log('New comment:', payload.new);
      // Add to comments list
    }
  )
  .subscribe();

// Subscribe to new messages
const messagesChannel = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `conversation_id=eq.${conversationId}`
    },
    (payload) => {
      console.log('New message:', payload.new);
      // Add to messages list
    }
  )
  .subscribe();

// Typing indicator
const typingChannel = supabase.channel('typing')
  .on('presence', { event: 'sync' }, () => {
    const state = typingChannel.presenceState();
    // Update typing indicator
  })
  .subscribe();

// Send typing status
await typingChannel.track({
  user_id: currentUser.id,
  typing: true
});
```

---

## ✅ Testing Checklist

### Comments:
- [ ] Can view comments on posts
- [ ] Can add new comments
- [ ] Can reply to comments (nested)
- [ ] Can like/unlike comments
- [ ] Can delete own comments
- [ ] Can sort comments (newest, oldest, top)
- [ ] Can attach photos to comments
- [ ] Real-time updates work

### Messaging:
- [ ] Can view conversations list
- [ ] Can open a conversation
- [ ] Can send text messages
- [ ] Can send photos
- [ ] Can see read receipts
- [ ] Can see typing indicators
- [ ] Real-time message delivery works
- [ ] Unread count updates

---

## 🎨 Customization

### Change Colors:

Edit `styles/commonStyles.ts`:

```typescript
export const colors = {
  primary: '#007AFF',      // Message bubbles (your messages)
  secondary: '#00C853',    // Verified badges
  success: '#4CAF50',      // Online status
  error: '#F44336',        // Error states
  // ... other colors
};
```

### Change Bubble Styles:

Edit `components/MessageBubble.tsx` styles to customize the look!

---

## 🚀 Next Steps

1. **Enable Supabase** in your project
2. **Run the SQL** commands above
3. **Add navigation** to Messages tab
4. **Add comments** to your posts
5. **Test everything** works
6. **Deploy** and enjoy!

---

## 📝 Notes

- All files use TypeScript for type safety
- Components follow your existing design system
- Real-time features require Supabase Realtime enabled
- Image uploads require Supabase Storage setup
- Push notifications require Expo notifications setup

---

## 🆘 Need Help?

Common issues:

1. **RLS errors**: Make sure policies are created correctly
2. **Real-time not working**: Check Supabase Realtime is enabled
3. **Images not uploading**: Set up Supabase Storage first
4. **Auth errors**: Ensure user is authenticated before accessing

---

Enjoy your new messaging and comments system! 🎉
