/**
 * ChatMessage - Xabar bubble komponenti
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ViewStyle,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Message } from '../types';
import { formatTime } from '../utils/formatters';
import { scale, moderateScale } from '../utils/responsive';

interface ChatMessageProps {
  message: Message;
  showAvatar?: boolean; // Birinchi xabar uchun avatar ko'rsatish
  style?: ViewStyle;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  showAvatar = false,
  style,
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const isOwnMessage = message.senderId === user?.id;

  // Media URL ni ochish
  const handleMediaPress = () => {
    if (message.mediaUrl) {
      Linking.openURL(message.mediaUrl);
    }
  };

  // Default avatar initials
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <View
      style={[
        styles.container,
        isOwnMessage
          ? styles.ownMessageContainer
          : styles.otherMessageContainer,
        style,
      ]}
    >
      {/* Avatar (faqat boshqa user uchun va showAvatar true bo'lsa) */}
      {!isOwnMessage && showAvatar && (
        <View style={styles.avatarContainer}>
          {message.senderAvatar ? (
            <Image
              source={{ uri: message.senderAvatar }}
              style={styles.avatar}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <View
              style={[
                styles.avatarPlaceholder,
                { backgroundColor: theme.primary },
              ]}
            >
              <Text style={styles.avatarInitials}>
                {getInitials(message.senderName)}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Placeholder (avatar bo'sh joy) */}
      {!isOwnMessage && !showAvatar && (
        <View style={styles.avatarPlaceholder} />
      )}

      {/* Message bubble */}
      <View
        style={[
          styles.bubble,
          isOwnMessage
            ? [styles.ownMessageBubble, { backgroundColor: theme.primary }]
            : [styles.otherMessageBubble, { backgroundColor: theme.surface }],
        ]}
      >
        {/* Text content */}
        {message.type === 'text' && (
          <Text
            style={[
              styles.messageText,
              {
                color: isOwnMessage ? '#FFFFFF' : theme.text,
              },
            ]}
            selectable
          >
            {message.content}
          </Text>
        )}

        {/* Image content */}
        {message.type === 'image' && message.mediaUrl && (
          <TouchableOpacity onPress={handleMediaPress} activeOpacity={0.8}>
            <Image
              source={{ uri: message.mediaUrl }}
              style={styles.messageImage}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
            {message.content && (
              <Text
                style={[
                  styles.messageText,
                  styles.imageCaption,
                  {
                    color: isOwnMessage ? '#FFFFFF' : theme.text,
                  },
                ]}
              >
                {message.content}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {/* File content */}
        {message.type === 'file' && message.mediaUrl && (
          <TouchableOpacity
            onPress={handleMediaPress}
            style={styles.fileContainer}
            activeOpacity={0.8}
          >
            <Text style={styles.fileIcon}>📎</Text>
            <Text
              style={[
                styles.messageText,
                {
                  color: isOwnMessage ? '#FFFFFF' : theme.text,
                },
              ]}
              numberOfLines={1}
            >
              {message.content || 'File'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Timestamp va read indicator */}
        <View style={styles.footer}>
          <Text
            style={[
              styles.timestamp,
              {
                color: isOwnMessage
                  ? 'rgba(255, 255, 255, 0.7)'
                  : theme.textSecondary,
              },
            ]}
          >
            {formatTime(message.createdAt)}
          </Text>
          {isOwnMessage && (
            <Text
              style={[
                styles.readIndicator,
                {
                  color: message.read ? '#4CAF50' : 'rgba(255, 255, 255, 0.5)',
                },
              ]}
            >
              {message.read ? '✓✓' : '✓'}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: scale(4),
    marginHorizontal: scale(16),
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: scale(8),
    alignSelf: 'flex-end',
  },
  avatar: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
  },
  avatarPlaceholder: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: moderateScale(16),
    padding: scale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  ownMessageBubble: {
    borderBottomRightRadius: moderateScale(4),
  },
  otherMessageBubble: {
    borderBottomLeftRadius: moderateScale(4),
  },
  messageText: {
    fontSize: moderateScale(15),
    lineHeight: moderateScale(20),
  },
  messageImage: {
    width: scale(200),
    height: scale(200),
    borderRadius: moderateScale(12),
    marginBottom: scale(8),
  },
  imageCaption: {
    marginTop: scale(4),
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    fontSize: moderateScale(20),
    marginRight: scale(8),
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: scale(4),
  },
  timestamp: {
    fontSize: moderateScale(11),
    marginRight: scale(4),
  },
  readIndicator: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
});
