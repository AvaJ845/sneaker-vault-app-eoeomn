
export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  timestamp: string;
  expiresAt: string;
  isViewed: boolean;
  duration?: number;
}

export interface StoryGroup {
  userId: string;
  username: string;
  userAvatar: string;
  stories: Story[];
  hasUnviewed: boolean;
}
