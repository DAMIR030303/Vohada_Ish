/**
 * Firebase Chat servisi
 */

import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  Timestamp,
  serverTimestamp,
  getDoc,
  limit as firestoreLimit,
} from 'firebase/firestore';

import { Conversation, Message } from '../types';

import { db } from './firebase';

/**
 * Firebase konfiguratsiyasini tekshirish
 */
const checkFirebaseConfig = () => {
  if (!db) {
    throw new Error('Firebase konfiguratsiyasi topilmadi');
  }
};

/**
 * Yangi conversation yaratish yoki mavjudini topish
 */
export const getOrCreateConversation = async (
  currentUserId: string,
  otherUserId: string,
  jobId?: string,
): Promise<string> => {
  checkFirebaseConfig();

  // Mavjud conversation'ni topish
  const conversationsRef = collection(db!, 'conversations');
  const q = query(
    conversationsRef,
    where('participants', 'array-contains', currentUserId),
  );

  const querySnapshot = await getDocs(q);

  // Ikki user o'rtasidagi conversation'ni topish
  const existingConversation = querySnapshot.docs.find((doc) => {
    const data = doc.data();
    return data.participants.includes(otherUserId);
  });

  if (existingConversation) {
    return existingConversation.id;
  }

  // Yangi conversation yaratish
  const newConversation = {
    participants: [currentUserId, otherUserId],
    jobId: jobId || null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastMessage: null,
  };

  const docRef = await addDoc(conversationsRef, newConversation);
  return docRef.id;
};

/**
 * Foydalanuvchining barcha conversation'larini olish (real-time)
 */
export const subscribeToConversations = (
  userId: string,
  onUpdate: (conversations: Conversation[]) => void,
  onError?: (error: Error) => void,
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
    (snapshot) => {
      const conversations: Conversation[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          participants: data.participants,
          jobId: data.jobId,
          lastMessage: data.lastMessage
            ? {
                id: data.lastMessage.id,
                conversationId: doc.id,
                senderId: data.lastMessage.senderId,
                receiverId: data.lastMessage.receiverId,
                content: data.lastMessage.content,
                read: data.lastMessage.read,
                createdAt: data.lastMessage.createdAt?.toDate() || new Date(),
              }
            : undefined,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
      });
      onUpdate(conversations);
    },
    (error) => {
      console.error('Conversation subscription error:', error);
      if (onError) {
        onError(error);
      }
    },
  );

  return unsubscribe;
};

/**
 * Conversation'dagi xabarlarni olish (real-time)
 */
export const subscribeToMessages = (
  conversationId: string,
  onUpdate: (messages: Message[]) => void,
  onError?: (error: Error) => void,
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
    (snapshot) => {
      const messages: Message[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          conversationId: data.conversationId,
          senderId: data.senderId,
          receiverId: data.receiverId,
          content: data.content,
          read: data.read,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });
      onUpdate(messages);
    },
    (error) => {
      console.error('Messages subscription error:', error);
      if (onError) {
        onError(error);
      }
    },
  );

  return unsubscribe;
};

/**
 * Yangi xabar yuborish
 */
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  receiverId: string,
  content: string,
): Promise<void> => {
  checkFirebaseConfig();

  // Xabarni qo'shish
  const messagesRef = collection(db!, 'messages');
  const messageData = {
    conversationId,
    senderId,
    receiverId,
    content,
    read: false,
    createdAt: serverTimestamp(),
  };

  const messageDoc = await addDoc(messagesRef, messageData);

  // Conversation'ni yangilash (lastMessage va updatedAt)
  const conversationRef = doc(db!, 'conversations', conversationId);
  await updateDoc(conversationRef, {
    lastMessage: {
      id: messageDoc.id,
      senderId,
      receiverId,
      content,
      read: false,
      createdAt: Timestamp.now(),
    },
    updatedAt: serverTimestamp(),
  });
};

/**
 * Xabarni o'qilgan deb belgilash
 */
export const markMessageAsRead = async (messageId: string): Promise<void> => {
  checkFirebaseConfig();

  const messageRef = doc(db!, 'messages', messageId);
  await updateDoc(messageRef, {
    read: true,
  });
};

/**
 * Conversation'dagi barcha o'qilmagan xabarlarni o'qilgan deb belgilash
 */
export const markConversationAsRead = async (
  conversationId: string,
  currentUserId: string,
): Promise<void> => {
  checkFirebaseConfig();

  const messagesRef = collection(db!, 'messages');
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    where('receiverId', '==', currentUserId),
    where('read', '==', false),
  );

  const querySnapshot = await getDocs(q);

  const updatePromises = querySnapshot.docs.map((document) =>
    updateDoc(doc(db!, 'messages', document.id), { read: true }),
  );

  await Promise.all(updatePromises);

  // Conversation'dagi lastMessage ni ham yangilash
  const conversationRef = doc(db!, 'conversations', conversationId);
  const conversationSnap = await getDoc(conversationRef);

  if (conversationSnap.exists()) {
    const data = conversationSnap.data();
    if (data.lastMessage && data.lastMessage.receiverId === currentUserId) {
      await updateDoc(conversationRef, {
        'lastMessage.read': true,
      });
    }
  }
};

/**
 * O'qilmagan xabarlar sonini olish
 */
export const getUnreadCount = async (
  conversationId: string,
  userId: string,
): Promise<number> => {
  checkFirebaseConfig();

  const messagesRef = collection(db!, 'messages');
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    where('receiverId', '==', userId),
    where('read', '==', false),
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.size;
};

/**
 * Oxirgi xabarlarni olish (pagination uchun)
 */
export const getRecentMessages = async (
  conversationId: string,
  limitCount: number = 50,
): Promise<Message[]> => {
  checkFirebaseConfig();

  const messagesRef = collection(db!, 'messages');
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    orderBy('createdAt', 'desc'),
    firestoreLimit(limitCount),
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs
    .map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        conversationId: data.conversationId,
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        read: data.read,
        createdAt: data.createdAt?.toDate() || new Date(),
      };
    })
    .reverse(); // Eskidan yangiga
};
