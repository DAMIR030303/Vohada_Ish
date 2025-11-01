/**
 * Long Press Menu - context menu with gestures
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Animated, Platform, StyleSheet, Text, Modal } from 'react-native';
import {
  LongPressGestureHandler,
  State,
  LongPressGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';

import { useTheme } from '../context/ThemeContext';
import { hapticFeedback } from '../utils/haptics';
import { fontSize } from '../utils/responsive';
import { soundEffects } from '../utils/soundEffects';

import { AnimatedTouchable, ScaleInView } from './AnimatedComponents';

interface MenuAction {
  id: string;
  label: string;
  icon: string;
  color?: string;
  onPress: () => void;
}

interface LongPressMenuProps {
  actions: MenuAction[];
  children: React.ReactNode;
  disabled?: boolean;
}

export const LongPressMenu: React.FC<LongPressMenuProps> = ({
  actions,
  children,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const onLongPress = (event: LongPressGestureHandlerStateChangeEvent) => {
    if (disabled) return;

    if (event.nativeEvent.state === State.ACTIVE) {
      // Get touch position
      const { absoluteX, absoluteY } = event.nativeEvent;
      setMenuPosition({ x: absoluteX, y: absoluteY });

      // Trigger feedback
      hapticFeedback.longPress();
      soundEffects.selection();

      // Show menu with animation
      setMenuVisible(true);

      // Scale animation for pressed item
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 300,
          friction: 10,
        }),
      ]).start();

      // Fade in menu
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeMenu = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setMenuVisible(false);
    });
  };

  const handleActionPress = (action: MenuAction) => {
    hapticFeedback.selection();
    soundEffects.tap();
    closeMenu();
    setTimeout(() => action.onPress(), 100);
  };

  const dynamicStyles = StyleSheet.create({
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    menuContainer: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: colors.shadow,
    },
    actionItem: {
      borderBottomColor: colors.border,
    },
    actionText: {
      color: colors.text,
    },
    actionIcon: {
      color: colors.textSecondary,
    },
  });

  return (
    <>
      <LongPressGestureHandler
        onHandlerStateChange={onLongPress}
        minDurationMs={500}
      >
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}
        >
          {children}
        </Animated.View>
      </LongPressGestureHandler>

      {/* Context Menu Modal */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="none"
        onRequestClose={closeMenu}
      >
        <AnimatedTouchable
          style={[styles.overlay, dynamicStyles.overlay]}
          onPress={closeMenu}
          enableHaptic={false}
          enableSound={false}
        >
          <Animated.View
            style={[
              styles.menuContainer,
              dynamicStyles.menuContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateX: menuPosition.x - 100 },
                  { translateY: menuPosition.y - 50 },
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <ScaleInView duration={200}>
              {actions.map((action, index) => (
                <AnimatedTouchable
                  key={action.id}
                  style={[
                    styles.actionItem,
                    dynamicStyles.actionItem,
                    index === actions.length - 1 && styles.lastActionItem,
                  ]}
                  onPress={() => handleActionPress(action)}
                  enableHaptic={true}
                  hapticType="selection"
                  enableSound={true}
                  soundType="tap"
                >
                  <MaterialCommunityIcons
                    name={action.icon as any}
                    size={20}
                    color={action.color || colors.textSecondary}
                    style={styles.actionIconStyle}
                  />
                  <Text
                    style={[
                      styles.actionText,
                      dynamicStyles.actionText,
                      action.color && { color: action.color },
                    ]}
                  >
                    {action.label}
                  </Text>
                </AnimatedTouchable>
              ))}
            </ScaleInView>
          </Animated.View>
        </AnimatedTouchable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    minWidth: 200,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    // Shadow
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  lastActionItem: {
    borderBottomWidth: 0,
  },
  actionIconStyle: {
    marginRight: 12,
  },
  actionText: {
    fontSize: fontSize(16),
    fontWeight: '500',
    flex: 1,
  },
});
