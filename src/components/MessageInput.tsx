/**
 * MessageInput - Xabar yozish va yuborish komponenti
 */

import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { triggerHaptic, HapticType } from '../utils/haptics';
import { scale, moderateScale } from '../utils/responsive';
import { playSound, SoundType } from '../utils/soundEffects';

interface MessageInputProps {
  onSend: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  placeholder?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSend,
  onTyping,
  placeholder = 'Xabar yozing...',
  disabled = false,
  style,
}) => {
  const { theme } = useTheme();
  const [message, setMessage] = useState('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChangeText = (text: string) => {
    setMessage(text);

    // Typing indicator
    if (onTyping) {
      onTyping(true);

      // Agar 3 soniya davomida yozmasa, typing'ni to'xtatamiz
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        onTyping(false);
      }, 3000);
    }
  };

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || disabled) return;

    try {
      // Typing indicator'ni to'xtatamiz
      if (onTyping) {
        onTyping(false);
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      }

      // Xabarni yuboramiz
      await onSend(trimmedMessage);

      // Input'ni tozalaymiz
      setMessage('');

      // Haptic va sound feedback
      triggerHaptic(HapticType.LIGHT);
      playSound(SoundType.SUCCESS);
    } catch (error) {
      console.error('Failed to send message:', error);
      triggerHaptic(HapticType.ERROR);
    }
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: theme.surface, borderTopColor: theme.border },
          style,
        ]}
      >
        {/* Text Input */}
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.background,
              color: theme.text,
              borderColor: theme.border,
            },
          ]}
          value={message}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          multiline
          maxLength={1000}
          editable={!disabled}
          accessibilityLabel="Message input"
          accessibilityHint="Type your message here"
        />

        {/* Send Button */}
        <TouchableOpacity
          style={[
            styles.sendButton,
            {
              backgroundColor: canSend ? theme.primary : theme.border,
            },
          ]}
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.7}
          accessibilityLabel="Send message"
          accessibilityHint="Double tap to send message"
          accessibilityRole="button"
        >
          <View style={styles.sendIconContainer}>
            <View style={styles.sendIcon}>
              <View
                style={[
                  styles.sendArrow,
                  {
                    borderLeftColor: canSend ? '#FFFFFF' : theme.textSecondary,
                  },
                ]}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderTopWidth: 1,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    minHeight: scale(44),
    maxHeight: scale(120),
    borderRadius: moderateScale(22),
    paddingHorizontal: scale(16),
    paddingVertical: scale(10),
    fontSize: moderateScale(15),
    borderWidth: 1,
    marginRight: scale(8),
  },
  sendButton: {
    width: scale(44),
    height: scale(44),
    borderRadius: scale(22),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  sendIconContainer: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    width: scale(20),
    height: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: scale(12),
    borderRightWidth: 0,
    borderBottomWidth: scale(6),
    borderTopWidth: scale(6),
    borderLeftColor: '#FFFFFF',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    transform: [{ rotate: '-90deg' }],
  },
});
