
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sneakers: {
        Row: {
          id: string
          sku: string
          brand: string
          model: string
          colorway: string
          silhouette: string | null
          release_date: string | null
          retail_price: number | null
          estimated_value: number | null
          image_url: string | null
          category: string | null
          description: string | null
          tags: string[] | null
          is_curated: boolean | null
          verification_status: string | null
          popularity: number | null
          added_by: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          sku: string
          brand: string
          model: string
          colorway: string
          silhouette?: string | null
          release_date?: string | null
          retail_price?: number | null
          estimated_value?: number | null
          image_url?: string | null
          category?: string | null
          description?: string | null
          tags?: string[] | null
          is_curated?: boolean | null
          verification_status?: string | null
          popularity?: number | null
          added_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          sku?: string
          brand?: string
          model?: string
          colorway?: string
          silhouette?: string | null
          release_date?: string | null
          retail_price?: number | null
          estimated_value?: number | null
          image_url?: string | null
          category?: string | null
          description?: string | null
          tags?: string[] | null
          is_curated?: boolean | null
          verification_status?: string | null
          popularity?: number | null
          added_by?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      user_collections: {
        Row: {
          id: string
          user_id: string | null
          sneaker_id: string | null
          size: string | null
          condition: string | null
          purchase_price: number | null
          purchase_date: string | null
          notes: string | null
          is_for_sale: boolean | null
          asking_price: number | null
          wear_count: number | null
          storage_location: string | null
          fit_notes: string | null
          cost_basis: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          sneaker_id?: string | null
          size?: string | null
          condition?: string | null
          purchase_price?: number | null
          purchase_date?: string | null
          notes?: string | null
          is_for_sale?: boolean | null
          asking_price?: number | null
          wear_count?: number | null
          storage_location?: string | null
          fit_notes?: string | null
          cost_basis?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          sneaker_id?: string | null
          size?: string | null
          condition?: string | null
          purchase_price?: number | null
          purchase_date?: string | null
          notes?: string | null
          is_for_sale?: boolean | null
          asking_price?: number | null
          wear_count?: number | null
          storage_location?: string | null
          fit_notes?: string | null
          cost_basis?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      maintenance_logs: {
        Row: {
          id: string
          collection_item_id: string | null
          user_id: string | null
          maintenance_type: string
          description: string | null
          cost: number | null
          performed_date: string
          before_photos: string[] | null
          after_photos: string[] | null
          created_at: string | null
        }
        Insert: {
          id?: string
          collection_item_id?: string | null
          user_id?: string | null
          maintenance_type: string
          description?: string | null
          cost?: number | null
          performed_date: string
          before_photos?: string[] | null
          after_photos?: string[] | null
          created_at?: string | null
        }
        Update: {
          id?: string
          collection_item_id?: string | null
          user_id?: string | null
          maintenance_type?: string
          description?: string | null
          cost?: number | null
          performed_date?: string
          before_photos?: string[] | null
          after_photos?: string[] | null
          created_at?: string | null
        }
      }
      condition_history: {
        Row: {
          id: string
          collection_item_id: string | null
          user_id: string | null
          condition_rating: string
          notes: string | null
          photos: string[] | null
          recorded_date: string
          created_at: string | null
        }
        Insert: {
          id?: string
          collection_item_id?: string | null
          user_id?: string | null
          condition_rating: string
          notes?: string | null
          photos?: string[] | null
          recorded_date: string
          created_at?: string | null
        }
        Update: {
          id?: string
          collection_item_id?: string | null
          user_id?: string | null
          condition_rating?: string
          notes?: string | null
          photos?: string[] | null
          recorded_date?: string
          created_at?: string | null
        }
      }
      sneaker_photos: {
        Row: {
          id: string
          collection_item_id: string | null
          user_id: string | null
          photo_url: string
          photo_type: string
          caption: string | null
          is_primary: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          collection_item_id?: string | null
          user_id?: string | null
          photo_url: string
          photo_type: string
          caption?: string | null
          is_primary?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          collection_item_id?: string | null
          user_id?: string | null
          photo_url?: string
          photo_type?: string
          caption?: string | null
          is_primary?: boolean | null
          created_at?: string | null
        }
      }
      authentication_documents: {
        Row: {
          id: string
          collection_item_id: string | null
          user_id: string | null
          document_type: string
          document_url: string
          issuer: string | null
          verification_code: string | null
          batch_number: string | null
          notes: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          collection_item_id?: string | null
          user_id?: string | null
          document_type: string
          document_url: string
          issuer?: string | null
          verification_code?: string | null
          batch_number?: string | null
          notes?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          collection_item_id?: string | null
          user_id?: string | null
          document_type?: string
          document_url?: string
          issuer?: string | null
          verification_code?: string | null
          batch_number?: string | null
          notes?: string | null
          created_at?: string | null
        }
      }
      wishlist: {
        Row: {
          id: string
          user_id: string | null
          sneaker_id: string | null
          priority: string | null
          target_price: number | null
          size_preference: string | null
          notes: string | null
          is_grail: boolean | null
          added_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          sneaker_id?: string | null
          priority?: string | null
          target_price?: number | null
          size_preference?: string | null
          notes?: string | null
          is_grail?: boolean | null
          added_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          sneaker_id?: string | null
          priority?: string | null
          target_price?: number | null
          size_preference?: string | null
          notes?: string | null
          is_grail?: boolean | null
          added_at?: string | null
        }
      }
      price_history: {
        Row: {
          id: string
          sneaker_id: string | null
          price: number
          source: string | null
          size: string | null
          recorded_date: string
          created_at: string | null
        }
        Insert: {
          id?: string
          sneaker_id?: string | null
          price: number
          source?: string | null
          size?: string | null
          recorded_date: string
          created_at?: string | null
        }
        Update: {
          id?: string
          sneaker_id?: string | null
          price?: number
          source?: string | null
          size?: string | null
          recorded_date?: string
          created_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string | null
          sneaker_id: string | null
          image_url: string
          caption: string | null
          likes_count: number | null
          comments_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          sneaker_id?: string | null
          image_url: string
          caption?: string | null
          likes_count?: number | null
          comments_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          sneaker_id?: string | null
          image_url?: string
          caption?: string | null
          likes_count?: number | null
          comments_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
