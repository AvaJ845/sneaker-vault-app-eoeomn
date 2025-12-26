
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

interface UserPost {
  id: string;
  imageUrl: string;
}

const mockUserPosts: UserPost[] = [
  { id: '1', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop' },
  { id: '2', imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop' },
  { id: '3', imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop' },
  { id: '4', imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop' },
  { id: '5', imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop' },
  { id: '6', imageUrl: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=400&h=400&fit=crop' },
];

const { width } = Dimensions.get('window');
const shelfWidth = (width - 48) / 3;

export default function ProfileScreen() {
  const [posts] = useState<UserPost[]>(mockUserPosts);
  const [activeTab, setActiveTab] = useState<'shelf' | 'grid'>('shelf');

  const renderShelfItem = (item: UserPost, index: number) => (
    <TouchableOpacity key={item.id} style={styles.shelfItem}>
      <View style={styles.shelfPedestal}>
        <View style={styles.pedestalTop} />
        <View style={styles.pedestalBase} />
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.shelfImage} />
      <View style={styles.shelfShadow} />
    </TouchableOpacity>
  );

  const renderGridItem = (item: UserPost, index: number) => (
    <TouchableOpacity key={item.id} style={styles.gridItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.gridImage} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.username}>@sneaker_vault_pro</Text>
          <TouchableOpacity>
            <IconSymbol ios_icon_name="line.3.horizontal" android_material_icon_name="menu" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Section with Gradient */}
        <LinearGradient
          colors={[colors.concrete, colors.background]}
          style={styles.profileGradient}
        >
          <View style={styles.profileSection}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGradient}
            >
              <View style={styles.avatarInner}>
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop' }}
                  style={styles.avatar}
                />
              </View>
            </LinearGradient>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>42</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>1.2K</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>856</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.bioSection}>
            <Text style={styles.displayName}>Sneaker Vault Pro</Text>
            <Text style={styles.bio}>
              🔥 Sneaker Collector & Enthusiast{'\n'}
              👟 Building the ultimate collection{'\n'}
              💰 Tracking value since 2020{'\n'}
              📍 Los Angeles, CA
            </Text>
            <View style={styles.brandBadge}>
              <IconSymbol ios_icon_name="checkmark.seal.fill" android_material_icon_name="verified" size={14} color={colors.background} />
              <Text style={styles.brandBadgeText}>Verified Collector</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <IconSymbol ios_icon_name="square.and.arrow.up" android_material_icon_name="share" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'shelf' && styles.activeTab]}
            onPress={() => setActiveTab('shelf')}
          >
            <IconSymbol
              ios_icon_name="square.stack.3d.up.fill"
              android_material_icon_name="view-carousel"
              size={24}
              color={activeTab === 'shelf' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.tabLabel, activeTab === 'shelf' && styles.activeTabLabel]}>Shelf</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'grid' && styles.activeTab]}
            onPress={() => setActiveTab('grid')}
          >
            <IconSymbol
              ios_icon_name="square.grid.3x3.fill"
              android_material_icon_name="grid-on"
              size={24}
              color={activeTab === 'grid' ? colors.primary : colors.textSecondary}
            />
            <Text style={[styles.tabLabel, activeTab === 'grid' && styles.activeTabLabel]}>Grid</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'shelf' ? (
          <View style={styles.shelfContainer}>
            {posts.map((item, index) => renderShelfItem(item, index))}
          </View>
        ) : (
          <View style={styles.gridContainer}>
            {posts.map((item, index) => renderGridItem(item, index))}
          </View>
        )}
      </ScrollView>
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
  contentContainer: {
    paddingBottom: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  profileGradient: {
    paddingBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 8,
  },
  avatarGradient: {
    width: 94,
    height: 94,
    borderRadius: 47,
    padding: 3,
    marginRight: 24,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
    padding: 3,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bioSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  displayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  brandBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.background,
    letterSpacing: 0.3,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  shareButton: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeTabLabel: {
    color: colors.primary,
  },
  shelfContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 16,
    gap: 12,
  },
  shelfItem: {
    width: shelfWidth,
    height: shelfWidth + 40,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  shelfPedestal: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
  },
  pedestalTop: {
    width: '90%',
    height: 8,
    backgroundColor: colors.cardElevated,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border,
  },
  pedestalBase: {
    width: '100%',
    height: 32,
    backgroundColor: colors.concrete,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shelfImage: {
    width: shelfWidth - 20,
    height: shelfWidth - 20,
    borderRadius: 8,
    marginBottom: 8,
    transform: [{ rotateY: '-15deg' }, { rotateX: '5deg' }],
  },
  shelfShadow: {
    position: 'absolute',
    bottom: 40,
    width: '70%',
    height: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 50,
    opacity: 0.5,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  gridItem: {
    width: (width - 4) / 3,
    height: (width - 4) / 3,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.border,
  },
});
