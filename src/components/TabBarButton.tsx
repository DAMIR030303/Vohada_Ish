/**
 * Zamonaviy Tab Bar Button komponenti
 */

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/colors';

interface TabBarButtonProps {
  label: string;
  iconName: string;
  focused: boolean;
  onPress: () => void;
}

export const TabBarButton: React.FC<TabBarButtonProps> = ({
  label,
  iconName,
  focused,
  onPress: _onPress,
}) => {
  return (
    <View style={styles.container}>
      <View
        style={[styles.iconContainer, focused && styles.iconContainerFocused]}
      >
        <MaterialCommunityIcons
          name={iconName as any}
          size={focused ? 26 : 22}
          color={focused ? colors.primary : colors.textSecondary}
        />
      </View>
      <Text
        style={[styles.label, focused && styles.labelFocused]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    backgroundColor: 'transparent',
  },
  iconContainerFocused: {
    backgroundColor: colors.primary + '15', // 15% opacity
  },
  label: {
    fontSize: 8.5,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 1,
    textAlign: 'center',
    paddingHorizontal: 2,
    lineHeight: 11,
  },
  labelFocused: {
    fontWeight: '700',
    color: colors.primary,
    fontSize: 9,
  },
});
