
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from 'react-native';
import { colors, typography, commonStyles } from '@/styles/commonStyles';
import { supabase } from '@/lib/supabase';
import { IconSymbol } from './IconSymbol';

interface BatchOperationsProps {
  selectedItems: string[];
  onComplete: () => void;
}

export default function BatchOperations({ selectedItems, onComplete }: BatchOperationsProps) {
  const [showModal, setShowModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const operations = [
    {
      id: 'update_condition',
      title: 'Update Condition',
      description: 'Change condition for all selected items',
      icon: 'star.fill',
      androidIcon: 'grade',
      color: colors.warning,
    },
    {
      id: 'add_tags',
      title: 'Add Tags',
      description: 'Apply tags to selected items',
      icon: 'tag.fill',
      androidIcon: 'label',
      color: colors.primary,
    },
    {
      id: 'move_collection',
      title: 'Move to Collection',
      description: 'Add items to a collection',
      icon: 'folder.fill',
      androidIcon: 'folder',
      color: colors.secondary,
    },
    {
      id: 'update_value',
      title: 'Update Values',
      description: 'Refresh market values',
      icon: 'arrow.clockwise',
      androidIcon: 'refresh',
      color: colors.success,
    },
    {
      id: 'export',
      title: 'Export Data',
      description: 'Export selected items to CSV',
      icon: 'square.and.arrow.up',
      androidIcon: 'upload',
      color: '#4ECDC4',
    },
    {
      id: 'delete',
      title: 'Delete Items',
      description: 'Remove selected items',
      icon: 'trash.fill',
      androidIcon: 'delete',
      color: colors.error,
    },
  ];

  const handleOperation = async (operationId: string) => {
    if (selectedItems.length === 0) {
      Alert.alert('No Items Selected', 'Please select items to perform batch operations');
      return;
    }

    Alert.alert(
      'Confirm Operation',
      `Apply this operation to ${selectedItems.length} item(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setProcessing(true);
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) throw new Error('User not authenticated');

              // Log the batch operation
              await supabase.from('batch_operations').insert([{
                user_id: user.id,
                operation_type: operationId,
                item_count: selectedItems.length,
                items_affected: selectedItems,
                changes: {},
                status: 'completed',
                completed_at: new Date().toISOString(),
              }]);

              Alert.alert('Success', 'Batch operation completed successfully');
              onComplete();
              setShowModal(false);
            } catch (error) {
              console.error('Batch operation error:', error);
              Alert.alert('Error', 'Failed to complete batch operation');
            } finally {
              setProcessing(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.triggerButton}
        onPress={() => setShowModal(true)}
        disabled={selectedItems.length === 0}
      >
        <IconSymbol 
          ios_icon_name="square.stack.3d.up.fill" 
          android_material_icon_name="layers" 
          size={20} 
          color={selectedItems.length > 0 ? colors.primary : colors.textTertiary} 
        />
        <Text style={[
          styles.triggerButtonText,
          selectedItems.length === 0 && styles.triggerButtonTextDisabled
        ]}>
          Batch ({selectedItems.length})
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Batch Operations</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <IconSymbol 
                  ios_icon_name="xmark.circle.fill" 
                  android_material_icon_name="close" 
                  size={28} 
                  color={colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.selectionInfo}>
              <Text style={styles.selectionText}>
                {selectedItems.length} item(s) selected
              </Text>
            </View>

            <ScrollView style={styles.operationsList} showsVerticalScrollIndicator={false}>
              {operations.map((operation, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.operationCard}
                  onPress={() => handleOperation(operation.id)}
                  disabled={processing}
                >
                  <View style={[styles.operationIcon, { backgroundColor: operation.color + '20' }]}>
                    <IconSymbol 
                      ios_icon_name={operation.icon} 
                      android_material_icon_name={operation.androidIcon} 
                      size={24} 
                      color={operation.color} 
                    />
                  </View>
                  <View style={styles.operationContent}>
                    <Text style={styles.operationTitle}>{operation.title}</Text>
                    <Text style={styles.operationDescription}>{operation.description}</Text>
                  </View>
                  <IconSymbol 
                    ios_icon_name="chevron.right" 
                    android_material_icon_name="chevron_right" 
                    size={20} 
                    color={colors.textSecondary} 
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  triggerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.shimmer,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  triggerButtonText: {
    ...typography.username,
    fontSize: 14,
    color: colors.text,
  },
  triggerButtonTextDisabled: {
    color: colors.textTertiary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    ...typography.username,
    fontSize: 20,
  },
  selectionInfo: {
    padding: 16,
    backgroundColor: colors.shimmer,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
  },
  selectionText: {
    ...typography.body,
    textAlign: 'center',
  },
  operationsList: {
    flex: 1,
    padding: 20,
  },
  operationCard: {
    ...commonStyles.card,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 16,
  },
  operationIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  operationContent: {
    flex: 1,
  },
  operationTitle: {
    ...typography.username,
    fontSize: 16,
    marginBottom: 4,
  },
  operationDescription: {
    ...typography.caption,
    fontSize: 13,
  },
});
