
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
import { useTags } from '@/hooks/useCollections';
import { CustomTag } from '@/types/organization';
import { IconSymbol } from './IconSymbol';

const TAG_COLORS = [
  '#FF6B35', '#9D4EDD', '#4ECCA3', '#FFD93D', '#FF6B6B',
  '#4ECDC4', '#F7B731', '#5F27CD', '#00D2D3', '#FF9FF3',
];

export default function TagManager() {
  const { tags, loading, createTag } = useTags();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tagName, setTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);

  const handleCreate = async () => {
    if (!tagName.trim()) {
      Alert.alert('Error', 'Please enter a tag name');
      return;
    }

    try {
      await createTag({
        name: tagName.trim(),
        color: selectedColor,
      });
      setShowCreateModal(false);
      setTagName('');
      setSelectedColor(TAG_COLORS[0]);
      Alert.alert('Success', 'Tag created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create tag. It may already exist.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tags</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <IconSymbol ios_icon_name="tag.fill" android_material_icon_name="label" size={24} color={colors.primary} />
          <Text style={styles.addButtonText}>New Tag</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.tagList} 
        contentContainerStyle={styles.tagListContent}
        showsVerticalScrollIndicator={false}
      >
        {tags.map((tag, index) => (
          <View
            key={index}
            style={[styles.tagChip, { backgroundColor: tag.color || colors.primary }]}
          >
            <Text style={styles.tagText}>{tag.name}</Text>
            <View style={styles.tagCount}>
              <Text style={styles.tagCountText}>{tag.usage_count}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Tag</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <IconSymbol ios_icon_name="xmark.circle.fill" android_material_icon_name="close" size={28} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Tag Name</Text>
              <TextInput
                style={styles.input}
                value={tagName}
                onChangeText={setTagName}
                placeholder="Enter tag name"
                placeholderTextColor={colors.textTertiary}
                autoCapitalize="none"
              />

              <Text style={styles.label}>Color</Text>
              <View style={styles.colorGrid}>
                {TAG_COLORS.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorOptionSelected,
                    ]}
                    onPress={() => setSelectedColor(color)}
                  >
                    {selectedColor === color && (
                      <IconSymbol ios_icon_name="checkmark" android_material_icon_name="check" size={20} color="#FFF" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.preview}>
                <Text style={styles.previewLabel}>Preview:</Text>
                <View style={[styles.previewTag, { backgroundColor: selectedColor }]}>
                  <Text style={styles.previewTagText}>{tagName || 'Tag Name'}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleCreate}
              >
                <Text style={styles.submitButtonText}>Create Tag</Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.shimmer,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  addButtonText: {
    ...typography.username,
    fontSize: 14,
  },
  tagList: {
    flex: 1,
    padding: 16,
  },
  tagListContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  tagText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tagCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tagCountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
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
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionSelected: {
    borderWidth: 3,
    borderColor: colors.text,
  },
  preview: {
    marginTop: 24,
    alignItems: 'center',
  },
  previewLabel: {
    ...typography.caption,
    marginBottom: 12,
  },
  previewTag: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  previewTagText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
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
