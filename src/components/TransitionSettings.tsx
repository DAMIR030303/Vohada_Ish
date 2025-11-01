/**
 * Transition Settings komponenti
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, StyleSheet, Text, View, Switch } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { useTransition, TransitionType } from '../context/TransitionContext';
import { fontSize } from '../utils/responsive';

import { AnimatedTouchable, ScaleInView } from './AnimatedComponents';

export const TransitionSettings: React.FC = () => {
  const {
    currentTransition,
    setTransition,
    isAnimationsEnabled,
    setAnimationsEnabled,
  } = useTransition();
  const { colors } = useTheme();

  const transitionOptions: {
    type: TransitionType;
    label: string;
    description: string;
    icon: string;
  }[] = [
    {
      type: 'ios',
      label: 'iOS Style',
      description: 'Slide from right',
      icon: 'apple',
    },
    {
      type: 'android',
      label: 'Android Style',
      description: 'Fade transition',
      icon: 'android',
    },
    {
      type: 'modal',
      label: 'Modal',
      description: 'Slide from bottom',
      icon: 'window-maximize',
    },
    {
      type: 'bouncy',
      label: 'Bouncy',
      description: 'Spring scale effect',
      icon: 'bounce',
    },
    {
      type: 'flip',
      label: '3D Flip',
      description: 'Flip animation',
      icon: 'flip-horizontal',
    },
    {
      type: 'cube',
      label: 'Cube',
      description: '3D cube rotation',
      icon: 'cube',
    },
  ];

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      shadowColor: colors.shadow,
    },
    title: {
      color: colors.text,
    },
    subtitle: {
      color: colors.textSecondary,
    },
    optionContainer: {
      backgroundColor: colors.background,
      borderColor: currentTransition === 'ios' ? colors.primary : colors.border,
    },
    optionTitle: {
      color: colors.text,
    },
    optionDescription: {
      color: colors.textSecondary,
    },
    switchContainer: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
    switchLabel: {
      color: colors.text,
    },
    switchDescription: {
      color: colors.textSecondary,
    },
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Text style={[styles.title, dynamicStyles.title]}>
        Screen Transitions
      </Text>
      <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
        Sahifalar orasidagi o'tish animatsiyalarini tanlang
      </Text>

      {/* Animation Enable/Disable */}
      <View style={[styles.switchContainer, dynamicStyles.switchContainer]}>
        <View style={styles.switchContent}>
          <MaterialCommunityIcons
            name="animation"
            size={24}
            color={isAnimationsEnabled ? colors.primary : colors.textSecondary}
          />
          <View style={styles.switchText}>
            <Text style={[styles.switchLabel, dynamicStyles.switchLabel]}>
              Animatsiyalar
            </Text>
            <Text
              style={[
                styles.switchDescription,
                dynamicStyles.switchDescription,
              ]}
            >
              {isAnimationsEnabled ? 'Yoqilgan' : "O'chirilgan"}
            </Text>
          </View>
        </View>
        <Switch
          value={isAnimationsEnabled}
          onValueChange={setAnimationsEnabled}
          trackColor={{
            false: colors.border,
            true: colors.primaryLight,
          }}
          thumbColor={
            isAnimationsEnabled ? colors.primary : colors.textDisabled
          }
        />
      </View>

      {/* Transition Options */}
      {isAnimationsEnabled && (
        <View style={styles.optionsContainer}>
          {transitionOptions.map((option, index) => (
            <ScaleInView key={option.type} delay={index * 50}>
              <AnimatedTouchable
                style={[
                  styles.optionContainer,
                  dynamicStyles.optionContainer,
                  {
                    borderColor:
                      currentTransition === option.type
                        ? colors.primary
                        : colors.border,
                    borderWidth: currentTransition === option.type ? 2 : 1,
                  },
                ]}
                onPress={() => setTransition(option.type)}
                enableHaptic={true}
                hapticType="selection"
                enableSound={true}
                soundType="selection"
              >
                <MaterialCommunityIcons
                  name={option.icon as any}
                  size={24}
                  color={
                    currentTransition === option.type
                      ? colors.primary
                      : colors.textSecondary
                  }
                />
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionTitle,
                      dynamicStyles.optionTitle,
                      currentTransition === option.type && {
                        color: colors.primary,
                        fontWeight: '600',
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionDescription,
                      dynamicStyles.optionDescription,
                    ]}
                  >
                    {option.description}
                  </Text>
                </View>
                {currentTransition === option.type && (
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color={colors.primary}
                  />
                )}
              </AnimatedTouchable>
            </ScaleInView>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    margin: 16,
    borderWidth: 1,
    // Shadow
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: fontSize(20),
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: fontSize(14),
    marginBottom: 20,
    lineHeight: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  switchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  switchText: {
    marginLeft: 12,
    flex: 1,
  },
  switchLabel: {
    fontSize: fontSize(16),
    fontWeight: '600',
    marginBottom: 2,
  },
  switchDescription: {
    fontSize: fontSize(13),
  },
  optionsContainer: {
    gap: 12,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionContent: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: fontSize(16),
    fontWeight: '500',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: fontSize(13),
  },
});
