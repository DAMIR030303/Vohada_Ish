/**
 * ChatListScreen - Barcha suhbatlar ro'yxati
 */

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text } from 'react-native';

import { ConversationItem } from '../components/ConversationItem';
import { LottieEmptyState } from '../components/LottieEmptyState';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { useMessages } from '../context/MessageContext';
import { useTheme } from '../context/ThemeContext';
import { Conversation } from '../types';
import { scale } from '../utils/responsive';

type RootStackParamList = {
  ChatList: undefined;
  Chat: { conversationId: string };
  Home: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const {
    conversations,
    loading,
    error,
    selectConversation,
    getTotalUnreadCount,
  } = useMessages();

  const totalUnreadCount = getTotalUnreadCount();

  /**
   * Conversation'ga o'tish
   */
  const handleConversationPress = useCallback(
    (conversationId: string) => {
      selectConversation(conversationId);
      navigation.navigate('Chat', { conversationId });
    },
    [navigation, selectConversation],
  );

  /**
   * Pull-to-refresh (data allaqachon real-time yangilanadi)
   */
  const [refreshing, setRefreshing] = React.useState(false);
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  /**
   * Render conversation item
   */
  const renderItem = useCallback(
    ({ item }: { item: Conversation }) => (
      <ConversationItem conversation={item} onPress={handleConversationPress} />
    ),
    [handleConversationPress],
  );

  /**
   * Key extractor
   */
  const keyExtractor = useCallback((item: Conversation) => item.id, []);

  /**
   * Header component
   */
  const ListHeaderComponent = useCallback(() => {
    if (totalUnreadCount > 0) {
      return (
        <View
          style={[
            styles.unreadBanner,
            { backgroundColor: theme.primaryLight || theme.primary },
          ]}
        >
          <Text style={[styles.unreadText, { color: theme.primary }]}>
            📬 {totalUnreadCount} o&apos;qilmagan xabar
          </Text>
        </View>
      );
    }
    return null;
  }, [totalUnreadCount, theme]);

  /**
   * Empty state
   */
  const ListEmptyComponent = useCallback(() => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          {[...Array(5)].map((_, index) => (
            <SkeletonLoader
              key={index}
              height={80}
              style={{ marginBottom: 12 }}
            />
          ))}
        </View>
      );
    }

    return (
      <LottieEmptyState
        title="Xabarlar yo'q"
        subtitle="Ish beruvchilar bilan muloqot qiling"
        actionText="E'lonlarni ko'rish"
        onAction={() => navigation.navigate('Home')}
      />
    );
  }, [loading, navigation]);

  /**
   * Error state
   */
  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <LottieEmptyState
          title="Xatolik yuz berdi"
          subtitle={error}
          actionText="Qayta urinish"
          onAction={handleRefresh}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={[
          styles.listContent,
          conversations.length === 0 && styles.emptyListContent,
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
        accessibilityLabel="Conversations list"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: scale(8),
    paddingBottom: scale(135),
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    padding: scale(16),
  },
  unreadBanner: {
    marginHorizontal: scale(16),
    marginVertical: scale(8),
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderRadius: scale(12),
    alignItems: 'center',
  },
  unreadText: {
    fontSize: scale(14),
    fontWeight: '600',
  },
});
