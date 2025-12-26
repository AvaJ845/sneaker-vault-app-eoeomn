
export interface Sneaker {
  id: string;
  brand: string;
  model: string;
  colorway: string;
  size: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  purchasePrice: number;
  currentValue: number;
  purchaseDate: string;
  imageUrl: string;
  notes?: string;
  userId: string;
}

export interface SneakerPost {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  sneaker: Sneaker;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
}

export interface MarketplaceListing {
  id: string;
  sneaker: Sneaker;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  askingPrice: number;
  isNegotiable: boolean;
  shippingCost: number;
  location: string;
  listedDate: string;
  views: number;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  collectionCount: number;
  followers: number;
  following: number;
  totalValue: number;
}
