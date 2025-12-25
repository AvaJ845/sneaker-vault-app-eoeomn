
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { SneakerDrop } from '@/types/drop';
import { mockDrops } from '@/data/mockDrops';

export default function DropsScreen() {
  const [drops, setDrops] = useState<SneakerDrop[]>(mockDrops);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'sold-out'>('all');

  const filteredDrops = drops.filter((drop) => {
    if (filter === 'all') return true;
    return drop.status === filter;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffDays > 7) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (diffDays > 0) {
      return `${diffDays}d`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else if (diffMs > 0) {
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      return `${diffMinutes}m`;
    } else {
      return 'Now';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return colors.success;
      case 'upcoming':
        return colors.secondary;
      case 'sold-out':
        return colors.error;
      case 'restocking':
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'live':
        return 'LIVE NOW';
      case 'upcoming':
        return 'UPCOMING';
      case 'sold-out':
        return 'SOLD OUT';
      case 'restocking':
        return 'RESTOCKING';
      default:
        return status.toUpperCase();
    }
  };

  const handleDropPress = (drop: SneakerDrop) => {
    console.log('Drop pressed:', drop.id);
    Alert.alert(
      drop.model,
      `${drop.brand} ${drop.model}\n${drop.colorway}\n\nRetail: $${drop.price}\nEstimated Resale: $${drop.estimatedResaleValue || 'N/A'}\n\nRetailer: ${drop.retailer}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Set Reminder', onPress: () => console.log('Reminder set') },
        drop.productLink || drop.raffleLink
          ? { text: 'View on Site', onPress: () => console.log('Open link') }
          : null,
      ].filter(Boolean) as any
    );
  };

  const renderDrop = ({ item }: { item: SneakerDrop }) => {
    const profit = item.estimatedResaleValue ? item.estimatedResaleValue - item.price : 0;
    const profitPercent = item.estimatedResaleValue
      ? (((item.estimatedResaleValue - item.price) / item.price) * 100).toFixed(0)
      : 0;

    return (
      <TouchableOpacity style={styles.dropCard} onPress={() => handleDropPress(item)}>
        <Image source={{ uri: item.imageUrl }} style={styles.dropImage} />
        
        {item.isHyped && (
          <View style={styles.hypedBadge}>
            <IconSymbol ios_icon_name="flame.fill" android_material_icon_name="local-fire-department" size={14} color="#FFF" />
            <Text style={styles.hypedText}>HYPED</Text>
          </View>
        )}

        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>

        <View style={styles.dropInfo}>
          <View style={styles.dropHeader}>
            <Text style={styles.dropBrand}>{item.brand}</Text>
            <Text style={styles.dropDate}>{formatDate(item.releaseDate)}</Text>
          </View>
          
          <Text style={styles.dropModel} numberOfLines={1}>
            {item.model}
          </Text>
          <Text style={styles.dropColorway} numberOfLines={1}>
            {item.colorway}
          </Text>

          <View style={styles.dropFooter}>
            <View>
              <Text style={styles.priceLabel}>Retail</Text>
              <Text style={styles.price}>${item.price}</Text>
            </View>
            
            {item.estimatedResaleValue && (
              <View style={styles.resaleInfo}>
                <Text style={styles.resaleLabel}>Est. Resale</Text>
                <View style={styles.resaleRow}>
                  <Text style={styles.resalePrice}>${item.estimatedResaleValue}</Text>
                  <Text style={[styles.profit, profit > 0 ? styles.profitPositive : styles.profitNegative]}>
                    +{profitPercent}%
                  </Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.retailerBadge}>
            <IconSymbol ios_icon_name="storefront.fill" android_material_icon_name="storefront" size={12} color={colors.textSecondary} />
            <Text style={styles.retailerText}>{item.retailer}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Drops</Text>
            <Text style={styles.subtitle}>Track major retailer releases</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <IconSymbol ios_icon_name="bell.fill" android_material_icon_name="notifications" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'live' && styles.filterButtonActive]}
            onPress={() => setFilter('live')}
          >
            <Text style={[styles.filterText, filter === 'live' && styles.filterTextActive]}>Live</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'upcoming' && styles.filterButtonActive]}
            onPress={() => setFilter('upcoming')}
          >
            <Text style={[styles.filterText, filter === 'upcoming' && styles.filterTextActive]}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'sold-out' && styles.filterButtonActive]}
            onPress={() => setFilter('sold-out')}
          >
            <Text style={[styles.filterText, filter === 'sold-out' && styles.filterTextActive]}>Sold Out</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredDrops}
          renderItem={renderDrop}
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
  notificationButton: {
    padding: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
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
  dropCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    width: '48%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropImage: {
    width: '100%',
    height: 160,
    backgroundColor: colors.backgroundSecondary,
  },
  hypedBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  hypedText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFF',
  },
  dropInfo: {
    padding: 12,
  },
  dropHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dropBrand: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  dropDate: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.secondary,
  },
  dropModel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  dropColorway: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  dropFooter: {
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
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
  },
  resaleInfo: {
    alignItems: 'flex-end',
  },
  resaleLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  resaleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resalePrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  profit: {
    fontSize: 10,
    fontWeight: '700',
  },
  profitPositive: {
    color: colors.success,
  },
  profitNegative: {
    color: colors.error,
  },
  retailerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  retailerText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
