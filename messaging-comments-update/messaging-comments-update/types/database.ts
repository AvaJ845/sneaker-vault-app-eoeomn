
export interface SneakerDatabase {
  id: string;
  sku: string;
  brand: string;
  model: string;
  colorway: string;
  releaseDate: string;
  retailPrice: number;
  estimatedValue: number;
  imageUrl: string;
  category: 'Basketball' | 'Running' | 'Lifestyle' | 'Training' | 'Skateboarding' | 'Other';
  silhouette: string; // e.g., "Air Jordan 1", "Kobe 6", "LeBron 18"
  isCurated: boolean; // True for official database entries
  addedBy?: string; // User ID who added this (for user-generated content)
  verificationStatus: 'verified' | 'pending' | 'unverified';
  popularity: number; // 1-100 score for sorting
  tags: string[]; // e.g., ["retro", "og", "grail"]
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SneakerBrand {
  id: string;
  name: string;
  logoUrl?: string;
  popularSilhouettes: string[];
}

export interface SearchFilters {
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  silhouette?: string;
  tags?: string[];
  searchQuery?: string;
  sortBy?: 'popularity' | 'price-asc' | 'price-desc' | 'release-date' | 'name';
}

export interface AddSneakerForm {
  sku: string;
  brand: string;
  model: string;
  colorway: string;
  releaseDate: string;
  retailPrice: number;
  estimatedValue: number;
  imageUrl: string;
  category: 'Basketball' | 'Running' | 'Lifestyle' | 'Training' | 'Skateboarding' | 'Other';
  silhouette: string;
  tags: string[];
  description?: string;
}
