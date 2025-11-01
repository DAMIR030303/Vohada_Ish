/**
 * Chat hook'lari
 */

import { useState, useEffect, useCallback } from 'react';

import * as messageService from '../services/firebaseMessageService';
import { Message, Conversation } from '../types';

/**
 * Conversation'larni olish hook'i
 */
export const useConversations = (userId: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setConversations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = messageService.subscribeToConversations(
      userId,
      (newConversations) => {
        setConversations(newConversations);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err as Error);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [userId]);

  return { conversations, loading, error };
};

/**
 * Xabarlarni olish hook'i
 */
export const useMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = messageService.subscribeToMessages(
      conversationId,
      (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
        setError(null);
      },
    );

    return unsubscribe;
  }, [conversationId]);

  return { messages, loading, error };
};

/**
 * Xabar yuborish hook'i
 */
export const useSendMessage = () => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(
    async (
      conversationId: string,
      senderId: string,
      senderName: string,
      receiverId: string,
      content: string,
      senderAvatar?: string,
    ) => {
      try {
        setSending(true);
        setError(null);
        await messageService.sendMessage(
          conversationId,
          senderId,
          senderName,
          receiverId,
          content,
          'text',
          undefined,
          senderAvatar,
        );
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setSending(false);
      }
    },
    [],
  );

  return { sendMessage, sending, error };
};

/**
 * Conversation yaratish yoki topish hook'i
 */
export const useGetOrCreateConversation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getOrCreateConversation = useCallback(
    async (
      currentUserId: string,
      otherUserId: string,
      jobId?: string,
      jobTitle?: string,
    ) => {
      try {
        setLoading(true);
        setError(null);
        const conversationId = await messageService.getOrCreateConversation(
          currentUserId,
          otherUserId,
          jobId,
          jobTitle,
        );
        return conversationId;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { getOrCreateConversation, loading, error };
};
