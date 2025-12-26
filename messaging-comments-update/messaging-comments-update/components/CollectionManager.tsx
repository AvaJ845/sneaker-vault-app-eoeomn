
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { colors, typography, commonStyles } from '@/styles/commonStyles';
import { useCollections } from '@/hooks/useCollections';
import { Collection } from '@/types/organization';
import { IconSymbol } from './IconSymbol';

export default function CollectionManager() {
  const { collections, loading, createCollection, updateCollection, deleteCollection } = useCollections();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'custom' as Collection['type'],
    color: colors.primary,
    icon: 'folder',
  });

  const collectionTypes = [
    { value: 'investment', label: 'Investment', icon: 'chart.line.uptrend.xyaxis', color: '#4ECCA3' },
    { value: 'daily_wear', label: 'Daily Wear', icon: 'figure.walk', color: '#FFD93D' },
    { value: 'display', label: 'Display', icon: 'eye', color: '#9D4EDD' },
    { value: 'custom', label: 'Custom', icon: 'folder', color: colors.primary },
  ];

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a collection name');
      return;
    }

    try {
      await createCollection(formData);
      setShowCreateModal(false);
      resetForm();
      Alert.alert('Success', 'Collection created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create collection');
    }
  };

  const handleUpdate = async () => {
    if (!editingCollection) return;

    try {
      await updateCollection(editingCollection.id, formData);
      setEditingCollection(null);
      resetForm();
      Alert.alert('Success', 'Collection updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update collection');
    }
  };

  const handleDelete = async (collection: Collection) => {
    Alert.alert(
      'Delete Collection',
      `Are you sure you want to delete "${collection.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCollection(collection.id);
              Alert.alert('Success', 'Collection deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete collection');
            }
          },
        },
      ]
    );
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      type: 'custom',
      color: colors.primary,
      icon: 'folder',
    });
  };

  const openEditModal = (collection: Collection) => {
    setEditingCollection(collection);
    setFormData({
      name: collection.name,
      description: collection.description || '',
      type: collection.type,
      color: collection.color || colors.primary,
      icon: collection.icon || 'folder',
    });
    setShowCreateModal(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Collections</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingCollection(null);
            resetForm();
            setShowCreateModal(true);
          }}
        >
          <IconSymbol ios_icon_name="plus.circle.fill" android_material_icon_name="add_circle" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {collections.map((collection, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.collectionCard, { borderLeftColor: collection.color || colors.primary }]}
            onPress={() => openEditModal(collection)}
          >
            <View style={styles.collectionHeader}>
              <View style={styles.collectionInfo}>
                <View style={[styles.iconContainer, { backgroundColor: collection.color || colors.primary }]}>
                  <IconSymbol 
                    ios_icon_name={collection.icon || 'folder'} 
                    android_material_icon_name="folder" 
                    size={24} 
                    color="#FFF" 
                  />
                </View>
                <View style={styles.collectionText}>
                  <Text style={styles.collectionName}>{collection.name}</Text>
                  {collection.description && (
                    <Text style={styles.collectionDescription}>{collection.description}</Text>
                  )}
                </View>
              </View>
              <TouchableOpacity onPress={() => handleDelete(collection)}>
                <IconSymbol ios_icon_name="trash" android_material_icon_name="delete" size={20} color={colors.error} />
              </TouchableOpacity>
            </View>
            <View style={styles.collectionStats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{collection.item_count}</Text>
                <Text style={styles.statLabel}>Items</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>${collection.total_value.toLocaleString()}</Text>
                <Text style={styles.statLabel}>Value</Text>
              </View>
              <View style={styles.typeBadge}>
                <Text style={styles.typeBadgeText}>{collection.type.replace('_', ' ')}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowCreateModal(false);
          setEditingCollection(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingCollection ? 'Edit Collection' : 'Create Collection'}
              </Text>
              <TouchableOpacity onPress={() => {
                setShowCreateModal(false);
                setEditingCollection(null);
              }}>
                <IconSymbol ios_icon_name="xmark.circle.fill" android_material_icon_name="close" size={28} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Collection Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Enter collection name"
                placeholderTextColor={colors.textTertiary}
              />

              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                placeholder="Enter description"
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
              />

              <Text style={styles.label}>Collection Type</Text>
              <View style={styles.typeGrid}>
                {collectionTypes.map((type, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.typeCard,
                      formData.type === type.value && styles.typeCardSelected,
                      { borderColor: type.color }
                    ]}
                    onPress={() => setFormData({ 
                      ...formData, 
                      type: type.value as Collection['type'],
                      color: type.color,
                      icon: type.icon,
                    })}
                  >
                    <IconSymbol 
                      ios_icon_name={type.icon} 
                      android_material_icon_name="folder" 
                      size={32} 
                      color={formData.type === type.value ? type.color : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.typeLabel,
                      formData.type === type.value && { color: type.color }
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={editingCollection ? handleUpdate : handleCreate}
              >
                <Text style={styles.submitButtonText}>
                  {editingCollection ? 'Update Collection' : 'Create Collection'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
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
  title: {
    ...typography.username,
    fontSize: 24,
  },
  addButton: {
    padding: 4,
  },
  list: {
    flex: 1,
    padding: 16,
  },
  collectionCard: {
    ...commonStyles.card,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  collectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  collectionText: {
    flex: 1,
  },
  collectionName: {
    ...typography.username,
    fontSize: 18,
    marginBottom: 4,
  },
  collectionDescription: {
    ...typography.caption,
    fontSize: 13,
  },
  collectionStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    ...typography.username,
    fontSize: 16,
    color: colors.primary,
  },
  statLabel: {
    ...typography.caption,
    fontSize: 11,
  },
  typeBadge: {
    backgroundColor: colors.shimmer,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  typeBadgeText: {
    ...typography.caption,
    fontSize: 11,
    textTransform: 'capitalize',
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
    maxHeight: '90%',
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
  form: {
    padding: 20,
  },
  label: {
    ...typography.username,
    fontSize: 14,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  typeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  typeCardSelected: {
    backgroundColor: colors.shimmer,
  },
  typeLabel: {
    ...typography.caption,
    fontSize: 12,
    marginTop: 8,
    color: colors.textSecondary,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    ...typography.button,
    color: colors.text,
  },
});
