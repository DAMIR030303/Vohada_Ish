/**
 * ChatScreen - Individual chat interfeysi
 */

import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { ChatMessage } from '../components/ChatMessage';
import { LottieEmptyState } from '../components/LottieEmptyState';
import { MessageInput } from '../components/MessageInput';
import { useAuth } from '../context/AuthContext';
import { useMessages } from '../context/MessageContext';
import { useTheme } from '../context/ThemeContext';
import { Message } from '../types';
import { scale, moderateScale } from '../utils/responsive';

type RootStackParamList = {
  Chat: { conversationId: string };
  ChatList: undefined;
};

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ChatScreen: React.FC = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const {
    currentConversation,
    messages,
    sendMessage,
    setTyping,
    removeConversation,
    error,
    selectConversation,
  } = useMessages();

  const flatListRef = useRef<FlatList>(null);

  // Route params
  const { conversationId } = route.params;

  // Conversation'ni tanlash (ekran yuklanishida)
  useEffect(() => {
    if (conversationId) {
      selectConversation(conversationId);
    }
  }, [conversationId, selectConversation]);

  /**
   * Ekran yuklanishida oxirgi xabarga scroll
   */
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  /**
   * Boshqa user ma'lumotlari
   */
  const otherUserId = currentConversation?.participants.find(
    (p) => p !== user?.id,
  );
  const otherUser = otherUserId
    ? currentConversation?.participantDetails?.[otherUserId]
    : null;
  const isOtherUserTyping = otherUserId
    ? currentConversation?.typing?.[otherUserId] || false
    : false;

  /**
   * Conversation o'chirish
   */
  const handleDeleteConversation = useCallback(() => {
    Alert.alert(
      "Suhbatni o'chirish",
      "Ushbu suhbatni o'chirmoqchimisiz? Barcha xabarlar o'chiriladi.",
      [
        {
          text: 'Bekor qilish',
          style: 'cancel',
        },
        {
          text: "O'chirish",
          style: 'destructive',
          onPress: async () => {
            try {
              await removeConversation(conversationId);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Xatolik', "Suhbatni o'chirishda xatolik yuz berdi");
            }
          },
        },
      ],
    );
  }, [conversationId, removeConversation, navigation]);

  /**
   * Header o'ng tomonda o'chirish tugmasi
   */
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleDeleteConversation}
          style={styles.deleteButton}
          accessibilityLabel="Delete conversation"
          accessibilityRole="button"
        >
          <Text style={{ color: theme.error || '#F44336', fontSize: 16 }}>
            🗑️
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme, handleDeleteConversation]);

  /**
   * Xabar yuborish
   */
  const handleSendMessage = useCallback(
    async (content: string) => {
      try {
        await sendMessage(content);
        // Yuborilgandan so'ng oxirga scroll
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } catch (err) {
        console.error('Failed to send message:', err);
        Alert.alert('Xatolik', 'Xabar yuborishda xatolik yuz berdi');
      }
    },
    [sendMessage],
  );

  /**
   * Typing indicator
   */
  const handleTyping = useCallback(
    (isTyping: boolean) => {
      setTyping(isTyping);
    },
    [setTyping],
  );

  /**
   * Render message item
   */
  const renderItem = useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      // Avvalgi xabar boshqa user'danmi?
      const prevMessage = index > 0 ? messages[index - 1] : null;
      const showAvatar = !prevMessage || prevMessage.senderId !== item.senderId;

      return <ChatMessage message={item} showAvatar={showAvatar} />;
    },
    [messages],
  );

  /**
   * Key extractor
   */
  const keyExtractor = useCallback((item: Message) => item.id, []);

  /**
   * Empty state
   */
  const ListEmptyComponent = useCallback(() => {
    return (
      <LottieEmptyState
        title="Xabarlar yo'q"
        subtitle="Birinchi xabarni yuboring!"
      />
    );
  }, []);

  /**
   * Header component (typing indicator)
   */
  const ListHeaderComponent = useCallback(() => {
    if (isOtherUserTyping) {
      return (
        <View style={styles.typingIndicatorContainer}>
          <Text style={[styles.typingIndicatorText, { color: theme.primary }]}>
            {otherUser?.name || 'User'} yozmoqda...
          </Text>
        </View>
      );
    }
    return null;
  }, [isOtherUserTyping, otherUser?.name, theme]);

  /**
   * Error state
   */
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <LottieEmptyState
          title="Xatolik yuz berdi"
          subtitle={error}
          actionText="Orqaga"
          onAction={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListHeaderComponent}
        contentContainerStyle={[
          styles.listContent,
          messages.length === 0 && styles.emptyListContent,
        ]}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Messages list"
      />

      {/* Message Input */}
      <MessageInput
        onSend={handleSendMessage}
        onTyping={handleTyping}
        placeholder={`${otherUser?.name || 'User'} ga yozing...`}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: scale(8),
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  deleteButton: {
    padding: scale(8),
    marginRight: scale(8),
  },
  typingIndicatorContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    alignItems: 'flex-start',
  },
  typingIndicatorText: {
    fontSize: moderateScale(13),
    fontStyle: 'italic',
  },
});
