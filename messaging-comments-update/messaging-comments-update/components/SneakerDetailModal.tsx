
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { SneakerDatabase } from '@/types/database';

interface SneakerDetailModalProps {
  visible: boolean;
  sneaker: SneakerDatabase | null;
  onClose: () => void;
  onAddToCollection?: (sneaker: SneakerDatabase) => void;
}

const { width } = Dimensions.get('window');

export default function SneakerDetailModal({
  visible,
  sneaker,
  onClose,
  onAddToCollection,
}: SneakerDetailModalProps) {
  if (!sneaker) return null;

  const releaseYear = new Date(sneaker.releaseDate).getFullYear();
  const valueChange = sneaker.estimatedValue - sneaker.retailPrice;
  const valueChangePercent = ((valueChange / sneaker.retailPrice) * 100).toFixed(0);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol
              ios_icon_name="xmark"
              android_material_icon_name="close"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sneaker Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Image */}
          <Image source={{ uri: sneaker.imageUrl }} style={styles.image} />

          {/* Badges */}
          <View style={styles.badgesContainer}>
            {sneaker.isCurated && (
              <View style={styles.badge}>
                <IconSymbol
                  ios_icon_name="checkmark.seal.fill"
                  android_material_icon_name="verified"
                  size={16}
                  color={colors.secondary}
                />
                <Text style={styles.badgeText}>Curated</Text>
              </View>
            )}
            {sneaker.verificationStatus === 'verified' && (
              <View style={[styles.badge, styles.verifiedBadge]}>
                <IconSymbol
                  ios_icon_name="checkmark.shield.fill"
                  android_material_icon_name="verified-user"
                  size={16}
                  color={colors.success}
                />
                <Text style={styles.badgeText}>Verified</Text>
              </View>
            )}
          </View>

          {/* Main Info */}
          <View style={styles.mainInfo}>
            <Text style={styles.brand}>{sneaker.brand}</Text>
            <Text style={styles.model}>{sneaker.model}</Text>
            <Text style={styles.colorway}>{sneaker.colorway}</Text>
          </View>

          {/* Price Info */}
          <View style={styles.priceCard}>
            <View style={styles.priceRow}>
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Retail Price</Text>
                <Text style={styles.priceValue}>${sneaker.retailPrice}</Text>
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Est. Value</Text>
                <Text style={[styles.priceValue, styles.estimatedValue]}>
                  ${sneaker.estimatedValue.toLocaleString()}
                </Text>
              </View>
            </View>
            <View style={styles.valueChangeContainer}>
              <IconSymbol
                ios_icon_name={valueChange >= 0 ? 'arrow.up.right' : 'arrow.down.right'}
                android_material_icon_name={valueChange >= 0 ? 'trending-up' : 'trending-down'}
                size={20}
                color={valueChange >= 0 ? colors.success : colors.error}
              />
              <Text
                style={[
                  styles.valueChange,
                  valueChange >= 0 ? styles.valueChangePositive : styles.valueChangeNegative,
                ]}
              >
                {valueChange >= 0 ? '+' : ''}${valueChange.toLocaleString()} ({valueChangePercent}%)
              </Text>
            </View>
          </View>

          {/* Details Grid */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>SKU</Text>
              <Text style={styles.detailValue}>{sneaker.sku}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Release Year</Text>
              <Text style={styles.detailValue}>{releaseYear}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{sneaker.category}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Silhouette</Text>
              <Text style={styles.detailValue}>{sneaker.silhouette}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Popularity</Text>
              <View style={styles.popularityBar}>
                <View style={[styles.popularityFill, { width: `${sneaker.popularity}%` }]} />
              </View>
              <Text style={styles.detailValue}>{sneaker.popularity}/100</Text>
            </View>
          </View>

          {/* Description */}
          {sneaker.description && (
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionTitle}>About</Text>
              <Text style={styles.descriptionText}>{sneaker.description}</Text>
            </View>
          )}

          {/* Tags */}
          <View style={styles.tagsCard}>
            <Text style={styles.tagsTitle}>Tags</Text>
            <View style={styles.tagsContainer}>
              {sneaker.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {onAddToCollection && (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => onAddToCollection(sneaker)}
              >
                <IconSymbol
                  ios_icon_name="plus.circle.fill"
                  android_material_icon_name="add-circle"
                  size={20}
                  color={colors.text}
                />
                <Text style={styles.primaryButtonText}>Add to Collection</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.secondaryButton}>
              <IconSymbol
                ios_icon_name="square.and.arrow.up"
                android_material_icon_name="share"
                size={20}
                color={colors.primary}
              />
              <Text style={styles.secondaryButtonText}>Share</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: width,
    height: width,
    backgroundColor: colors.backgroundSecondary,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  verifiedBadge: {
    borderColor: colors.success,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  mainInfo: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  brand: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  model: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
    marginTop: 4,
    letterSpacing: -0.5,
  },
  colorway: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
  },
  priceCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  priceItem: {
    alignItems: 'center',
  },
  priceDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  priceLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  estimatedValue: {
    color: colors.success,
  },
  valueChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  valueChange: {
    fontSize: 16,
    fontWeight: '700',
  },
  valueChangePositive: {
    color: colors.success,
  },
  valueChangeNegative: {
    color: colors.error,
  },
  detailsGrid: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  popularityBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 3,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  popularityFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  descriptionCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  tagsCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  bottomSpacer: {
    height: 40,
  },
});
