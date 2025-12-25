
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { SneakerDatabase, SearchFilters } from '@/types/database';
import { sneakerBrands } from '@/data/sneakerDatabase';
import SneakerDetailModal from '@/components/SneakerDetailModal';
import AddSneakerForm from '@/components/AddSneakerForm';
import { AddSneakerForm as AddSneakerFormType } from '@/types/database';
import { useSneakerDatabase } from '@/hooks/useSneakerDatabase';

export default function DatabaseScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<SearchFilters['sortBy']>('popularity');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSneaker, setSelectedSneaker] = useState<SneakerDatabase | null>(null);

  const { sneakers, loading, total, hasMore, loadSneakers, loadMore, addSneaker, getStats } = useSneakerDatabase();

  const filters: SearchFilters = {
    brand: selectedBrand,
    category: selectedCategory,
    searchQuery: searchQuery,
    sortBy: sortBy,
  };

  // Load initial data
  useEffect(() => {
    loadSneakers(filters);
  }, []);

  // Reload when filters change
  useEffect(() => {
    loadSneakers(filters);
  }, [selectedBrand, selectedCategory, sortBy, searchQuery]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const handleBrandFilter = (brand: string) => {
    setSelectedBrand(selectedBrand === brand ? undefined : brand);
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(selectedCategory === category ? undefined : category);
  };

  const handleAddSneaker = () => {
    console.log('Add sneaker pressed');
    setShowAddModal(true);
  };

  const handleSubmitSneaker = async (form: AddSneakerFormType) => {
    console.log('Submit sneaker:', form);
    try {
      await addSneaker(form);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error submitting sneaker:', error);
    }
  };

  const handleAddToCollection = (sneaker: SneakerDatabase) => {
    console.log('Add to collection:', sneaker);
    Alert.alert(
      'Add to Collection',
      `Add ${sneaker.model} to your collection?\n\nThis feature requires Supabase backend to save your collection.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Enable Supabase',
          onPress: () => {
            Alert.alert(
              'Enable Supabase',
              'Press the Supabase button in the Natively interface to connect your project.'
            );
          },
        },
      ]
    );
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadMore(filters);
    }
  };

  const stats = getStats();

  const renderSneakerCard = ({ item }: { item: SneakerDatabase }) => (
    <TouchableOpacity style={styles.sneakerCard} onPress={() => setSelectedSneaker(item)}>
      <Image source={{ uri: item.imageUrl }} style={styles.sneakerImage} />
      {item.isCurated && (
        <View style={styles.curatedBadge}>
          <IconSymbol
            ios_icon_name="checkmark.seal.fill"
            android_material_icon_name="verified"
            size={16}
            color={colors.secondary}
          />
        </View>
      )}
      {!item.isCurated && (
        <View style={styles.userBadge}>
          <IconSymbol
            ios_icon_name="person.fill"
            android_material_icon_name="person"
            size={12}
            color={colors.primary}
          />
        </View>
      )}
      <View style={styles.sneakerInfo}>
        <Text style={styles.sneakerBrand}>{item.brand}</Text>
        <Text style={styles.sneakerModel} numberOfLines={2}>
          {item.model}
        </Text>
        <Text style={styles.sneakerColorway} numberOfLines={1}>
          {item.colorway}
        </Text>
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceLabel}>Est. Value</Text>
            <Text style={styles.priceValue}>${item.estimatedValue.toLocaleString()}</Text>
          </View>
          <View style={styles.skuContainer}>
            <Text style={styles.skuLabel}>SKU</Text>
            <Text style={styles.skuValue}>{item.sku}</Text>
          </View>
        </View>
        <View style={styles.tagsContainer}>
          {item.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const categories = ['Basketball', 'Running', 'Lifestyle', 'Training', 'Skateboarding', 'Other'];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Sneaker Database</Text>
            <Text style={styles.subtitle}>
              {total.toLocaleString()} sneakers • {stats.curated} curated • {stats.userGenerated} community
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddSneaker}>
            <IconSymbol
              ios_icon_name="plus.circle.fill"
              android_material_icon_name="add-circle"
              size={32}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <IconSymbol
            ios_icon_name="magnifyingglass"
            android_material_icon_name="search"
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by brand, model, SKU..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <IconSymbol
                ios_icon_name="xmark.circle.fill"
                android_material_icon_name="cancel"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
          contentContainerStyle={styles.filtersContent}
        >
          <TouchableOpacity
            style={[styles.filterChip, showFilters && styles.filterChipActive]}
            onPress={() => setShowFilters(!showFilters)}
          >
            <IconSymbol
              ios_icon_name="slider.horizontal.3"
              android_material_icon_name="tune"
              size={16}
              color={showFilters ? colors.text : colors.textSecondary}
            />
            <Text style={[styles.filterChipText, showFilters && styles.filterChipTextActive]}>
              Filters
            </Text>
          </TouchableOpacity>

          {sneakerBrands.slice(0, 5).map((brand) => (
            <TouchableOpacity
              key={brand.id}
              style={[styles.filterChip, selectedBrand === brand.name && styles.filterChipActive]}
              onPress={() => handleBrandFilter(brand.name)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedBrand === brand.name && styles.filterChipTextActive,
                ]}
              >
                {brand.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Expanded Filters */}
        {showFilters && (
          <View style={styles.expandedFilters}>
            <Text style={styles.filterSectionTitle}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    selectedCategory === category && styles.categoryChipActive,
                  ]}
                  onPress={() => handleCategoryFilter(category)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      selectedCategory === category && styles.categoryChipTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.filterSectionTitle}>Sort By</Text>
            <View style={styles.sortOptions}>
              {[
                { value: 'popularity', label: 'Most Popular' },
                { value: 'price-desc', label: 'Highest Value' },
                { value: 'price-asc', label: 'Lowest Value' },
                { value: 'release-date', label: 'Release Date' },
                { value: 'name', label: 'Name' },
              ].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.sortOption, sortBy === option.value && styles.sortOptionActive]}
                  onPress={() => setSortBy(option.value as SearchFilters['sortBy'])}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      sortBy === option.value && styles.sortOptionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {sortBy === option.value && (
                    <IconSymbol
                      ios_icon_name="checkmark"
                      android_material_icon_name="check"
                      size={16}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Sneaker Grid */}
        <FlatList
          data={sneakers}
          renderItem={renderSneakerCard}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.listContent,
            Platform.OS !== 'ios' && styles.listContentWithTabBar,
          ]}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <IconSymbol
                ios_icon_name="magnifyingglass"
                android_material_icon_name="search-off"
                size={64}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No sneakers found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          }
        />

        {/* Sneaker Detail Modal */}
        <SneakerDetailModal
          visible={selectedSneaker !== null}
          sneaker={selectedSneaker}
          onClose={() => setSelectedSneaker(null)}
          onAddToCollection={handleAddToCollection}
        />

        {/* Add Sneaker Form */}
        <AddSneakerForm
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSubmit={handleSubmitSneaker}
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
  subtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  filtersScroll: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: colors.text,
  },
  expandedFilters: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryChip: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: colors.text,
  },
  sortOptions: {
    gap: 8,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.card,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sortOptionTextActive: {
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
  sneakerCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    width: '48%',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.4)',
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sneakerImage: {
    width: '100%',
    height: 150,
    backgroundColor: colors.backgroundSecondary,
  },
  curatedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 4,
  },
  userBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 6,
  },
  sneakerInfo: {
    padding: 12,
  },
  sneakerBrand: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sneakerModel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  sneakerColorway: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.success,
  },
  skuContainer: {
    alignItems: 'flex-end',
  },
  skuLabel: {
    fontSize: 9,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  skuValue: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 9,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
