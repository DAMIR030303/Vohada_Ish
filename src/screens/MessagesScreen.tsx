/**
 * Xabarlar/Chat ro'yxati ekrani
 */

import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';

import { ConversationItem } from '../components/ConversationItem';
import { LottieEmptyState } from '../components/LottieEmptyState';
import { colors } from '../constants/colors';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../context/LanguageContext';
import { useConversations } from '../hooks/useChat';
import { Conversation } from '../types';

export const MessagesScreen: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { conversations, loading, error } = useConversations(user?.id || '');

  const handleConversationPress = (conversation: Conversation) => {
    // ChatScreen'ga o'tish
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigation as any).navigate('Chat', {
      conversationId: conversation.id,
      otherUserId: conversation.participants.find((id) => id !== user?.id),
    });
  };

  const renderItem = ({ item }: { item: Conversation }) => (
    <ConversationItem
      conversation={item}
      onPress={() => handleConversationPress(item)}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error.message || t('common.error')}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('messages.title')}</Text>
      </View>

      {/* Conversations List */}
      {conversations.length === 0 ? (
        <LottieEmptyState
          title={t('messages.noConversations')}
          subtitle={t('messages.startMessaging')}
        />
      ) : (
        <FlatList
          data={conversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  listContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
});
