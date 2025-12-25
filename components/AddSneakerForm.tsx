
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { AddSneakerForm as AddSneakerFormType } from '@/types/database';

interface AddSneakerFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (form: AddSneakerFormType) => void;
}

export default function AddSneakerForm({ visible, onClose, onSubmit }: AddSneakerFormProps) {
  const [form, setForm] = useState<AddSneakerFormType>({
    sku: '',
    brand: '',
    model: '',
    colorway: '',
    releaseDate: '',
    retailPrice: 0,
    estimatedValue: 0,
    imageUrl: '',
    category: 'Basketball',
    silhouette: '',
    tags: [],
    description: '',
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = () => {
    // Validation
    if (!form.sku || !form.brand || !form.model || !form.colorway) {
      Alert.alert('Missing Fields', 'Please fill in all required fields (SKU, Brand, Model, Colorway)');
      return;
    }

    if (form.retailPrice <= 0 || form.estimatedValue <= 0) {
      Alert.alert('Invalid Price', 'Please enter valid prices');
      return;
    }

    console.log('Submit form:', form);
    Alert.alert(
      'Supabase Required',
      'To add sneakers to the database, you need to enable Supabase backend.\n\nThis will allow:\n• User-generated content\n• Image uploads to Supabase Storage\n• Community verification\n• Real-time updates\n\nPress the Supabase button to get started!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: onClose },
      ]
    );
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags.includes(tagInput.trim())) {
      setForm({ ...form, tags: [...form.tags, tagInput.trim().toLowerCase()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  const categories = ['Basketball', 'Running', 'Lifestyle', 'Training', 'Skateboarding', 'Other'];

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
          <Text style={styles.headerTitle}>Add Sneaker</Text>
          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Info Banner */}
          <View style={styles.infoBanner}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={20}
              color={colors.secondary}
            />
            <Text style={styles.infoBannerText}>
              Add sneakers to the community database. All submissions will be reviewed before publishing.
            </Text>
          </View>

          {/* SKU */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              SKU <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 555088-101"
              placeholderTextColor={colors.textSecondary}
              value={form.sku}
              onChangeText={(text) => setForm({ ...form, sku: text })}
            />
          </View>

          {/* Brand */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Brand <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Nike"
              placeholderTextColor={colors.textSecondary}
              value={form.brand}
              onChangeText={(text) => setForm({ ...form, brand: text })}
            />
          </View>

          {/* Model */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Model <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Air Jordan 1 Retro High OG"
              placeholderTextColor={colors.textSecondary}
              value={form.model}
              onChangeText={(text) => setForm({ ...form, model: text })}
            />
          </View>

          {/* Colorway */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>
              Colorway <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Chicago"
              placeholderTextColor={colors.textSecondary}
              value={form.colorway}
              onChangeText={(text) => setForm({ ...form, colorway: text })}
            />
          </View>

          {/* Silhouette */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Silhouette</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Air Jordan 1"
              placeholderTextColor={colors.textSecondary}
              value={form.silhouette}
              onChangeText={(text) => setForm({ ...form, silhouette: text })}
            />
          </View>

          {/* Category */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryChip,
                    form.category === category && styles.categoryChipActive,
                  ]}
                  onPress={() => setForm({ ...form, category: category as any })}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      form.category === category && styles.categoryChipTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Release Date */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Release Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.textSecondary}
              value={form.releaseDate}
              onChangeText={(text) => setForm({ ...form, releaseDate: text })}
            />
          </View>

          {/* Prices */}
          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Retail Price ($)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={form.retailPrice > 0 ? form.retailPrice.toString() : ''}
                onChangeText={(text) => setForm({ ...form, retailPrice: parseFloat(text) || 0 })}
              />
            </View>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Est. Value ($)</Text>
              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={form.estimatedValue > 0 ? form.estimatedValue.toString() : ''}
                onChangeText={(text) => setForm({ ...form, estimatedValue: parseFloat(text) || 0 })}
              />
            </View>
          </View>

          {/* Image URL */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Image URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://..."
              placeholderTextColor={colors.textSecondary}
              value={form.imageUrl}
              onChangeText={(text) => setForm({ ...form, imageUrl: text })}
            />
            <Text style={styles.helperText}>
              With Supabase, you can upload images directly from your device
            </Text>
          </View>

          {/* Tags */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Tags</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add tag..."
                placeholderTextColor={colors.textSecondary}
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
              />
              <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
                <IconSymbol
                  ios_icon_name="plus.circle.fill"
                  android_material_icon_name="add-circle"
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>
            {form.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {form.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                    <TouchableOpacity onPress={() => removeTag(tag)}>
                      <IconSymbol
                        ios_icon_name="xmark.circle.fill"
                        android_material_icon_name="cancel"
                        size={16}
                        color={colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us about this sneaker..."
              placeholderTextColor={colors.textSecondary}
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              multiline
              numberOfLines={4}
            />
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
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  formGroup: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  required: {
    color: colors.error,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  categoryScroll: {
    marginTop: 8,
  },
  categoryChip: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryChipTextActive: {
    color: colors.text,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
  },
  addTagButton: {
    padding: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  bottomSpacer: {
    height: 40,
  },
});
