
import { useState, useEffect, useCallback } from 'react';
import { SneakerDatabase, SearchFilters, AddSneakerForm } from '@/types/database';
import { getSneakers, searchSneakers, getSneakerById } from '@/data/sneakerDatabase';

// This hook manages the sneaker database
// Currently uses local data, but can be easily connected to Supabase
export const useSneakerDatabase = () => {
  const [sneakers, setSneakers] = useState<SneakerDatabase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  const loadSneakers = useCallback(
    async (filters?: SearchFilters, pageNum: number = 1) => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API delay for realistic feel
        await new Promise((resolve) => setTimeout(resolve, 300));

        const result = getSneakers(pageNum, 20, filters);

        if (pageNum === 1) {
          setSneakers(result.sneakers);
        } else {
          setSneakers((prev) => [...prev, ...result.sneakers]);
        }

        setHasMore(result.hasMore);
        setTotal(result.total);
        setPage(pageNum);
      } catch (err) {
        console.error('Error loading sneakers:', err);
        setError('Failed to load sneakers');
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

  const search = useCallback((query: string) => {
    setLoading(true);
    setError(null);

    try {
      const results = searchSneakers(query);
      setSneakers(results);
      setTotal(results.length);
      setHasMore(false);
    } catch (err) {
      console.error('Error searching sneakers:', err);
      setError('Failed to search sneakers');
    } finally {
      setLoading(false);
    }
  }, []);

  const getSneaker = useCallback((id: string) => {
    return getSneakerById(id);
  }, []);

  // Function to add a user-generated sneaker
  // This will need Supabase integration to work
  const addSneaker = useCallback(async (form: AddSneakerForm) => {
    console.log('Add sneaker:', form);
    
    // TODO: Implement Supabase integration
    // const { data, error } = await supabase
    //   .from('sneakers')
    //   .insert([{
    //     ...form,
    //     isCurated: false,
    //     addedBy: user.id,
    //     verificationStatus: 'pending',
    //     popularity: 0,
    //     createdAt: new Date().toISOString(),
    //     updatedAt: new Date().toISOString(),
    //   }])
    
    throw new Error('Supabase integration required. Please enable Supabase to add sneakers.');
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
  };
};

// Hook for managing user's personal collection
export const useUserCollection = () => {
  const [collection, setCollection] = useState<SneakerDatabase[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCollection = useCallback(async (sneakerId: string) => {
    console.log('Add to collection:', sneakerId);
    
    // TODO: Implement Supabase integration
    // const { data, error } = await supabase
    //   .from('user_collection')
    //   .insert([{
    //     userId: user.id,
    //     sneakerId: sneakerId,
    //     addedAt: new Date().toISOString(),
    //   }])
    
    throw new Error('Supabase integration required. Please enable Supabase to manage collections.');
  }, []);

  const removeFromCollection = useCallback(async (sneakerId: string) => {
    console.log('Remove from collection:', sneakerId);
    
    // TODO: Implement Supabase integration
    throw new Error('Supabase integration required. Please enable Supabase to manage collections.');
  }, []);

  const loadCollection = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement Supabase integration
      // const { data, error } = await supabase
      //   .from('user_collection')
      //   .select('*, sneakers(*)')
      //   .eq('userId', user.id)
      
      setCollection([]);
    } catch (err) {
      console.error('Error loading collection:', err);
      setError('Failed to load collection');
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
