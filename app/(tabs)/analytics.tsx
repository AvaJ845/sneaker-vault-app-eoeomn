
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/lib/supabase';
import { PortfolioAnalytics } from '@/types/collection';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        return;
      }

      // Fetch collection with sneaker details
      const { data: collection, error } = await supabase
        .from('user_collections')
        .select(`
          *,
          sneakers (
            id,
            brand,
            model,
            colorway,
            estimated_value,
            release_date,
            category
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading collection:', error);
        return;
      }

      if (!collection || collection.length === 0) {
        setAnalytics({
          totalValue: 0,
          totalInvestment: 0,
          totalGain: 0,
          gainPercentage: 0,
          itemCount: 0,
          topPerformers: [],
          worstPerformers: [],
          diversification: {
            byBrand: [],
            byCategory: [],
            byYear: [],
          },
        });
        return;
      }

      // Calculate analytics
      const totalValue = collection.reduce((sum, item) => {
        return sum + (item.sneakers?.estimated_value || 0);
      }, 0);

      const totalInvestment = collection.reduce((sum, item) => {
        return sum + (item.cost_basis || item.purchase_price || 0);
      }, 0);

      const totalGain = totalValue - totalInvestment;
      const gainPercentage = totalInvestment > 0 ? (totalGain / totalInvestment) * 100 : 0;

      // Calculate performers
      const performers = collection
        .map((item) => {
          const currentValue = item.sneakers?.estimated_value || 0;
          const costBasis = item.cost_basis || item.purchase_price || 0;
          const gain = currentValue - costBasis;
          const roi = costBasis > 0 ? (gain / costBasis) * 100 : 0;

          return {
            sneaker_id: item.sneaker_id,
            brand: item.sneakers?.brand || '',
            model: item.sneakers?.model || '',
            roi,
            gain,
          };
        })
        .sort((a, b) => b.roi - a.roi);

      const topPerformers = performers.slice(0, 5);
      const worstPerformers = performers.slice(-5).reverse();

      // Calculate diversification
      const brandMap = new Map<string, { count: number; value: number }>();
      const categoryMap = new Map<string, { count: number; value: number }>();
      const yearMap = new Map<number, { count: number; value: number }>();

      collection.forEach((item) => {
        const brand = item.sneakers?.brand || 'Unknown';
        const category = item.sneakers?.category || 'Unknown';
        const year = item.sneakers?.release_date
          ? new Date(item.sneakers.release_date).getFullYear()
          : 0;
        const value = item.sneakers?.estimated_value || 0;

        // By brand
        const brandData = brandMap.get(brand) || { count: 0, value: 0 };
        brandMap.set(brand, { count: brandData.count + 1, value: brandData.value + value });

        // By category
        const categoryData = categoryMap.get(category) || { count: 0, value: 0 };
        categoryMap.set(category, {
          count: categoryData.count + 1,
          value: categoryData.value + value,
        });

        // By year
        if (year > 0) {
          const yearData = yearMap.get(year) || { count: 0, value: 0 };
          yearMap.set(year, { count: yearData.count + 1, value: yearData.value + value });
        }
      });

      const byBrand = Array.from(brandMap.entries())
        .map(([brand, data]) => ({ brand, ...data }))
        .sort((a, b) => b.value - a.value);

      const byCategory = Array.from(categoryMap.entries())
        .map(([category, data]) => ({ category, ...data }))
        .sort((a, b) => b.value - a.value);

      const byYear = Array.from(yearMap.entries())
        .map(([year, data]) => ({ year, ...data }))
        .sort((a, b) => b.year - a.year);

      setAnalytics({
        totalValue,
        totalInvestment,
        totalGain,
        gainPercentage,
        itemCount: collection.length,
        topPerformers,
        worstPerformers,
        diversification: {
          byBrand,
          byCategory,
          byYear,
        },
      });
    } catch (error) {
      console.error('Error calculating analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Analytics</Text>
          </View>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading analytics...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (!analytics) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Analytics</Text>
          </View>
          <View style={styles.emptyContainer}>
            <IconSymbol
              ios_icon_name="chart.bar.xaxis"
              android_material_icon_name="bar-chart"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyText}>No data available</Text>
            <Text style={styles.emptySubtext}>Add sneakers to your collection to see analytics</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Analytics</Text>
          <TouchableOpacity onPress={loadAnalytics}>
            <IconSymbol
              ios_icon_name="arrow.clockwise"
              android_material_icon_name="refresh"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map((range) => (
            <TouchableOpacity
              key={range}
              style={[styles.timeRangeButton, timeRange === range && styles.timeRangeButtonActive]}
              onPress={() => setTimeRange(range)}
            >
              <Text
                style={[
                  styles.timeRangeText,
                  timeRange === range && styles.timeRangeTextActive,
                ]}
              >
                {range}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Portfolio Overview */}
        <View style={styles.overviewCard}>
          <Text style={styles.cardTitle}>Portfolio Overview</Text>
          <View style={styles.overviewStats}>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewLabel}>Total Value</Text>
              <Text style={styles.overviewValue}>${analytics.totalValue.toLocaleString()}</Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewLabel}>Total Investment</Text>
              <Text style={styles.overviewValue}>
                ${analytics.totalInvestment.toLocaleString()}
              </Text>
            </View>
            <View style={styles.overviewStat}>
              <Text style={styles.overviewLabel}>Total Gain/Loss</Text>
              <Text
                style={[
                  styles.overviewValue,
                  analytics.totalGain >= 0 ? styles.gainPositive : styles.gainNegative,
                ]}
              >
                {analytics.totalGain >= 0 ? '+' : ''}${Math.abs(analytics.totalGain).toLocaleString()}
              </Text>
              <Text
                style={[
                  styles.overviewPercent,
                  analytics.totalGain >= 0 ? styles.gainPositive : styles.gainNegative,
                ]}
              >
                ({analytics.totalGain >= 0 ? '+' : ''}
                {analytics.gainPercentage.toFixed(1)}%)
              </Text>
            </View>
          </View>
        </View>

        {/* Top Performers */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Top Performers</Text>
            <IconSymbol
              ios_icon_name="arrow.up.right"
              android_material_icon_name="trending-up"
              size={20}
              color={colors.success}
            />
          </View>
          {analytics.topPerformers.map((performer, index) => (
            <View key={index} style={styles.performerItem}>
              <View style={styles.performerInfo}>
                <Text style={styles.performerBrand}>{performer.brand}</Text>
                <Text style={styles.performerModel} numberOfLines={1}>
                  {performer.model}
                </Text>
              </View>
              <View style={styles.performerStats}>
                <Text style={[styles.performerGain, styles.gainPositive]}>
                  +${performer.gain.toLocaleString()}
                </Text>
                <Text style={[styles.performerROI, styles.gainPositive]}>
                  +{performer.roi.toFixed(1)}%
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Worst Performers */}
        {analytics.worstPerformers.some((p) => p.gain < 0) && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Needs Attention</Text>
              <IconSymbol
                ios_icon_name="arrow.down.right"
                android_material_icon_name="trending-down"
                size={20}
                color={colors.error}
              />
            </View>
            {analytics.worstPerformers
              .filter((p) => p.gain < 0)
              .map((performer, index) => (
                <View key={index} style={styles.performerItem}>
                  <View style={styles.performerInfo}>
                    <Text style={styles.performerBrand}>{performer.brand}</Text>
                    <Text style={styles.performerModel} numberOfLines={1}>
                      {performer.model}
                    </Text>
                  </View>
                  <View style={styles.performerStats}>
                    <Text style={[styles.performerGain, styles.gainNegative]}>
                      ${performer.gain.toLocaleString()}
                    </Text>
                    <Text style={[styles.performerROI, styles.gainNegative]}>
                      {performer.roi.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              ))}
          </View>
        )}

        {/* Diversification by Brand */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Diversification by Brand</Text>
          {analytics.diversification.byBrand.slice(0, 5).map((item, index) => {
            const percentage = (item.value / analytics.totalValue) * 100;
            return (
              <View key={index} style={styles.diversificationItem}>
                <View style={styles.diversificationInfo}>
                  <Text style={styles.diversificationLabel}>{item.brand}</Text>
                  <Text style={styles.diversificationCount}>{item.count} items</Text>
                </View>
                <View style={styles.diversificationBar}>
                  <View style={[styles.diversificationFill, { width: `${percentage}%` }]} />
                </View>
                <Text style={styles.diversificationValue}>${item.value.toLocaleString()}</Text>
              </View>
            );
          })}
        </View>

        {/* Diversification by Category */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Diversification by Category</Text>
          {analytics.diversification.byCategory.map((item, index) => {
            const percentage = (item.value / analytics.totalValue) * 100;
            return (
              <View key={index} style={styles.diversificationItem}>
                <View style={styles.diversificationInfo}>
                  <Text style={styles.diversificationLabel}>{item.category}</Text>
                  <Text style={styles.diversificationCount}>{item.count} items</Text>
                </View>
                <View style={styles.diversificationBar}>
                  <View style={[styles.diversificationFill, { width: `${percentage}%` }]} />
                </View>
                <Text style={styles.diversificationValue}>${item.value.toLocaleString()}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.bottomSpacer} />
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
  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  timeRangeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeRangeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  timeRangeTextActive: {
    color: colors.text,
  },
  overviewCard: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.4)',
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  overviewStats: {
    gap: 16,
  },
  overviewStat: {
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  overviewValue: {
    fontSize: 28,
    fontWeight: '900',
    color: colors.text,
  },
  overviewPercent: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.4)',
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  performerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  performerInfo: {
    flex: 1,
    marginRight: 12,
  },
  performerBrand: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  performerModel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 2,
  },
  performerStats: {
    alignItems: 'flex-end',
  },
  performerGain: {
    fontSize: 16,
    fontWeight: '800',
  },
  performerROI: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  gainPositive: {
    color: colors.success,
  },
  gainNegative: {
    color: colors.error,
  },
  diversificationItem: {
    marginBottom: 16,
  },
  diversificationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  diversificationLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  diversificationCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  diversificationBar: {
    height: 8,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  diversificationFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  diversificationValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'right',
  },
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 40 : 120,
  },
});
