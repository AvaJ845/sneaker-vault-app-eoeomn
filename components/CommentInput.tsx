import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors } from '@/styles/commonStyles';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

interface CommentInputProps {
  onSubmit: (content: string, mediaUrl?: string) => Promise<void>;
  placeholder?: string;
  replyingTo?: string; // Username being replied to
  onCancelReply?: () => void;
  autoFocus?: boolean;
}

export function CommentInput({
  onSubmit,
  placeholder = 'Add a comment...',
  replyingTo,
  onCancelReply,
  autoFocus = false,
}: CommentInputProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const inputRef = useRef<TextInput>(null);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photos to attach images to comments.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if ((!content.trim() && !selectedImage) || isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      await onSubmit(content.trim(), selectedImage || undefined);

      // Clear input after successful submit
      setContent('');
      setSelectedImage(null);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Error', 'Failed to post comment. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const canSubmit = (content.trim().length > 0 || selectedImage) && !isSubmitting;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        {/* Reply indicator */}
        {replyingTo && (
          <View style={styles.replyBanner}>
            <IconSymbol
              ios_icon_name="arrowshape.turn.up.left"
              android_material_icon_name="reply"
              size={14}
              color={colors.primary}
            />
            <Text style={styles.replyText}>Replying to @{replyingTo}</Text>
            <TouchableOpacity onPress={onCancelReply} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <IconSymbol
                ios_icon_name="xmark"
                android_material_icon_name="close"
                size={14}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Image preview */}
        {selectedImage && (
          <View style={styles.imagePreview}>
            <img src={selectedImage} style={styles.previewImage} alt="Preview" />
            <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
              <IconSymbol
                ios_icon_name="xmark.circle.fill"
                android_material_icon_name="cancel"
                size={24}
                color={colors.error}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Input bar */}
        <View style={styles.inputBar}>
          {/* Add photo button */}
          <TouchableOpacity
            onPress={handlePickImage}
            disabled={isSubmitting}
            style={styles.photoButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol
              ios_icon_name="photo"
              android_material_icon_name="image"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>

          {/* Text input */}
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={content}
            onChangeText={setContent}
            multiline
            maxLength={500}
            editable={!isSubmitting}
            autoFocus={autoFocus}
          />

          {/* Send button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={[styles.sendButton, !canSubmit && styles.sendButtonDisabled]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <IconSymbol
                ios_icon_name="paperplane.fill"
                android_material_icon_name="send"
                size={20}
                color={canSubmit ? colors.primary : colors.textSecondary}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Character count */}
        {content.length > 400 && (
          <Text style={styles.charCount}>
            {content.length}/500
          </Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  replyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.backgroundSecondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  replyText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  imagePreview: {
    padding: 12,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    objectFit: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  photoButton: {
    padding: 4,
  },
  input: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    padding: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  charCount: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'right',
    paddingHorizontal: 16,
    marginTop: 4,
  },
});
