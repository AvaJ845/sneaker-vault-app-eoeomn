
export interface Collection {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  type: 'investment' | 'daily_wear' | 'display' | 'custom';
  icon?: string;
  color?: string;
  is_smart: boolean;
  smart_rules?: SmartRules;
  item_count: number;
  total_value: number;
  created_at: string;
  updated_at: string;
}

export interface SmartRules {
  conditions: SmartCondition[];
  operator: 'AND' | 'OR';
}

export interface SmartCondition {
  field: 'brand' | 'category' | 'value' | 'condition' | 'wear_count' | 'purchase_date' | 'tags';
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'between';
  value: any;
}

export interface CustomTag {
  id: string;
  user_id: string;
  name: string;
  color?: string;
  icon?: string;
  usage_count: number;
  created_at: string;
}

export interface Trade {
  id: string;
  initiator_id: string;
  recipient_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  trade_type: 'swap' | 'trade' | 'sale';
  message?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface TradeItem {
  id: string;
  trade_id: string;
  collection_item_id: string;
  owner_id: string;
  cash_value: number;
  created_at: string;
}

export interface SizeRun {
  id: string;
  user_id: string;
  sneaker_id: string;
  sizes: SizeInfo[];
  target_sizes: string[];
  completed_sizes: string[];
  completion_percentage: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SizeInfo {
  size: string;
  available: boolean;
  collection_item_id?: string;
  notes?: string;
}

export interface Alert {
  id: string;
  user_id: string;
  alert_type: 'price_drop' | 'new_release' | 'milestone' | 'trade_offer' | 'maintenance_due';
  title: string;
  message?: string;
  data?: any;
  is_read: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
  expires_at?: string;
}

export interface MarketTrend {
  id: string;
  sneaker_id: string;
  trend_type: 'price' | 'demand' | 'supply';
  value: number;
  change_percentage?: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  data_points?: any;
  recorded_at: string;
  created_at: string;
}

export interface BusinessTransaction {
  id: string;
  user_id: string;
  collection_item_id?: string;
  transaction_type: 'purchase' | 'sale' | 'expense' | 'fee';
  amount: number;
  tax_amount: number;
  description?: string;
  category?: string;
  receipt_url?: string;
  transaction_date: string;
  fiscal_year?: number;
  fiscal_quarter?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AppraisalReport {
  id: string;
  user_id: string;
  report_type: 'insurance' | 'appraisal' | 'inventory';
  title: string;
  description?: string;
  total_items: number;
  total_value: number;
  report_data?: any;
  pdf_url?: string;
  generated_at: string;
  created_at: string;
}

export interface BatchOperation {
  id: string;
  user_id: string;
  operation_type: 'update_condition' | 'add_tags' | 'move_collection' | 'update_value';
  item_count: number;
  items_affected: string[];
  changes: any;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
}

export interface CollectorFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface CollectorInterest {
  id: string;
  user_id: string;
  interest_type: 'brand' | 'silhouette' | 'category' | 'era';
  interest_value: string;
  created_at: string;
}

export interface FilterOptions {
  collections?: string[];
  tags?: string[];
  brands?: string[];
  categories?: string[];
  conditions?: string[];
  priceRange?: [number, number];
  valueRange?: [number, number];
  wearCountRange?: [number, number];
  dateRange?: [string, string];
  forSale?: boolean;
  sortBy?: 'date' | 'value' | 'brand' | 'wear_count' | 'condition';
  sortOrder?: 'asc' | 'desc';
}
