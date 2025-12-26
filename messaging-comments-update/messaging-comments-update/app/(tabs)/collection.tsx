
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/lib/supabase';
import EnhancedSneakerDetailModal from '@/components/EnhancedSneakerDetailModal';
import { router } from 'expo-router';

interface CollectionItemDisplay {
  id: string;
  sneaker_id: string;
  brand: string;
  model: string;
  imageUrl: string;
  purchasePrice: number;
  currentValue: number;
  isVerified?: boolean;
  wear_count: number;
}

export default function CollectionScreen() {
  const [collection, setCollection] = useState<CollectionItemDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadCollection();
  }, []);

  const loadCollection = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('user_collections')
        .select(`
          id,
          sneaker_id,
          purchase_price,
          wear_count,
          sneakers (
            id,
            brand,
            model,
            image_url,
            estimated_value
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading collection:', error);
        setLoading(false);
        return;
      }

      const formattedCollection: CollectionItemDisplay[] = (data || []).map((item: any) => ({
        id: item.id,
        sneaker_id: item.sneaker_id,
        brand: item.sneakers?.brand || 'Unknown',
        model: item.sneakers?.model || 'Unknown',
        imageUrl: item.sneakers?.image_url || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        purchasePrice: item.purchase_price || 0,
        currentValue: item.sneakers?.estimated_value || 0,
        isVerified: false,
        wear_count: item.wear_count || 0,
      }));

      setCollection(formattedCollection);
    } catch (error) {
      console.error('Error loading collection:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalValue = collection.reduce((sum, item) => sum + item.currentValue, 0);
  const totalInvestment = collection.reduce((sum, item) => sum + item.purchasePrice, 0);
  const totalGain = totalValue - totalInvestment;
  const gainPercentage = totalInvestment > 0 ? ((totalGain / totalInvestment) * 100).toFixed(1) : '0.0';

  const renderItem = ({ item }: { item: CollectionItemDisplay }) => {
    const gain = item.currentValue - item.purchasePrice;
    const gainPercent = item.purchasePrice > 0 ? ((gain / item.purchasePrice) * 100).toFixed(1) : '0.0';
    const isPositive = gain >= 0;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => {
          setSelectedItemId(item.id);
          setModalVisible(true);
        }}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        
        {item.isVerified && (
          <View style={styles.verifiedBadge}>
            <IconSymbol ios_icon_name="checkmark.seal.fill" android_material_icon_name="verified" size={20} color={colors.secondary} />
          </View>
        )}

        {item.wear_count > 0 && (
          <View style={styles.wearBadge}>
            <IconSymbol ios_icon_name="figure.walk" android_material_icon_name="directions-walk" size={12} color={colors.text} />
            <Text style={styles.wearText}>{item.wear_count}x</Text>
          </View>
        )}

        <View style={styles.cardContent}>
          <Text style={styles.brand}>{item.brand}</Text>
          <Text style={styles.model} numberOfLines={2}>
            {item.model}
          </Text>
          <View style={styles.priceRow}>
            <View>
              <Text style={styles.priceLabel}>Current Value</Text>
              <Text style={styles.currentValue}>${item.currentValue}</Text>
            </View>
            <View style={styles.gainContainer}>
              <Text style={[styles.gain, isPositive ? styles.gainPositive : styles.gainNegative]}>
                {isPositive ? '+' : ''}${Math.abs(gain)}
              </Text>
              <Text style={[styles.gainPercent, isPositive ? styles.gainPositive : styles.gainNegative]}>
                ({isPositive ? '+' : ''}{gainPercent}%)
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>My Collection</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(tabs)/database')}>
            <IconSymbol ios_icon_name="plus.circle.fill" android_material_icon_name="add-circle" size={32} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Items</Text>
            <Text style={styles.statValue}>{collection.length}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Value</Text>
            <Text style={styles.statValue}>${totalValue.toLocaleString()}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Gain</Text>
            <Text style={[styles.statValue, totalGain >= 0 ? styles.gainPositive : styles.gainNegative]}>
              {totalGain >= 0 ? '+' : ''}${Math.abs(totalGain).toLocaleString()}
            </Text>
            <Text style={[styles.statPercent, totalGain >= 0 ? styles.gainPositive : styles.gainNegative]}>
              ({totalGain >= 0 ? '+' : ''}{gainPercentage}%)
            </Text>
          </View>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading collection...</Text>
          </View>
        ) : collection.length === 0 ? (
          <View style={styles.emptyContainer}>
            <IconSymbol
              ios_icon_name="shippingbox"
              android_material_icon_name="inventory"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>Your collection is empty</Text>
            <Text style={styles.emptySubtext}>
              Browse the database and add sneakers to your vault
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
            data={collection}
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

      <EnhancedSneakerDetailModal
        visible={modalVisible}
        collectionItemId={selectedItemId}
        onClose={() => {
          setModalVisible(false);
          setSelectedItemId(null);
          loadCollection();
        }}
      />
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
  addButton: {
    padding: 4,
  },
  statsCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.4)',
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  statPercent: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
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
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 4,
  },
  wearBadge: {
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
  wearText: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.text,
  },
  cardContent: {
    padding: 12,
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
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 10,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  currentValue: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  gainContainer: {
    alignItems: 'flex-end',
  },
  gain: {
    fontSize: 14,
    fontWeight: '700',
  },
  gainPercent: {
    fontSize: 10,
    fontWeight: '700',
  },
  gainPositive: {
    color: colors.success,
  },
  gainNegative: {
    color: colors.error,
  },
});
