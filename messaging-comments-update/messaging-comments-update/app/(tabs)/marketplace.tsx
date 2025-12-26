
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

interface MarketplaceItem {
  id: string;
  brand: string;
  model: string;
  imageUrl: string;
  price: number;
  size: string;
  condition: string;
  seller: string;
  sellerRating: number;
}

const mockMarketplace: MarketplaceItem[] = [
  {
    id: '1',
    brand: 'Nike',
    model: 'Air Jordan 1 Retro High',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    price: 450,
    size: '10.5',
    condition: 'New',
    seller: 'sneaker_king',
    sellerRating: 4.8,
  },
  {
    id: '2',
    brand: 'Adidas',
    model: 'Yeezy Boost 350 V2',
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop',
    price: 380,
    size: '11',
    condition: 'Like New',
    seller: 'yeezy_collector',
    sellerRating: 4.9,
  },
  {
    id: '3',
    brand: 'Nike',
    model: 'Air Max 90',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    price: 150,
    size: '9',
    condition: 'Good',
    seller: 'kicks_trader',
    sellerRating: 4.6,
  },
  {
    id: '4',
    brand: 'New Balance',
    model: '990v5',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
    price: 200,
    size: '10',
    condition: 'New',
    seller: 'nb_enthusiast',
    sellerRating: 4.7,
  },
  {
    id: '5',
    brand: 'Nike',
    model: 'Dunk Low',
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
    price: 180,
    size: '11.5',
    condition: 'New',
    seller: 'dunk_master',
    sellerRating: 5.0,
  },
  {
    id: '6',
    brand: 'Jordan',
    model: 'Air Jordan 4',
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&h=400&fit=crop',
    price: 380,
    size: '10',
    condition: 'Like New',
    seller: 'jordan_vault',
    sellerRating: 4.9,
  },
];

export default function MarketplaceScreen() {
  const [marketplace] = useState<MarketplaceItem[]>(mockMarketplace);

  const handleItemPress = (item: MarketplaceItem) => {
    console.log('Item pressed:', item.id);
    Alert.alert(
      item.model,
      `${item.brand} ${item.model}\n\nPrice: $${item.price}\nSize: ${item.size}\nCondition: ${item.condition}\n\nSeller: ${item.seller}\nRating: ${item.sellerRating}⭐`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Message Seller', onPress: () => console.log('Message seller') },
        { text: 'Buy with XRP', onPress: () => {
          Alert.alert('XRP Payment', 'XRP Ledger payment integration coming soon! Enable Supabase to get started.');
        }},
      ]
    );
  };

  const renderItem = ({ item }: { item: MarketplaceItem }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleItemPress(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.conditionBadge}>
        <Text style={styles.conditionText}>{item.condition}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.model} numberOfLines={2}>
          {item.model}
        </Text>
        <View style={styles.detailsRow}>
          <Text style={styles.size}>Size {item.size}</Text>
          <View style={styles.ratingContainer}>
            <IconSymbol ios_icon_name="star.fill" android_material_icon_name="star" size={12} color={colors.accent} />
            <Text style={styles.rating}>{item.sellerRating}</Text>
          </View>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>${item.price}</Text>
          <TouchableOpacity style={styles.xrpButton}>
            <Text style={styles.xrpText}>XRP</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Marketplace</Text>
            <Text style={styles.subtitle}>Buy & sell with XRP</Text>
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <IconSymbol ios_icon_name="slider.horizontal.3" android_material_icon_name="tune" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={marketplace}
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
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  filterButton: {
    padding: 8,
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
  conditionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  conditionText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
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
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  size: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  xrpButton: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xrpText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
  },
});
