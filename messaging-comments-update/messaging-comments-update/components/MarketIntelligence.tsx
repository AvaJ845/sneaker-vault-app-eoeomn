
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { colors, typography, commonStyles } from '@/styles/commonStyles';
import { supabase } from '@/lib/supabase';
import { MarketTrend } from '@/types/organization';

const { width } = Dimensions.get('window');

interface PriceChartProps {
  sneakerId: string;
  size?: string;
}

export default function MarketIntelligence({ sneakerId, size }: PriceChartProps) {
  const [trends, setTrends] = useState<MarketTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
  }, [sneakerId]);

  const fetchTrends = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('market_trends')
        .select('*')
        .eq('sneaker_id', sneakerId)
        .eq('trend_type', 'price')
        .order('recorded_at', { ascending: true })
        .limit(30);

      if (error) throw error;
      setTrends(data || []);
    } catch (err) {
      console.error('Error fetching trends:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    if (trends.length === 0) return null;

    const prices = trends.map(t => t.value);
    const currentPrice = prices[prices.length - 1];
    const previousPrice = prices[prices.length - 2] || currentPrice;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const priceChange = currentPrice - previousPrice;
    const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2);

    return {
      currentPrice,
      minPrice,
      maxPrice,
      avgPrice,
      priceChange,
      priceChangePercent,
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading market data...</Text>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No market data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Market Intelligence</Text>
        <View style={[
          styles.changeBadge,
          { backgroundColor: stats.priceChange >= 0 ? colors.success + '20' : colors.error + '20' }
        ]}>
          <Text style={[
            styles.changeText,
            { color: stats.priceChange >= 0 ? colors.success : colors.error }
          ]}>
            {stats.priceChange >= 0 ? '+' : ''}{stats.priceChangePercent}%
          </Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Current</Text>
          <Text style={styles.statValue}>${stats.currentPrice.toLocaleString()}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Average</Text>
          <Text style={styles.statValue}>${stats.avgPrice.toFixed(0)}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Low</Text>
          <Text style={styles.statValue}>${stats.minPrice.toLocaleString()}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>High</Text>
          <Text style={styles.statValue}>${stats.maxPrice.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <SimpleLineChart data={trends.map(t => t.value)} />
      </View>

      <View style={styles.insights}>
        <Text style={styles.insightsTitle}>Insights</Text>
        <Text style={styles.insightText}>
          • Price is {stats.priceChange >= 0 ? 'trending up' : 'trending down'} by {Math.abs(parseFloat(stats.priceChangePercent))}%
        </Text>
        <Text style={styles.insightText}>
          • Current price is {((stats.currentPrice / stats.avgPrice - 1) * 100).toFixed(0)}% {stats.currentPrice > stats.avgPrice ? 'above' : 'below'} average
        </Text>
        <Text style={styles.insightText}>
          • {stats.currentPrice === stats.maxPrice ? 'At all-time high' : `$${(stats.maxPrice - stats.currentPrice).toFixed(0)} below peak`}
        </Text>
      </View>
    </View>
  );
}

function SimpleLineChart({ data }: { data: number[] }) {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  const chartHeight = 150;
  const chartWidth = width - 64;
  const pointSpacing = chartWidth / (data.length - 1 || 1);

  const points = data.map((value, index) => {
    const x = index * pointSpacing;
    const y = chartHeight - ((value - minValue) / range) * chartHeight;
    return { x, y, value };
  });

  return (
    <View style={styles.chart}>
      <View style={styles.chartGrid}>
        {[0, 1, 2, 3, 4].map((i, index) => (
          <View key={index} style={styles.gridLine} />
        ))}
      </View>
      <View style={styles.chartLine}>
        {points.map((point, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <View
                style={[
                  styles.lineSegment,
                  {
                    position: 'absolute',
                    left: points[index - 1].x,
                    top: points[index - 1].y,
                    width: Math.sqrt(
                      Math.pow(point.x - points[index - 1].x, 2) +
                      Math.pow(point.y - points[index - 1].y, 2)
                    ),
                    transform: [
                      {
                        rotate: `${Math.atan2(
                          point.y - points[index - 1].y,
                          point.x - points[index - 1].x
                        )}rad`,
                      },
                    ],
                  },
                ]}
              />
            )}
            <View
              style={[
                styles.chartPoint,
                {
                  position: 'absolute',
                  left: point.x - 4,
                  top: point.y - 4,
                },
              ]}
            />
          </React.Fragment>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.card,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    ...typography.username,
    fontSize: 18,
  },
  changeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.shimmer,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    ...typography.caption,
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    ...typography.username,
    fontSize: 18,
    color: colors.primary,
  },
  chartContainer: {
    marginBottom: 20,
  },
  chart: {
    height: 150,
    position: 'relative',
  },
  chartGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: colors.border,
  },
  chartLine: {
    position: 'relative',
    height: 150,
  },
  lineSegment: {
    height: 2,
    backgroundColor: colors.primary,
  },
  chartPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.background,
  },
  insights: {
    backgroundColor: colors.shimmer,
    padding: 16,
    borderRadius: 12,
  },
  insightsTitle: {
    ...typography.username,
    fontSize: 14,
    marginBottom: 12,
  },
  insightText: {
    ...typography.body,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  loadingText: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  emptyText: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
