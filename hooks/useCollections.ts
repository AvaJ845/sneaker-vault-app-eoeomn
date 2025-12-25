
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Collection, CustomTag, FilterOptions } from '@/types/organization';
import { CollectionItem } from '@/types/collection';

export function useCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('User not authenticated');
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('collections')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setCollections(data || []);
    } catch (err) {
      console.error('Error fetching collections:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch collections');
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async (collection: Partial<Collection>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error: createError } = await supabase
        .from('collections')
        .insert([{ ...collection, user_id: user.id }])
        .select()
        .single();

      if (createError) throw createError;
      
      setCollections(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating collection:', err);
      throw err;
    }
  };

  const updateCollection = async (id: string, updates: Partial<Collection>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('collections')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      
      setCollections(prev => prev.map(c => c.id === id ? data : c));
      return data;
    } catch (err) {
      console.error('Error updating collection:', err);
      throw err;
    }
  };

  const deleteCollection = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('collections')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      setCollections(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting collection:', err);
      throw err;
    }
  };

  const addItemToCollection = async (collectionId: string, itemId: string) => {
    try {
      const { error: insertError } = await supabase
        .from('collection_items')
        .insert([{ collection_id: collectionId, collection_item_id: itemId }]);

      if (insertError) throw insertError;
      
      // Update item count
      const collection = collections.find(c => c.id === collectionId);
      if (collection) {
        await updateCollection(collectionId, { 
          item_count: collection.item_count + 1 
        });
      }
    } catch (err) {
      console.error('Error adding item to collection:', err);
      throw err;
    }
  };

  const removeItemFromCollection = async (collectionId: string, itemId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('collection_items')
        .delete()
        .eq('collection_id', collectionId)
        .eq('collection_item_id', itemId);

      if (deleteError) throw deleteError;
      
      // Update item count
      const collection = collections.find(c => c.id === collectionId);
      if (collection) {
        await updateCollection(collectionId, { 
          item_count: Math.max(0, collection.item_count - 1)
        });
      }
    } catch (err) {
      console.error('Error removing item from collection:', err);
      throw err;
    }
  };

  return {
    collections,
    loading,
    error,
    fetchCollections,
    createCollection,
    updateCollection,
    deleteCollection,
    addItemToCollection,
    removeItemFromCollection,
  };
}

export function useTags() {
  const [tags, setTags] = useState<CustomTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('custom_tags')
        .select('*')
        .eq('user_id', user.id)
        .order('usage_count', { ascending: false });

      if (error) throw error;
      setTags(data || []);
    } catch (err) {
      console.error('Error fetching tags:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTag = async (tag: Partial<CustomTag>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('custom_tags')
        .insert([{ ...tag, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      
      setTags(prev => [data, ...prev]);
      return data;
    } catch (err) {
      console.error('Error creating tag:', err);
      throw err;
    }
  };

  const addTagToItem = async (itemId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from('item_tags')
        .insert([{ collection_item_id: itemId, tag_id: tagId }]);

      if (error) throw error;
      
      // Increment usage count
      const tag = tags.find(t => t.id === tagId);
      if (tag) {
        await supabase
          .from('custom_tags')
          .update({ usage_count: tag.usage_count + 1 })
          .eq('id', tagId);
        
        setTags(prev => prev.map(t => 
          t.id === tagId ? { ...t, usage_count: t.usage_count + 1 } : t
        ));
      }
    } catch (err) {
      console.error('Error adding tag to item:', err);
      throw err;
    }
  };

  const removeTagFromItem = async (itemId: string, tagId: string) => {
    try {
      const { error } = await supabase
        .from('item_tags')
        .delete()
        .eq('collection_item_id', itemId)
        .eq('tag_id', tagId);

      if (error) throw error;
      
      // Decrement usage count
      const tag = tags.find(t => t.id === tagId);
      if (tag) {
        await supabase
          .from('custom_tags')
          .update({ usage_count: Math.max(0, tag.usage_count - 1) })
          .eq('id', tagId);
        
        setTags(prev => prev.map(t => 
          t.id === tagId ? { ...t, usage_count: Math.max(0, t.usage_count - 1) } : t
        ));
      }
    } catch (err) {
      console.error('Error removing tag from item:', err);
      throw err;
    }
  };

  return {
    tags,
    loading,
    fetchTags,
    createTag,
    addTagToItem,
    removeTagFromItem,
  };
}

export function useAdvancedFilters() {
  const [filters, setFilters] = useState<FilterOptions>({});

  const applyFilters = async (items: CollectionItem[], filterOptions: FilterOptions) => {
    let filtered = [...items];

    // Filter by collections
    if (filterOptions.collections && filterOptions.collections.length > 0) {
      const { data: collectionItems } = await supabase
        .from('collection_items')
        .select('collection_item_id')
        .in('collection_id', filterOptions.collections);
      
      const itemIds = collectionItems?.map(ci => ci.collection_item_id) || [];
      filtered = filtered.filter(item => itemIds.includes(item.id));
    }

    // Filter by tags
    if (filterOptions.tags && filterOptions.tags.length > 0) {
      const { data: taggedItems } = await supabase
        .from('item_tags')
        .select('collection_item_id')
        .in('tag_id', filterOptions.tags);
      
      const itemIds = taggedItems?.map(ti => ti.collection_item_id) || [];
      filtered = filtered.filter(item => itemIds.includes(item.id));
    }

    // Filter by price range
    if (filterOptions.priceRange) {
      const [min, max] = filterOptions.priceRange;
      filtered = filtered.filter(item => 
        item.purchase_price >= min && item.purchase_price <= max
      );
    }

    // Filter by wear count range
    if (filterOptions.wearCountRange) {
      const [min, max] = filterOptions.wearCountRange;
      filtered = filtered.filter(item => 
        item.wear_count >= min && item.wear_count <= max
      );
    }

    // Filter by condition
    if (filterOptions.conditions && filterOptions.conditions.length > 0) {
      filtered = filtered.filter(item => 
        filterOptions.conditions!.includes(item.condition)
      );
    }

    // Filter by for sale
    if (filterOptions.forSale !== undefined) {
      filtered = filtered.filter(item => item.is_for_sale === filterOptions.forSale);
    }

    // Sort
    if (filterOptions.sortBy) {
      filtered.sort((a, b) => {
        let aVal: any, bVal: any;
        
        switch (filterOptions.sortBy) {
          case 'date':
            aVal = new Date(a.purchase_date).getTime();
            bVal = new Date(b.purchase_date).getTime();
            break;
          case 'value':
            aVal = a.purchase_price;
            bVal = b.purchase_price;
            break;
          case 'wear_count':
            aVal = a.wear_count;
            bVal = b.wear_count;
            break;
          default:
            return 0;
        }
        
        return filterOptions.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });
    }

    return filtered;
  };

  return {
    filters,
    setFilters,
    applyFilters,
  };
}
