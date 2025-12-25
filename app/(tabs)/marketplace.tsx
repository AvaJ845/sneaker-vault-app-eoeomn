
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Platform } from 'react-native';
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

const mockListings: MarketplaceItem[] = [
  {
    id: '1',
    brand: 'Nike',
    model: 'Air Jordan 1 Chicago',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    price: 1200,
    size: '10.5',
    condition: 'New',
    seller: 'sneaker_king',
    sellerRating: 4.8,
  },
  {
    id: '2',
    brand: 'Adidas',
    model: 'Yeezy Boost 700',
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop',
    price: 450,
    size: '11',
    condition: 'Like New',
    seller: 'yeezy_collector',
    sellerRating: 4.9,
  },
  {
    id: '3',
    brand: 'Nike',
    model: 'Dunk Low Panda',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    price: 180,
    size: '9',
    condition: 'New',
    seller: 'dunk_master',
    sellerRating: 4.7,
  },
  {
    id: '4',
    brand: 'New Balance',
    model: '550 White Green',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
    price: 140,
    size: '10',
    condition: 'Good',
    seller: 'nb_enthusiast',
    sellerRating: 4.6,
  },
  {
    id: '5',
    brand: 'Nike',
    model: 'Air Max 97 Silver Bullet',
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop',
    price: 220,
    size: '11.5',
    condition: 'Like New',
    seller: 'airmax_fan',
    sellerRating: 4.8,
  },
  {
    id: '6',
    brand: 'Jordan',
    model: 'Air Jordan 4 Military Black',
    imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&h=400&fit=crop',
    price: 350,
    size: '10',
    condition: 'New',
    seller: 'jordan_vault',
    sellerRating: 5.0,
  },
];

export default function MarketplaceScreen() {
  const [listings] = useState<MarketplaceItem[]>(mockListings);

  const renderItem = ({ item }: { item: MarketplaceItem }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{item.condition}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.model} numberOfLines={2}>
          {item.model}
        </Text>
        <View style={styles.detailsRow}>
          <View style={styles.sizeContainer}>
            <Text style={styles.sizeLabel}>Size</Text>
            <Text style={styles.sizeValue}>{item.size}</Text>
          </View>
          <Text style={styles.price}>${item.price}</Text>
        </View>
        <View style={styles.sellerRow}>
          <IconSymbol ios_icon_name="person.circle" android_material_icon_name="account-circle" size={16} color={colors.textSecondary} />
          <Text style={styles.seller}>{item.seller}</Text>
          <IconSymbol ios_icon_name="star.fill" android_material_icon_name="star" size={14} color={colors.accent} />
          <Text style={styles.rating}>{item.sellerRating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Marketplace</Text>
          <TouchableOpacity style={styles.filterButton}>
            <IconSymbol ios_icon_name="slider.horizontal.3" android_material_icon_name="tune" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={listings}
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  filterButton: {
    padding: 4,
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
    borderRadius: 12,
    overflow: 'hidden',
    width: '48%',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 150,
    backgroundColor: colors.border,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: colors.card,
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 12,
  },
  brand: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 2,
  },
  model: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sizeLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  sizeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seller: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
});
