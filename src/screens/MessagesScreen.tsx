/**
 * Xabarlar/Chat ro'yxati ekrani
 */

import { useNavigation } from '@react-navigation/native';
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  RefreshControl,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Search filter
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;

    const query = searchQuery.toLowerCase();
    return conversations.filter((conv) => {
      const otherUserId = conv.participants.find((id) => id !== user?.id);
      const otherUser = otherUserId
        ? conv.participantDetails?.[otherUserId]
        : null;

      // Search by name
      if (otherUser?.name && otherUser.name.toLowerCase().includes(query)) {
        return true;
      }

      // Search by job title
      if (conv.jobTitle && conv.jobTitle.toLowerCase().includes(query)) {
        return true;
      }

      // Search by last message
      if (
        conv.lastMessage &&
        conv.lastMessage.content.toLowerCase().includes(query)
      ) {
        return true;
      }

      return false;
    });
  }, [conversations, searchQuery, user?.id]);

  const handleConversationPress = (conversation: Conversation) => {
    // ChatScreen'ga o'tish
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (navigation as any).navigate('Chat', {
      conversationId: conversation.id,
      otherUserId: conversation.participants.find((id) => id !== user?.id),
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Refresh logic here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Xabarlarni qidirish..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Conversations List */}
      {filteredConversations.length === 0 && !loading ? (
        <LottieEmptyState
          title={
            searchQuery
              ? t('messages.noResults')
              : t('messages.noConversations')
          }
          subtitle={
            searchQuery
              ? t('messages.tryDifferentSearch')
              : t('messages.startMessaging')
          }
        />
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInput: {
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
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
