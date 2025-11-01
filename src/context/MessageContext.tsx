/**
 * MessageContext - Chat va messaging state boshqaruvi
 */

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef,
} from 'react';

import {
  getOrCreateConversation,
  sendMessage as sendMessageService,
  subscribeToMessages,
  subscribeToConversations,
  markMessagesAsRead,
  updateTypingStatus,
  deleteConversation,
  getUserDetails,
  updateParticipantDetails,
} from '../services/firebaseMessageService';
import { Message, Conversation } from '../types';

import { useAuth } from './AuthContext';

interface MessageContextType {
  // State
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;

  // Actions
  startConversation: (
    otherUserId: string,
    jobId?: string,
    jobTitle?: string,
  ) => Promise<string>;
  selectConversation: (conversationId: string) => void;
  sendMessage: (content: string, type?: Message['type']) => Promise<void>;
  markAsRead: (conversationId: string) => Promise<void>;
  setTyping: (isTyping: boolean) => void;
  removeConversation: (conversationId: string) => Promise<void>;
  getTotalUnreadCount: () => number;
  clearError: () => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Unsubscribe functions
  const unsubscribeConversations = useRef<(() => void) | null>(null);
  const unsubscribeMessages = useRef<(() => void) | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * User'ning barcha conversation'larini real-time kuzatish
   */
  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    unsubscribeConversations.current = subscribeToConversations(
      user.id,
      async (fetchedConversations) => {
        // Har bir conversation uchun participant detailsni to'ldiramiz
        const conversationsWithDetails = await Promise.all(
          fetchedConversations.map(async (conv) => {
            const otherUserId = conv.participants.find((p) => p !== user.id);
            if (!otherUserId) return conv;

            // Agar participant details yo'q bo'lsa, olib kelamiz
            if (!conv.participantDetails?.[otherUserId]) {
              const userDetails = await getUserDetails(otherUserId);
              if (userDetails) {
                await updateParticipantDetails(conv.id, otherUserId, {
                  name: userDetails.fullName,
                  avatar: userDetails.avatar,
                  online: false,
                });
                return {
                  ...conv,
                  participantDetails: {
                    ...conv.participantDetails,
                    [otherUserId]: {
                      name: userDetails.fullName,
                      avatar: userDetails.avatar,
                      online: false,
                    },
                  },
                };
              }
            }
            return conv;
          }),
        );

        setConversations(conversationsWithDetails);
        setLoading(false);
      },
    );

    return () => {
      if (unsubscribeConversations.current) {
        unsubscribeConversations.current();
      }
    };
  }, [user?.id]);

  /**
   * Tanlangan conversation'ning xabarlarini real-time kuzatish
   */
  useEffect(() => {
    if (!currentConversation?.id) {
      setMessages([]);
      return;
    }

    // Eski subscription'ni bekor qilamiz
    if (unsubscribeMessages.current) {
      unsubscribeMessages.current();
    }

    unsubscribeMessages.current = subscribeToMessages(
      currentConversation.id,
      (fetchedMessages) => {
        setMessages(fetchedMessages);
      },
    );

    return () => {
      if (unsubscribeMessages.current) {
        unsubscribeMessages.current();
      }
    };
  }, [currentConversation?.id]);

  /**
   * Yangi conversation boshlash yoki mavjudini tanlash
   */
  const startConversation = useCallback(
    async (
      otherUserId: string,
      jobId?: string,
      jobTitle?: string,
    ): Promise<string> => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      try {
        setLoading(true);
        setError(null);
        const conversationId = await getOrCreateConversation(
          user.id,
          otherUserId,
          jobId,
          jobTitle,
        );
        setLoading(false);
        return conversationId;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to start conversation';
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    },
    [user?.id],
  );

  /**
   * Conversation'ni tanlash
   */
  const selectConversation = useCallback(
    (conversationId: string) => {
      const conversation = conversations.find((c) => c.id === conversationId);
      if (conversation) {
        setCurrentConversation(conversation);
        // Xabarlarni o'qilgan deb belgilaymiz
        if (user?.id && conversation.unreadCount?.[user.id]) {
          markAsRead(conversationId);
        }
      }
    },
    [conversations, user?.id],
  );

  /**
   * Xabar yuborish
   */
  const sendMessage = useCallback(
    async (content: string, type: Message['type'] = 'text') => {
      if (!user?.id || !currentConversation) {
        throw new Error('No conversation selected');
      }

      const otherUserId = currentConversation.participants.find(
        (p) => p !== user.id,
      );
      if (!otherUserId) {
        throw new Error('Invalid conversation');
      }

      try {
        setError(null);
        await sendMessageService(
          currentConversation.id,
          user.id,
          user.fullName,
          otherUserId,
          content,
          type,
          undefined,
          user.avatar,
        );

        // Typing indicator'ni to'xtatamiz
        await updateTypingStatus(currentConversation.id, user.id, false);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to send message';
        setError(errorMessage);
        throw err;
      }
    },
    [user, currentConversation],
  );

  /**
   * Xabarlarni o'qilgan deb belgilash
   */
  const markAsRead = useCallback(
    async (conversationId: string) => {
      if (!user?.id) return;

      try {
        await markMessagesAsRead(conversationId, user.id);
      } catch (err) {
        console.error('Failed to mark messages as read:', err);
      }
    },
    [user?.id],
  );

  /**
   * Typing indicator
   */
  const setTyping = useCallback(
    async (isTyping: boolean) => {
      if (!user?.id || !currentConversation) return;

      try {
        await updateTypingStatus(currentConversation.id, user.id, isTyping);

        // Agar typing true bo'lsa, 3 soniyadan keyin false qilamiz
        if (isTyping) {
          if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
          }
          typingTimeout.current = setTimeout(() => {
            updateTypingStatus(currentConversation.id, user.id, false);
          }, 3000);
        }
      } catch (err) {
        console.error('Failed to update typing status:', err);
      }
    },
    [user?.id, currentConversation],
  );

  /**
   * Conversation'ni o'chirish
   */
  const removeConversation = useCallback(
    async (conversationId: string) => {
      try {
        setError(null);
        await deleteConversation(conversationId);
        if (currentConversation?.id === conversationId) {
          setCurrentConversation(null);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to delete conversation';
        setError(errorMessage);
        throw err;
      }
    },
    [currentConversation?.id],
  );

  /**
   * Jami o'qilmagan xabarlar soni
   */
  const getTotalUnreadCount = useCallback(() => {
    if (!user?.id) return 0;
    return conversations.reduce((total, conv) => {
      return total + (conv.unreadCount?.[user.id] || 0);
    }, 0);
  }, [conversations, user?.id]);

  /**
   * Xatolikni tozalash
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: MessageContextType = {
    conversations,
    currentConversation,
    messages,
    loading,
    error,
    startConversation,
    selectConversation,
    sendMessage,
    markAsRead,
    setTyping,
    removeConversation,
    getTotalUnreadCount,
    clearError,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

/**
 * MessageContext'ni ishlatish hook'i
 */
export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
