/**
 * SwipeableConversationItem - ConversationItem ga swipe actions qo'shadi
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';

import { Conversation } from '../types';
import { scale } from '../utils/responsive';

import { ConversationItem } from './ConversationItem';

interface SwipeableConversationItemProps {
  conversation: Conversation;
  onPress?: (conversationId: string) => void;
  onPin?: (conversationId: string) => void;
  onArchive?: (conversationId: string) => void;
  onDelete?: (conversationId: string) => void;
}

const SWIPE_THRESHOLD = 100;
const ACTION_BUTTON_WIDTH = 80;

export const SwipeableConversationItem: React.FC<
  SwipeableConversationItemProps
> = ({ conversation, onPress, onPin, onArchive }) => {
  const translateX = useSharedValue(0);

  // Swipe gesture handler
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // O'ngga swipe (pin uchun)
      const maxRightSwipe = ACTION_BUTTON_WIDTH;
      // Chapga swipe (archive/delete uchun)
      const maxLeftSwipe = -ACTION_BUTTON_WIDTH * 2;

      if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, maxRightSwipe);
      } else {
        translateX.value = Math.max(event.translationX, maxLeftSwipe);
      }
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD && onPin) {
        // O'ngga swipe - pin action
        runOnJS(onPin)(conversation.id);
        translateX.value = withSpring(0);
      } else if (event.translationX < -SWIPE_THRESHOLD && onArchive) {
        // Chapga swipe - archive action
        runOnJS(onArchive)(conversation.id);
        translateX.value = withSpring(0);
      } else {
        // Qaytaradi
        translateX.value = withSpring(0);
      }
    });

  // Animated style for main content
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  // Action buttons style
  const rightActionStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 0 ? translateX.value / ACTION_BUTTON_WIDTH : 0,
  }));

  const leftArchiveStyle = useAnimatedStyle(() => ({
    opacity:
      translateX.value < 0
        ? Math.abs(translateX.value) / ACTION_BUTTON_WIDTH
        : 0,
    transform: [
      {
        translateX: Math.min(translateX.value, 0),
      },
    ],
  }));

  const leftDeleteStyle = useAnimatedStyle(() => ({
    opacity:
      translateX.value < -ACTION_BUTTON_WIDTH
        ? Math.abs(translateX.value + ACTION_BUTTON_WIDTH) / ACTION_BUTTON_WIDTH
        : 0,
    transform: [
      {
        translateX: Math.min(translateX.value + ACTION_BUTTON_WIDTH, 0),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      {/* Swipe actions background */}
      <View style={styles.actionsContainer}>
        {/* O'ng tomondagi action (Pin) */}
        <Animated.View
          style={[styles.actionButton, styles.pinButton, rightActionStyle]}
        >
          <Animated.Text style={styles.actionText}>
            {conversation.isPinned ? '📌 Unpin' : '📌 Pin'}
          </Animated.Text>
        </Animated.View>

        {/* Chap tomondagi actions (Archive va Delete) */}
        <View style={styles.leftActions}>
          <Animated.View
            style={[
              styles.actionButton,
              styles.archiveButton,
              leftArchiveStyle,
            ]}
          >
            <Animated.Text style={styles.actionText}>📂</Animated.Text>
          </Animated.View>

          <Animated.View
            style={[styles.actionButton, styles.deleteButton, leftDeleteStyle]}
          >
            <Animated.Text style={styles.actionText}>🗑️</Animated.Text>
          </Animated.View>
        </View>
      </View>

      {/* Main content with swipe gesture */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          <ConversationItem conversation={conversation} onPress={onPress} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: scale(6),
  },
  actionsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
  },
  actionButton: {
    width: ACTION_BUTTON_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinButton: {
    backgroundColor: '#FFA500',
  },
  archiveButton: {
    backgroundColor: '#2196F3',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: scale(14),
    fontWeight: 'bold',
  },
});
