/**
 * EmojiPicker - Emoji reactions uchun picker komponenti
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { scale, moderateScale } from '../utils/responsive';

interface EmojiPickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectEmoji: (emoji: string) => void;
}

const COMMON_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🔥', '💯', '👏'];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({
  visible,
  onClose,
  onSelectEmoji,
}) => {
  const { theme } = useTheme();

  const handleSelectEmoji = (emoji: string) => {
    onSelectEmoji(emoji);
    onClose();
  };

  const renderEmoji = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.emojiButton}
      onPress={() => handleSelectEmoji(item)}
      activeOpacity={0.7}
      accessibilityLabel={`Select emoji ${item}`}
      accessibilityRole="button"
    >
      <Text style={styles.emoji}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
        accessibilityLabel="Close emoji picker"
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <FlatList
            data={COMMON_EMOJIS}
            renderItem={renderEmoji}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    borderRadius: moderateScale(20),
    borderWidth: 1,
    padding: scale(8),
    maxWidth: '80%',
  },
  listContent: {
    paddingHorizontal: scale(4),
  },
  emojiButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(2),
  },
  emoji: {
    fontSize: moderateScale(24),
  },
});
