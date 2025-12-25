
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { SearchFilters, AddSneakerForm } from '@/types/database';

type SneakerRow = Database['public']['Tables']['sneakers']['Row'];

// This hook manages the sneaker database with Supabase
export const useSneakerDatabase = () => {
  const [sneakers, setSneakers] = useState<SneakerRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const ITEMS_PER_PAGE = 20;

  const loadSneakers = useCallback(
    async (filters?: SearchFilters, pageNum: number = 1) => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('sneakers')
          .select('*', { count: 'exact' });

        // Apply filters
        if (filters?.brand) {
          query = query.ilike('brand', filters.brand);
        }

        if (filters?.category) {
          query = query.eq('category', filters.category);
        }

        if (filters?.searchQuery) {
          query = query.or(
            `brand.ilike.%${filters.searchQuery}%,model.ilike.%${filters.searchQuery}%,colorway.ilike.%${filters.searchQuery}%,sku.ilike.%${filters.searchQuery}%`
          );
        }

        if (filters?.minPrice !== undefined) {
          query = query.gte('estimated_value', filters.minPrice);
        }

        if (filters?.maxPrice !== undefined) {
          query = query.lte('estimated_value', filters.maxPrice);
        }

        // Apply sorting
        switch (filters?.sortBy) {
          case 'popularity':
            query = query.order('popularity', { ascending: false });
            break;
          case 'price-asc':
            query = query.order('estimated_value', { ascending: true });
            break;
          case 'price-desc':
            query = query.order('estimated_value', { ascending: false });
            break;
          case 'release-date':
            query = query.order('release_date', { ascending: false });
            break;
          case 'name':
            query = query.order('model', { ascending: true });
            break;
          default:
            query = query.order('popularity', { ascending: false });
        }

        // Apply pagination
        const from = (pageNum - 1) * ITEMS_PER_PAGE;
        const to = from + ITEMS_PER_PAGE - 1;
        query = query.range(from, to);

        const { data, error: queryError, count } = await query;

        if (queryError) {
          throw queryError;
        }

        if (pageNum === 1) {
          setSneakers(data || []);
        } else {
          setSneakers((prev) => [...prev, ...(data || [])]);
        }

        setTotal(count || 0);
        setHasMore((data?.length || 0) === ITEMS_PER_PAGE);
        setPage(pageNum);
      } catch (err: any) {
        console.error('Error loading sneakers:', err);
        setError(err.message || 'Failed to load sneakers');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadMore = useCallback(
    (filters?: SearchFilters) => {
      if (!loading && hasMore) {
        loadSneakers(filters, page + 1);
      }
    },
    [loading, hasMore, page, loadSneakers]
  );

  const refresh = useCallback(
    (filters?: SearchFilters) => {
      loadSneakers(filters, 1);
    },
    [loadSneakers]
  );

  const search = useCallback(
    async (query: string) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: searchError, count } = await supabase
          .from('sneakers')
          .select('*', { count: 'exact' })
          .or(
            `brand.ilike.%${query}%,model.ilike.%${query}%,colorway.ilike.%${query}%,sku.ilike.%${query}%`
          )
          .order('popularity', { ascending: false })
          .limit(100);

        if (searchError) {
          throw searchError;
        }

        setSneakers(data || []);
        setTotal(count || 0);
        setHasMore(false);
      } catch (err: any) {
        console.error('Error searching sneakers:', err);
        setError(err.message || 'Failed to search sneakers');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getSneaker = useCallback(async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('sneakers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (err: any) {
      console.error('Error getting sneaker:', err);
      return null;
    }
  }, []);

  // Function to add a user-generated sneaker
  const addSneaker = useCallback(async (form: AddSneakerForm) => {
    console.log('Add sneaker:', form);
    
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to add sneakers');
      }

      const { data, error: insertError } = await supabase
        .from('sneakers')
        .insert([
          {
            sku: form.sku,
            brand: form.brand,
            model: form.model,
            colorway: form.colorway,
            silhouette: form.silhouette || null,
            release_date: form.releaseDate || null,
            retail_price: form.retailPrice || null,
            estimated_value: form.estimatedValue || null,
            image_url: form.imageUrl || null,
            category: form.category || 'Lifestyle',
            description: form.description || null,
            tags: form.tags || [],
            is_curated: false,
            verification_status: 'pending',
            popularity: 0,
            added_by: user.id,
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      console.log('Successfully added sneaker to database:', data);

      // Refresh the list to show the new sneaker
      await loadSneakers(undefined, 1);

      return data;
    } catch (err: any) {
      console.error('Error adding sneaker:', err);
      setError(err.message || 'Failed to add sneaker');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadSneakers]);

  // Get database statistics
  const getStats = useCallback(async () => {
    try {
      const { count: totalCount } = await supabase
        .from('sneakers')
        .select('*', { count: 'exact', head: true });

      const { count: curatedCount } = await supabase
        .from('sneakers')
        .select('*', { count: 'exact', head: true })
        .eq('is_curated', true);

      const { count: userCount } = await supabase
        .from('sneakers')
        .select('*', { count: 'exact', head: true })
        .eq('is_curated', false);

      const { data: brands } = await supabase
        .from('sneakers')
        .select('brand')
        .limit(1000);

      const { data: categories } = await supabase
        .from('sneakers')
        .select('category')
        .limit(1000);

      return {
        total: totalCount || 0,
        curated: curatedCount || 0,
        userGenerated: userCount || 0,
        brands: new Set(brands?.map(b => b.brand)).size || 0,
        categories: new Set(categories?.map(c => c.category)).size || 0,
      };
    } catch (err: any) {
      console.error('Error getting stats:', err);
      return {
        total: 0,
        curated: 0,
        userGenerated: 0,
        brands: 0,
        categories: 0,
      };
    }
  }, []);

  return {
    sneakers,
    loading,
    error,
    total,
    hasMore,
    loadSneakers,
    loadMore,
    refresh,
    search,
    getSneaker,
    addSneaker,
    getStats,
  };
};

// Hook for managing user's personal collection
export const useUserCollection = () => {
  const [collection, setCollection] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCollection = useCallback(async (sneakerId: string, details?: {
    size?: string;
    condition?: string;
    purchase_price?: number;
    purchase_date?: string;
    notes?: string;
  }) => {
    console.log('Add to collection:', sneakerId, details);
    
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to add to your collection');
      }

      const { data, error: insertError } = await supabase
        .from('user_collections')
        .insert([
          {
            user_id: user.id,
            sneaker_id: sneakerId,
            ...details,
          },
        ])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      await loadCollection();
      return data;
    } catch (err: any) {
      console.error('Error adding to collection:', err);
      setError(err.message || 'Failed to add to collection');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromCollection = useCallback(async (collectionId: string) => {
    console.log('Remove from collection:', collectionId);
    
    try {
      setLoading(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('user_collections')
        .delete()
        .eq('id', collectionId);

      if (deleteError) {
        throw deleteError;
      }

      await loadCollection();
    } catch (err: any) {
      console.error('Error removing from collection:', err);
      setError(err.message || 'Failed to remove from collection');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCollection = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setCollection([]);
        return;
      }

      const { data, error: queryError } = await supabase
        .from('user_collections')
        .select('*, sneakers(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (queryError) {
        throw queryError;
      }

      setCollection(data || []);
    } catch (err: any) {
      console.error('Error loading collection:', err);
      setError(err.message || 'Failed to load collection');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    collection,
    loading,
    error,
    addToCollection,
    removeFromCollection,
    loadCollection,
  };
};
