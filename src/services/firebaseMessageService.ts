/**
 * Firebase Message Service
 * Real-time messaging funksiyalari
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  getDoc,
  serverTimestamp,
  QuerySnapshot,
  DocumentData,
  writeBatch,
} from 'firebase/firestore';

import { Message, Conversation, User } from '../types';
import { checkFirebaseConfig } from '../utils/firebaseHelpers';

import { db } from './firebase';

/**
 * Conversation yaratish yoki mavjudini topish
 */
export const getOrCreateConversation = async (
  currentUserId: string,
  otherUserId: string,
  jobId?: string,
  jobTitle?: string,
): Promise<string> => {
  checkFirebaseConfig();
  try {
    // Avval mavjud conversation borligini tekshiramiz
    const conversationsRef = collection(db!, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', currentUserId),
    );

    const querySnapshot = await getDocs(q);
    let existingConversationId: string | null = null;

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data.participants.includes(otherUserId)) {
        // Agar jobId berilgan bo'lsa, aynan shu job uchun conversation topamiz
        if (!jobId || data.jobId === jobId) {
          existingConversationId = docSnap.id;
        }
      }
    });

    if (existingConversationId) {
      return existingConversationId;
    }

    // Yangi conversation yaratamiz
    const newConversation: Omit<Conversation, 'id'> = {
      participants: [currentUserId, otherUserId],
      jobId,
      jobTitle,
      createdAt: new Date(),
      updatedAt: new Date(),
      unreadCount: {
        [currentUserId]: 0,
        [otherUserId]: 0,
      },
    };

    const docRef = await addDoc(conversationsRef, {
      ...newConversation,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error getting or creating conversation:', error);
    throw error;
  }
};

/**
 * Xabar yuborish
 */
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  senderName: string,
  receiverId: string,
  content: string,
  type: Message['type'] = 'text',
  mediaUrl?: string,
  senderAvatar?: string,
): Promise<void> => {
  checkFirebaseConfig();
  try {
    const messagesRef = collection(db!, 'messages');
    const conversationRef = doc(db!, 'conversations', conversationId);

    const newMessage: Omit<Message, 'id'> = {
      conversationId,
      senderId,
      senderName,
      senderAvatar,
      receiverId,
      content,
      type,
      mediaUrl,
      read: false,
      createdAt: new Date(),
    };

    // Message qo'shamiz
    await addDoc(messagesRef, {
      ...newMessage,
      createdAt: serverTimestamp(),
    });

    // Conversation'ni yangilaymiz
    const conversationSnap = await getDoc(conversationRef);
    const conversationData = conversationSnap.data();
    const currentUnreadCount = conversationData?.unreadCount || {};

    await updateDoc(conversationRef, {
      lastMessage: {
        content,
        senderId,
        createdAt: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
      unreadCount: {
        ...currentUnreadCount,
        [receiverId]: (currentUnreadCount[receiverId] || 0) + 1,
      },
    });
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

/**
 * Conversation'dagi barcha xabarlarni real-time kuzatish
 */
export const subscribeToMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void,
): (() => void) => {
  checkFirebaseConfig();
  const messagesRef = collection(db!, 'messages');
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    orderBy('createdAt', 'asc'),
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const messages: Message[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        messages.push({
          id: docSnap.id,
          conversationId: data.conversationId,
          senderId: data.senderId,
          senderName: data.senderName,
          senderAvatar: data.senderAvatar,
          receiverId: data.receiverId,
          content: data.content,
          type: data.type || 'text',
          mediaUrl: data.mediaUrl,
          read: data.read,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });
      callback(messages);
    },
    (error) => {
      console.error('Error subscribing to messages:', error);
    },
  );

  return unsubscribe;
};

/**
 * User'ning barcha conversation'larini real-time kuzatish
 */
export const subscribeToConversations = (
  userId: string,
  callback: (conversations: Conversation[]) => void,
  errorCallback?: (error: Error) => void,
): (() => void) => {
  checkFirebaseConfig();
  const conversationsRef = collection(db!, 'conversations');
  const q = query(
    conversationsRef,
    where('participants', 'array-contains', userId),
    orderBy('updatedAt', 'desc'),
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const conversations: Conversation[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        conversations.push({
          id: docSnap.id,
          participants: data.participants,
          participantDetails: data.participantDetails,
          jobId: data.jobId,
          jobTitle: data.jobTitle,
          lastMessage: data.lastMessage
            ? {
                content: data.lastMessage.content,
                senderId: data.lastMessage.senderId,
                createdAt: data.lastMessage.createdAt?.toDate() || new Date(),
              }
            : undefined,
          unreadCount: data.unreadCount,
          typing: data.typing,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });
      callback(conversations);
    },
    (error) => {
      console.error('Error subscribing to conversations:', error);
      if (errorCallback) {
        errorCallback(error as Error);
      }
    },
  );

  return unsubscribe;
};

/**
 * Xabarlarni o'qilgan deb belgilash
 */
export const markMessagesAsRead = async (
  conversationId: string,
  userId: string,
): Promise<void> => {
  checkFirebaseConfig();
  try {
    const batch = writeBatch(db!);

    // Barcha o'qilmagan xabarlarni topamiz
    const messagesRef = collection(db!, 'messages');
    const q = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      where('receiverId', '==', userId),
      where('read', '==', false),
    );

    const snapshot = await getDocs(q);

    // Barcha xabarlarni o'qilgan deb belgilaymiz
    snapshot.forEach((docSnap) => {
      batch.update(doc(db!, 'messages', docSnap.id), { read: true });
    });

    // Conversation'dagi unread count'ni 0 qilamiz
    const conversationRef = doc(db!, 'conversations', conversationId);
    const conversationSnap = await getDoc(conversationRef);
    const conversationData = conversationSnap.data();
    const currentUnreadCount = conversationData?.unreadCount || {};

    batch.update(conversationRef, {
      unreadCount: {
        ...currentUnreadCount,
        [userId]: 0,
      },
    });

    await batch.commit();
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};

/**
 * Typing indicator yangilash
 */
export const updateTypingStatus = async (
  conversationId: string,
  userId: string,
  isTyping: boolean,
): Promise<void> => {
  checkFirebaseConfig();
  try {
    const conversationRef = doc(db!, 'conversations', conversationId);
    const conversationSnap = await getDoc(conversationRef);
    const conversationData = conversationSnap.data();
    const currentTyping = conversationData?.typing || {};

    await updateDoc(conversationRef, {
      typing: {
        ...currentTyping,
        [userId]: isTyping,
      },
    });
  } catch (error) {
    console.error('Error updating typing status:', error);
  }
};

/**
 * Conversation'ni o'chirish
 */
export const deleteConversation = async (
  conversationId: string,
): Promise<void> => {
  checkFirebaseConfig();
  try {
    // Avval barcha xabarlarni o'chiramiz
    const messagesRef = collection(db!, 'messages');
    const q = query(messagesRef, where('conversationId', '==', conversationId));
    const snapshot = await getDocs(q);

    const batch = writeBatch(db!);
    snapshot.forEach((docSnap) => {
      batch.delete(doc(db!, 'messages', docSnap.id));
    });

    // Conversation'ni o'chiramiz
    batch.delete(doc(db!, 'conversations', conversationId));

    await batch.commit();
  } catch (error) {
    console.error('Error deleting conversation:', error);
    throw error;
  }
};

/**
 * User ma'lumotlarini olish (participant details uchun)
 */
export const getUserDetails = async (userId: string): Promise<User | null> => {
  checkFirebaseConfig();
  try {
    const userRef = doc(db!, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: userSnap.id,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        avatar: data.avatar,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting user details:', error);
    return null;
  }
};

/**
 * Conversation participant details'ni yangilash
 */
export const updateParticipantDetails = async (
  conversationId: string,
  participantId: string,
  details: { name: string; avatar?: string; online?: boolean },
): Promise<void> => {
  checkFirebaseConfig();
  try {
    const conversationRef = doc(db!, 'conversations', conversationId);
    const conversationSnap = await getDoc(conversationRef);
    const conversationData = conversationSnap.data();
    const currentDetails = conversationData?.participantDetails || {};

    await updateDoc(conversationRef, {
      participantDetails: {
        ...currentDetails,
        [participantId]: details,
      },
    });
  } catch (error) {
    console.error('Error updating participant details:', error);
  }
};
