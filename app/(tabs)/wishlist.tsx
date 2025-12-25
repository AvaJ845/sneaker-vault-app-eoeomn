
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/lib/supabase';
import { WishlistItem } from '@/types/collection';
import { router } from 'expo-router';

interface WishlistItemWithSneaker extends WishlistItem {
  sneakers?: {
    id: string;
    brand: string;
    model: string;
    colorway: string;
    image_url: string;
    estimated_value: number;
    retail_price: number;
  };
}

export default function WishlistScreen() {
  const [wishlist, setWishlist] = useState<WishlistItemWithSneaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'grails' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    loadWishlist();
  }, [filter]);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        return;
      }

      let query = supabase
        .from('wishlist')
        .select(`
          *,
          sneakers (
            id,
            brand,
            model,
            colorway,
            image_url,
            estimated_value,
            retail_price
          )
        `)
        .eq('user_id', user.id)
        .order('added_at', { ascending: false });

      if (filter === 'grails') {
        query = query.eq('is_grail', true);
      } else if (filter !== 'all') {
        query = query.eq('priority', filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error loading wishlist:', error);
        return;
      }

      setWishlist(data || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      const { error } = await supabase.from('wishlist').delete().eq('id', itemId);

      if (error) {
        console.error('Error removing from wishlist:', error);
        Alert.alert('Error', 'Failed to remove item from wishlist');
        return;
      }

      setWishlist((prev) => prev.filter((item) => item.id !== itemId));
      Alert.alert('Success', 'Item removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      Alert.alert('Error', 'Failed to remove item from wishlist');
    }
  };

  const toggleGrail = async (item: WishlistItemWithSneaker) => {
    try {
      const { error } = await supabase
        .from('wishlist')
        .update({ is_grail: !item.is_grail })
        .eq('id', item.id);

      if (error) {
        console.error('Error updating grail status:', error);
        return;
      }

      setWishlist((prev) =>
        prev.map((w) => (w.id === item.id ? { ...w, is_grail: !w.is_grail } : w))
      );
    } catch (error) {
      console.error('Error updating grail status:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'grail':
        return colors.secondary;
      case 'high':
        return colors.error;
      case 'medium':
        return colors.primary;
      case 'low':
        return colors.textSecondary;
      default:
        return colors.textSecondary;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'grail':
        return 'star.fill';
      case 'high':
        return 'exclamationmark.3';
      case 'medium':
        return 'exclamationmark.2';
      case 'low':
        return 'minus';
      default:
        return 'minus';
    }
  };

  const renderItem = ({ item }: { item: WishlistItemWithSneaker }) => {
    const targetPrice = item.target_price || 0;
    const currentPrice = item.sneakers?.estimated_value || 0;
    const priceDiff = currentPrice - targetPrice;
    const isUnderTarget = targetPrice > 0 && currentPrice <= targetPrice;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          console.log('View sneaker details:', item.sneaker_id);
        }}
      >
        <Image source={{ uri: item.sneakers?.image_url }} style={styles.cardImage} />

        {item.is_grail && (
          <View style={styles.grailBadge}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={16}
              color={colors.secondary}
            />
            <Text style={styles.grailText}>GRAIL</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.grailButton}
          onPress={() => toggleGrail(item)}
        >
          <IconSymbol
            ios_icon_name={item.is_grail ? 'star.fill' : 'star'}
            android_material_icon_name={item.is_grail ? 'star' : 'star-border'}
            size={20}
            color={item.is_grail ? colors.secondary : colors.textSecondary}
          />
        </TouchableOpacity>

        <View style={styles.cardContent}>
          <View style={styles.priorityRow}>
            <IconSymbol
              ios_icon_name={getPriorityIcon(item.priority)}
              android_material_icon_name="priority-high"
              size={14}
              color={getPriorityColor(item.priority)}
            />
            <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>
              {item.priority.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.brand}>{item.sneakers?.brand}</Text>
          <Text style={styles.model} numberOfLines={2}>
            {item.sneakers?.model}
          </Text>
          <Text style={styles.colorway} numberOfLines={1}>
            {item.sneakers?.colorway}
          </Text>

          {item.size_preference && (
            <Text style={styles.size}>Size: {item.size_preference}</Text>
          )}

          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Current Price</Text>
              <Text style={styles.currentPrice}>${currentPrice.toLocaleString()}</Text>
            </View>
            {targetPrice > 0 && (
              <View style={styles.targetPriceContainer}>
                <Text style={styles.priceLabel}>Target</Text>
                <Text style={styles.targetPrice}>${targetPrice.toLocaleString()}</Text>
                {isUnderTarget && (
                  <View style={styles.alertBadge}>
                    <IconSymbol
                      ios_icon_name="bell.fill"
                      android_material_icon_name="notifications"
                      size={12}
                      color={colors.success}
                    />
                    <Text style={styles.alertText}>Under Target!</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {item.notes && (
            <Text style={styles.notes} numberOfLines={2}>
              {item.notes}
            </Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => {
                Alert.alert(
                  'Remove from Wishlist',
                  'Are you sure you want to remove this item?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Remove', style: 'destructive', onPress: () => removeFromWishlist(item.id) },
                  ]
                );
              }}
            >
              <IconSymbol
                ios_icon_name="trash"
                android_material_icon_name="delete"
                size={16}
                color={colors.error}
              />
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const grailCount = wishlist.filter((item) => item.is_grail).length;
  const highPriorityCount = wishlist.filter((item) => item.priority === 'high').length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Wishlist</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/database')}>
            <IconSymbol
              ios_icon_name="plus.circle.fill"
              android_material_icon_name="add-circle"
              size={32}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBadge}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={16}
              color={colors.secondary}
            />
            <Text style={styles.statText}>{grailCount} Grails</Text>
          </View>
          <View style={styles.statBadge}>
            <IconSymbol
              ios_icon_name="exclamationmark.3"
              android_material_icon_name="priority-high"
              size={16}
              color={colors.error}
            />
            <Text style={styles.statText}>{highPriorityCount} High Priority</Text>
          </View>
        </View>

        <View style={styles.filterContainer}>
          {(['all', 'grails', 'high', 'medium', 'low'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterButton, filter === f && styles.filterButtonActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f === 'all' ? 'All' : f === 'grails' ? 'Grails' : f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading wishlist...</Text>
          </View>
        ) : wishlist.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol
              ios_icon_name="star"
              android_material_icon_name="star-border"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>Your wishlist is empty</Text>
            <Text style={styles.emptySubtext}>
              Browse the database and add sneakers you want to collect
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push('/(tabs)/database')}
            >
              <Text style={styles.browseButtonText}>Browse Database</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={wishlist}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={[
              styles.listContent,
              Platform.OS !== 'ios' && styles.listContentWithTabBar,
            ]}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.text,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  browseButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 24,
  },
  browseButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  listContentWithTabBar: {
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    width: '48%',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.4)',
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardImage: {
    width: '100%',
    height: 150,
    backgroundColor: colors.backgroundSecondary,
  },
  grailBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  grailText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.secondary,
  },
  grailButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 6,
  },
  cardContent: {
    padding: 12,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '900',
  },
  brand: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  model: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  colorway: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  size: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  currentPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  targetPriceContainer: {
    alignItems: 'flex-end',
  },
  targetPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  alertBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
    marginTop: 4,
  },
  alertText: {
    fontSize: 9,
    fontWeight: '900',
    color: colors.text,
  },
  notes: {
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  removeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.error,
  },
});
