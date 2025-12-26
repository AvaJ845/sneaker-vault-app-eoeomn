
export interface CollectionItem {
  id: string;
  user_id: string;
  sneaker_id: string;
  size: string;
  condition: string;
  purchase_price: number;
  purchase_date: string;
  notes?: string;
  is_for_sale: boolean;
  asking_price?: number;
  wear_count: number;
  storage_location?: string;
  fit_notes?: string;
  cost_basis?: number;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceLog {
  id: string;
  collection_item_id: string;
  user_id: string;
  maintenance_type: 'cleaning' | 'sole_swap' | 'repair' | 'restoration';
  description?: string;
  cost?: number;
  performed_date: string;
  before_photos: string[];
  after_photos: string[];
  created_at: string;
}

export interface ConditionHistory {
  id: string;
  collection_item_id: string;
  user_id: string;
  condition_rating: string; // 'DS', 'VNDS', '9/10', '8/10', etc.
  notes?: string;
  photos: string[];
  recorded_date: string;
  created_at: string;
}

export interface SneakerPhoto {
  id: string;
  collection_item_id: string;
  user_id: string;
  photo_url: string;
  photo_type: 'main' | 'side' | 'top' | 'bottom' | 'box' | 'receipt' | 'uv_light';
  caption?: string;
  is_primary: boolean;
  created_at: string;
}

export interface AuthenticationDocument {
  id: string;
  collection_item_id: string;
  user_id: string;
  document_type: 'receipt' | 'invoice' | 'authentication_cert' | 'legit_check';
  document_url: string;
  issuer?: string;
  verification_code?: string;
  batch_number?: string;
  notes?: string;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  sneaker_id: string;
  priority: 'low' | 'medium' | 'high' | 'grail';
  target_price?: number;
  size_preference?: string;
  notes?: string;
  is_grail: boolean;
  added_at: string;
}

export interface PriceHistory {
  id: string;
  sneaker_id: string;
  price: number;
  source: 'stockx' | 'goat' | 'manual' | 'estimated';
  size?: string;
  recorded_date: string;
  created_at: string;
}

export interface PortfolioAnalytics {
  totalValue: number;
  totalInvestment: number;
  totalGain: number;
  gainPercentage: number;
  itemCount: number;
  topPerformers: {
    sneaker_id: string;
    brand: string;
    model: string;
    roi: number;
    gain: number;
  }[];
  worstPerformers: {
    sneaker_id: string;
    brand: string;
    model: string;
    roi: number;
    loss: number;
  }[];
  diversification: {
    byBrand: { brand: string; count: number; value: number }[];
    byCategory: { category: string; count: number; value: number }[];
    byYear: { year: number; count: number; value: number }[];
  };
}
