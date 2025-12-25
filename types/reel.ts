
export interface Reel {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  sneakerImageUrl: string;
  sneakerBrand: string;
  sneakerModel: string;
  sneakerColorway: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  isLiked: boolean;
  tags: string[];
  musicName?: string;
  musicArtist?: string;
}
