
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
      post_likes: {
        Row: {
          id: string
          post_id: string | null
          user_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          post_id?: string | null
          user_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string | null
          user_id?: string | null
          created_at?: string | null
        }
      }
      post_comments: {
        Row: {
          id: string
          post_id: string | null
          user_id: string | null
          comment: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          post_id?: string | null
          user_id?: string | null
          comment: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string | null
          user_id?: string | null
          comment?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
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
