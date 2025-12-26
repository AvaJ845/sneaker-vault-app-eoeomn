import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors } from '@/styles/commonStyles';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

interface MessageInputProps {
  onSend: (content: string, type: 'text' | 'image', mediaUrl?: string) => Promise<void>;
  onTyping?: (isTyping: boolean) => void;
  placeholder?: string;
}

export function MessageInput({
  onSend,
  onTyping,
  placeholder = 'iMessage',
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const recordAnimation = useRef(new Animated.Value(0)).current;

  const handleTextChange = (text: string) => {
    setMessage(text);

    // Typing indicator
    if (onTyping) {
      onTyping(true);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 1000);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    const messageToSend = message.trim();
    setMessage('');
    
    try {
      setIsSending(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      await onSend(messageToSend, 'text');
      
      if (onTyping) {
        onTyping(false);
      }
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessage(messageToSend); // Restore message on error
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photos to send images.'
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
        setIsSending(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        await onSend('', 'image', result.assets[0].uri);
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsSending(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to send image. Please try again.');
      setIsSending(false);
    }
  };

  const handleCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow camera access to take photos.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setIsSending(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        await onSend('', 'image', result.assets[0].uri);
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setIsSending(false);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
      setIsSending(false);
    }
  };

  const handleAddMenu = () => {
    Alert.alert(
      'Send',
      'Choose an option',
      [
        {
          text: 'Photo Library',
          onPress: handlePickImage,
        },
        {
          text: 'Camera',
          onPress: handleCamera,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const startRecording = () => {
    setIsRecording(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    // Animate the mic button
    Animated.loop(
      Animated.sequence([
        Animated.timing(recordAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(recordAnimation, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // TODO: Implement actual voice recording
    Alert.alert(
      'Voice Messages',
      'Voice messaging coming soon! For now, use text messages.',
      [
        {
          text: 'OK',
          onPress: () => {
            setIsRecording(false);
            recordAnimation.setValue(0);
          },
        },
      ]
    );
  };

  const canSend = message.trim().length > 0 && !isSending;

  const micScale = recordAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      style={styles.container}
    >
      <View style={styles.inputBar}>
        {/* Add button */}
        <TouchableOpacity
          onPress={handleAddMenu}
          disabled={isSending}
          style={styles.addButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.addButtonCircle}>
            <IconSymbol
              ios_icon_name="plus"
              android_material_icon_name="add"
              size={24}
              color={colors.primary}
            />
          </View>
        </TouchableOpacity>

        {/* Text input */}
        <View style={styles.inputContainer}>
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={colors.textSecondary}
            value={message}
            onChangeText={handleTextChange}
            multiline
            maxLength={1000}
            editable={!isSending}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            blurOnSubmit={false}
          />
        </View>

        {/* Send or Mic button */}
        {canSend ? (
          <TouchableOpacity
            onPress={handleSend}
            disabled={isSending}
            style={styles.sendButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {isSending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.sendButtonCircle}>
                <IconSymbol
                  ios_icon_name="arrow.up"
                  android_material_icon_name="send"
                  size={20}
                  color="#fff"
                />
              </View>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={startRecording}
            onLongPress={startRecording}
            disabled={isSending}
            style={styles.micButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Animated.View style={[styles.micButtonCircle, { transform: [{ scale: micScale }] }]}>
              <IconSymbol
                ios_icon_name={isRecording ? 'waveform' : 'mic'}
                android_material_icon_name={isRecording ? 'graphic-eq' : 'mic'}
                size={24}
                color={colors.textSecondary}
              />
            </Animated.View>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  addButton: {
    marginBottom: 4,
  },
  addButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
    maxHeight: 100,
    justifyContent: 'center',
  },
  input: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 20,
  },
  sendButton: {
    marginBottom: 4,
  },
  sendButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    marginBottom: 4,
  },
  micButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
