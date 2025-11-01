/**
 * ReplyPreview - Xabar yuborishda quoted message ko'rsatish
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { scale, moderateScale } from '../utils/responsive';

interface ReplyPreviewProps {
  replyTo: {
    id: string;
    content: string;
    senderName: string;
  };
  onCancel: () => void;
}

export const ReplyPreview: React.FC<ReplyPreviewProps> = ({
  replyTo,
  onCancel,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderLeftColor: theme.primary,
        },
      ]}
    >
      <View style={styles.contentContainer}>
        <Text
          style={[styles.senderName, { color: theme.primary }]}
          numberOfLines={1}
        >
          {replyTo.senderName}
        </Text>
        <Text
          style={[styles.messageContent, { color: theme.textSecondary }]}
          numberOfLines={2}
        >
          {replyTo.content}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onCancel}
        style={styles.cancelButton}
        accessibilityLabel="Cancel reply"
        accessibilityRole="button"
      >
        <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
          ✕
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(12),
    paddingVertical: scale(8),
    borderLeftWidth: 3,
    borderRadius: moderateScale(8),
  },
  contentContainer: {
    flex: 1,
    marginRight: scale(8),
  },
  senderName: {
    fontSize: moderateScale(13),
    fontWeight: '600',
    marginBottom: scale(2),
  },
  messageContent: {
    fontSize: moderateScale(13),
  },
  cancelButton: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
  },
});
