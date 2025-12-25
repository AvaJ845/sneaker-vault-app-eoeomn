
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Platform, Alert } from 'react-native';
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
  isVerified?: boolean;
}

const mockCollection: CollectionItem[] = [
  {
    id: '1',
    brand: 'Nike',
    model: 'Air Jordan 1 Retro High',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    purchasePrice: 170,
    currentValue: 450,
    isVerified: true,
  },
  {
    id: '2',
    brand: 'Adidas',
    model: 'Yeezy Boost 350 V2',
    imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop',
    purchasePrice: 220,
    currentValue: 380,
    isVerified: false,
  },
  {
    id: '3',
    brand: 'Nike',
    model: 'Air Max 90',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
    purchasePrice: 130,
    currentValue: 150,
    isVerified: true,
  },
  {
    id: '4',
    brand: 'New Balance',
    model: '990v5',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop',
    purchasePrice: 185,
    currentValue: 200,
    isVerified: false,
  },
];

export default function CollectionScreen() {
  const [collection, setCollection] = useState<CollectionItem[]>(mockCollection);

  const totalValue = collection.reduce((sum, item) => sum + item.currentValue, 0);
  const totalInvestment = collection.reduce((sum, item) => sum + item.purchasePrice, 0);
  const totalGain = totalValue - totalInvestment;
  const gainPercentage = ((totalGain / totalInvestment) * 100).toFixed(1);

  const handleVerify = (itemId: string) => {
    console.log('Verify item:', itemId);
    Alert.alert(
      'Blockchain Verification',
      'Verify your sneaker authenticity on the XRP Ledger blockchain.\n\nThis feature requires:\n• Supabase backend connection\n• XRP Ledger integration\n• NFT minting capability\n\nWould you like to proceed?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Learn More', onPress: () => console.log('Learn more about verification') },
        { text: 'Verify Now', onPress: () => {
          Alert.alert('Coming Soon', 'Blockchain verification will be available soon. Enable Supabase to get started!');
        }},
      ]
    );
  };

  const renderItem = ({ item }: { item: CollectionItem }) => {
    const gain = item.currentValue - item.purchasePrice;
    const gainPercent = ((gain / item.purchasePrice) * 100).toFixed(1);
    const isPositive = gain >= 0;

    return (
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        
        {item.isVerified && (
          <View style={styles.verifiedBadge}>
            <IconSymbol ios_icon_name="checkmark.seal.fill" android_material_icon_name="verified" size={20} color={colors.secondary} />
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
                {isPositive ? '+' : ''}${gain}
              </Text>
              <Text style={[styles.gainPercent, isPositive ? styles.gainPositive : styles.gainNegative]}>
                ({isPositive ? '+' : ''}{gainPercent}%)
              </Text>
            </View>
          </View>

          {!item.isVerified && (
            <TouchableOpacity style={styles.verifyButton} onPress={() => handleVerify(item.id)}>
              <IconSymbol ios_icon_name="checkmark.shield" android_material_icon_name="verified-user" size={14} color={colors.primary} />
              <Text style={styles.verifyText}>Verify on Blockchain</Text>
            </TouchableOpacity>
          )}
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
    marginBottom: 8,
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
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSecondary,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  verifyText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primary,
  },
});
