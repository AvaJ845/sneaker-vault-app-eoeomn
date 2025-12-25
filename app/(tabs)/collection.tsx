
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

interface CollectionItem {
  id: string;
  brand: string;
  model: string;
  imageUrl: string;
  purchasePrice: number;
  currentValue: number;
}

const mockCollection: CollectionItem[] = [
  {
    id: '1',
    brand: 'Nike',
    model: 'Air Jordan 1 Retro High',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    purchasePrice: 170,
    currentValue: 450,
  },
  {
    id: '2',
    brand: 'Adidas',
    model: 'Yeezy Boost 350 V2',
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop',
    purchasePrice: 220,
    currentValue: 380,
  },
  {
    id: '3',
    brand: 'Nike',
    model: 'Air Max 90',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    purchasePrice: 130,
    currentValue: 150,
  },
  {
    id: '4',
    brand: 'New Balance',
    model: '990v5',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
    purchasePrice: 185,
    currentValue: 200,
  },
];

export default function CollectionScreen() {
  const [collection] = useState<CollectionItem[]>(mockCollection);

  const totalValue = collection.reduce((sum, item) => sum + item.currentValue, 0);
  const totalInvestment = collection.reduce((sum, item) => sum + item.purchasePrice, 0);
  const totalGain = totalValue - totalInvestment;
  const gainPercentage = ((totalGain / totalInvestment) * 100).toFixed(1);

  const renderItem = ({ item }: { item: CollectionItem }) => {
    const gain = item.currentValue - item.purchasePrice;
    const gainPercent = ((gain / item.purchasePrice) * 100).toFixed(1);
    const isPositive = gain >= 0;

    return (
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
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
                {isPositive ? '+' : ''}${gain}
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
          <TouchableOpacity style={styles.addButton}>
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
            <Text style={styles.statValue}>${totalValue}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Gain</Text>
            <Text style={[styles.statValue, totalGain >= 0 ? styles.gainPositive : styles.gainNegative]}>
              {totalGain >= 0 ? '+' : ''}${totalGain}
            </Text>
            <Text style={[styles.statPercent, totalGain >= 0 ? styles.gainPositive : styles.gainNegative]}>
              ({totalGain >= 0 ? '+' : ''}{gainPercentage}%)
            </Text>
          </View>
        </View>

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
  addButton: {
    padding: 4,
  },
  statsCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
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
    fontWeight: 'bold',
    color: colors.text,
  },
  statPercent: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
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
  },
  cardImage: {
    width: '100%',
    height: 150,
    backgroundColor: colors.border,
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
    fontWeight: 'bold',
    color: colors.text,
  },
  gainContainer: {
    alignItems: 'flex-end',
  },
  gain: {
    fontSize: 14,
    fontWeight: '600',
  },
  gainPercent: {
    fontSize: 10,
    fontWeight: '600',
  },
  gainPositive: {
    color: colors.success,
  },
  gainNegative: {
    color: colors.error,
  },
});
