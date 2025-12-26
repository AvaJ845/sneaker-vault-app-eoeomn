import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { IconSymbol } from './IconSymbol';
import { colors } from '@/styles/commonStyles';
import { Message } from '@/types/message';
import * as Haptics from 'expo-haptics';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  onLongPress?: (message: Message) => void;
  onSneakerPress?: (sneakerId: string) => void;
  showSenderInfo?: boolean; // For group chats
}

export function MessageBubble({
  message,
  isOwnMessage,
  onLongPress,
  onSneakerPress,
  showSenderInfo = false,
}: MessageBubbleProps) {
  const [imageError, setImageError] = useState(false);

  const handleLongPress = () => {
    if (onLongPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onLongPress(message);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const renderMessageContent = () => {
    switch (message.message_type) {
      case 'text':
        return <Text style={styles.messageText}>{message.content}</Text>;

      case 'image':
        if (!message.media_url || imageError) {
          return <Text style={styles.errorText}>Failed to load image</Text>;
        }
        return (
          <Image
            source={{ uri: message.media_url }}
            style={styles.messageImage}
            onError={() => setImageError(true)}
          />
        );

      case 'voice':
        return (
          <View style={styles.voiceMessage}>
            <IconSymbol
              ios_icon_name="waveform"
              android_material_icon_name="graphic-eq"
              size={24}
              color={isOwnMessage ? '#fff' : colors.text}
            />
            <Text style={[styles.voiceText, isOwnMessage && styles.ownMessageText]}>
              Voice message
            </Text>
            <Text style={[styles.voiceText, isOwnMessage && styles.ownMessageText]}>
              0:{message.content || '00'}
            </Text>
          </View>
        );

      case 'sneaker_card':
        return (
          <TouchableOpacity
            style={styles.sneakerCard}
            onPress={() => message.sneaker_id && onSneakerPress?.(message.sneaker_id)}
          >
            {message.sneaker?.image_url && (
              <Image
                source={{ uri: message.sneaker.image_url }}
                style={styles.sneakerImage}
              />
            )}
            <View style={styles.sneakerInfo}>
              <Text style={[styles.sneakerBrand, isOwnMessage && styles.ownMessageText]}>
                {message.sneaker?.brand}
              </Text>
              <Text style={[styles.sneakerModel, isOwnMessage && styles.ownMessageText]}>
                {message.sneaker?.model}
              </Text>
              {message.sneaker?.price && (
                <Text style={[styles.sneakerPrice, isOwnMessage && styles.ownMessageText]}>
                  ${message.sneaker.price}
                </Text>
              )}
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron-right"
              size={20}
              color={isOwnMessage ? '#fff' : colors.textSecondary}
            />
          </TouchableOpacity>
        );

      case 'system':
        return (
          <Text style={styles.systemText}>{message.content}</Text>
        );

      default:
        return <Text style={styles.messageText}>{message.content}</Text>;
    }
  };

  // System messages are centered and styled differently
  if (message.message_type === 'system') {
    return (
      <View style={styles.systemContainer}>
        <View style={styles.systemBubble}>
          {renderMessageContent()}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, isOwnMessage && styles.ownMessageContainer]}>
      {/* Sender info for group chats */}
      {showSenderInfo && !isOwnMessage && (
        <Text style={styles.senderName}>{message.sender?.username}</Text>
      )}

      {/* Message bubble */}
      <TouchableOpacity
        onLongPress={handleLongPress}
        activeOpacity={0.7}
        style={[
          styles.bubble,
          isOwnMessage ? styles.ownBubble : styles.otherBubble,
        ]}
      >
        {renderMessageContent()}

        {/* Timestamp */}
        <View style={styles.footer}>
          <Text style={[styles.timestamp, isOwnMessage && styles.ownTimestamp]}>
            {formatTime(message.created_at)}
          </Text>
          
          {/* Read receipt for own messages */}
          {isOwnMessage && (
            <IconSymbol
              ios_icon_name={message.is_read ? 'checkmark.circle.fill' : 'checkmark.circle'}
              android_material_icon_name={message.is_read ? 'check-circle' : 'check-circle-outline'}
              size={12}
              color={message.is_read ? colors.secondary : '#fff'}
            />
          )}

          {/* Edited indicator */}
          {message.is_edited && (
            <Text style={[styles.editedText, isOwnMessage && styles.ownTimestamp]}>
              (edited)
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    paddingHorizontal: 16,
    maxWidth: '80%',
  },
  ownMessageContainer: {
    alignSelf: 'flex-end',
  },
  senderName: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
    marginLeft: 12,
  },
  bubble: {
    borderRadius: 18,
    padding: 12,
    maxWidth: '100%',
  },
  ownBubble: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: colors.card,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
    color: colors.text,
  },
  ownMessageText: {
    color: '#fff',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 4,
  },
  voiceMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  voiceText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  sneakerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 8,
  },
  sneakerImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  sneakerInfo: {
    flex: 1,
  },
  sneakerBrand: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  sneakerModel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  sneakerPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  ownTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  editedText: {
    fontSize: 9,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.error,
  },
  systemContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  systemBubble: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  systemText: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
