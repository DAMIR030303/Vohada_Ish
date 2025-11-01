/**
 * ConversationItem - Chat ro'yxatidagi har bir suhbat elementi
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ViewStyle,
} from 'react-native';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Conversation } from '../types';
import { formatDistanceToNow } from '../utils/formatters';
import { scale, moderateScale } from '../utils/responsive';

interface ConversationItemProps {
  conversation: Conversation;
  onPress?: (conversationId: string) => void;
  style?: ViewStyle;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  onPress,
  style,
}) => {
  const { user } = useAuth();
  const { theme } = useTheme();

  // Boshqa user'ni topamiz
  const otherUserId = conversation.participants.find((p) => p !== user?.id);
  const otherUser = otherUserId
    ? conversation.participantDetails?.[otherUserId]
    : null;

  // O'qilmagan xabarlar soni
  const unreadCount = user?.id ? conversation.unreadCount?.[user.id] || 0 : 0;

  // Typing indicator
  const isTyping = otherUserId
    ? conversation.typing?.[otherUserId] || false
    : false;

  // Default avatar (initials)
  const getInitials = (name?: string) => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.surface }, style]}
      onPress={() => onPress?.(conversation.id)}
      activeOpacity={0.7}
      accessibilityLabel={`Conversation with ${otherUser?.name || 'Unknown'}`}
      accessibilityHint="Double tap to open conversation"
      accessibilityRole="button"
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {otherUser?.avatar ? (
          <Image
            source={{ uri: otherUser.avatar }}
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
              {getInitials(otherUser?.name)}
            </Text>
          </View>
        )}
        {/* Online indicator */}
        {otherUser?.online && (
          <View
            testID="online-indicator"
            style={[styles.onlineIndicator, { borderColor: theme.surface }]}
          />
        )}
        {/* Unread badge */}
        {unreadCount > 0 && (
          <View
            style={[styles.unreadBadge, { backgroundColor: theme.secondary }]}
          >
            <Text style={styles.unreadText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Name va Timestamp */}
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            {conversation.isPinned && (
              <Text style={styles.pinIcon} testID="pin-icon">
                📌
              </Text>
            )}
            <Text
              style={[
                styles.name,
                { color: theme.text },
                unreadCount > 0 && styles.nameUnread,
              ]}
              numberOfLines={1}
            >
              {otherUser?.name || 'Unknown User'}
            </Text>
          </View>
          {conversation.lastMessage && (
            <Text style={[styles.timestamp, { color: theme.textSecondary }]}>
              {formatDistanceToNow(conversation.lastMessage.createdAt)}
            </Text>
          )}
        </View>

        {/* Job title (agar mavjud bo'lsa) */}
        {conversation.jobTitle && (
          <Text
            style={[styles.jobTitle, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            📋 {conversation.jobTitle}
          </Text>
        )}

        {/* Last message yoki typing indicator */}
        {isTyping ? (
          <View style={styles.typingContainer}>
            <Text style={[styles.typingText, { color: theme.primary }]}>
              typing
            </Text>
            <View style={styles.typingDots}>
              <View
                style={[styles.typingDot, { backgroundColor: theme.primary }]}
              />
              <View
                style={[styles.typingDot, { backgroundColor: theme.primary }]}
              />
              <View
                style={[styles.typingDot, { backgroundColor: theme.primary }]}
              />
            </View>
          </View>
        ) : conversation.lastMessage ? (
          <Text
            style={[
              styles.lastMessage,
              { color: theme.textSecondary },
              unreadCount > 0 && [
                styles.lastMessageUnread,
                { color: theme.text },
              ],
            ]}
            numberOfLines={1}
          >
            {conversation.lastMessage.senderId === user?.id && 'You: '}
            {conversation.lastMessage.content}
          </Text>
        ) : (
          <Text style={[styles.noMessages, { color: theme.textSecondary }]}>
            No messages yet
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: scale(16),
    borderRadius: moderateScale(12),
    marginHorizontal: scale(16),
    marginVertical: scale(6),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: scale(12),
  },
  avatar: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
  },
  avatarPlaceholder: {
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: moderateScale(20),
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: scale(14),
    height: scale(14),
    borderRadius: scale(7),
    backgroundColor: '#4CAF50',
    borderWidth: 2,
  },
  unreadBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(6),
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: moderateScale(11),
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: scale(8),
  },
  pinIcon: {
    fontSize: moderateScale(14),
    marginRight: scale(4),
  },
  name: {
    fontSize: moderateScale(16),
    fontWeight: '600',
    flex: 1,
  },
  nameUnread: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: moderateScale(12),
  },
  jobTitle: {
    fontSize: moderateScale(13),
    marginBottom: scale(2),
  },
  lastMessage: {
    fontSize: moderateScale(14),
  },
  lastMessageUnread: {
    fontWeight: '600',
  },
  noMessages: {
    fontSize: moderateScale(14),
    fontStyle: 'italic',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingText: {
    fontSize: moderateScale(14),
    fontStyle: 'italic',
    marginRight: scale(4),
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: scale(4),
    height: scale(4),
    borderRadius: scale(2),
    marginHorizontal: scale(2),
  },
});
