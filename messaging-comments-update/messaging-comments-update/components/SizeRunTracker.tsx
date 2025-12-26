
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors, typography, commonStyles } from '@/styles/commonStyles';
import { supabase } from '@/lib/supabase';
import { SizeRun } from '@/types/organization';
import { IconSymbol } from './IconSymbol';

interface SizeRunTrackerProps {
  sneakerId: string;
  sneakerName: string;
}

const COMMON_SIZES = [
  '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13', '14', '15'
];

export default function SizeRunTracker({ sneakerId, sneakerName }: SizeRunTrackerProps) {
  const [sizeRun, setSizeRun] = useState<SizeRun | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSizeRun();
  }, [sneakerId]);

  const fetchSizeRun = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('size_runs')
        .select('*')
        .eq('user_id', user.id)
        .eq('sneaker_id', sneakerId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSizeRun(data);
      } else {
        // Create new size run
        const newSizeRun = {
          user_id: user.id,
          sneaker_id: sneakerId,
          sizes: COMMON_SIZES.map(size => ({ size, available: false })),
          target_sizes: COMMON_SIZES,
          completed_sizes: [],
          completion_percentage: 0,
        };

        const { data: created, error: createError } = await supabase
          .from('size_runs')
          .insert([newSizeRun])
          .select()
          .single();

        if (createError) throw createError;
        setSizeRun(created);
      }
    } catch (err) {
      console.error('Error fetching size run:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSize = async (size: string) => {
    if (!sizeRun) return;

    try {
      const isCompleted = sizeRun.completed_sizes.includes(size);
      const newCompletedSizes = isCompleted
        ? sizeRun.completed_sizes.filter(s => s !== size)
        : [...sizeRun.completed_sizes, size];

      const completionPercentage = (newCompletedSizes.length / sizeRun.target_sizes.length) * 100;

      const { data, error } = await supabase
        .from('size_runs')
        .update({
          completed_sizes: newCompletedSizes,
          completion_percentage: completionPercentage,
          updated_at: new Date().toISOString(),
        })
        .eq('id', sizeRun.id)
        .select()
        .single();

      if (error) throw error;
      setSizeRun(data);

      // Check if completed
      if (completionPercentage === 100) {
        Alert.alert('🎉 Congratulations!', 'You completed the full size run!');
      }
    } catch (err) {
      console.error('Error toggling size:', err);
      Alert.alert('Error', 'Failed to update size run');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading size run...</Text>
      </View>
    );
  }

  if (!sizeRun) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Failed to load size run</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Size Run Tracker</Text>
          <Text style={styles.subtitle}>{sneakerName}</Text>
        </View>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {sizeRun.completed_sizes.length}/{sizeRun.target_sizes.length}
          </Text>
          <Text style={styles.progressLabel}>
            {sizeRun.completion_percentage.toFixed(0)}%
          </Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${sizeRun.completion_percentage}%` }
          ]} 
        />
      </View>

      <ScrollView 
        style={styles.sizeGrid}
        contentContainerStyle={styles.sizeGridContent}
        showsVerticalScrollIndicator={false}
      >
        {sizeRun.target_sizes.map((size, index) => {
          const isCompleted = sizeRun.completed_sizes.includes(size);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.sizeBox,
                isCompleted && styles.sizeBoxCompleted,
              ]}
              onPress={() => toggleSize(size)}
            >
              <Text style={[
                styles.sizeText,
                isCompleted && styles.sizeTextCompleted,
              ]}>
                {size}
              </Text>
              {isCompleted && (
                <View style={styles.checkmark}>
                  <IconSymbol 
                    ios_icon_name="checkmark" 
                    android_material_icon_name="check" 
                    size={16} 
                    color="#FFF" 
                  />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {sizeRun.completion_percentage === 100 && (
        <View style={styles.completionBanner}>
          <IconSymbol 
            ios_icon_name="trophy.fill" 
            android_material_icon_name="emoji_events" 
            size={32} 
            color={colors.warning} 
          />
          <Text style={styles.completionText}>Full Size Run Complete!</Text>
        </View>
      )}
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
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    ...typography.username,
    fontSize: 18,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.caption,
    fontSize: 13,
  },
  progressContainer: {
    alignItems: 'flex-end',
  },
  progressText: {
    ...typography.username,
    fontSize: 24,
    color: colors.primary,
  },
  progressLabel: {
    ...typography.caption,
    fontSize: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.shimmer,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  sizeGrid: {
    maxHeight: 300,
  },
  sizeGridContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  sizeBox: {
    width: 60,
    height: 60,
    backgroundColor: colors.shimmer,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  sizeBoxCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  sizeText: {
    ...typography.username,
    fontSize: 16,
    color: colors.text,
  },
  sizeTextCompleted: {
    color: '#FFF',
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.warning + '20',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 12,
  },
  completionText: {
    ...typography.username,
    fontSize: 16,
    color: colors.warning,
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
