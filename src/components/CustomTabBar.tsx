/**
 * Custom Tab Bar komponenti
 */

import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '../constants/colors';
import { TabBarButton } from './TabBarButton';

const icons: Record<string, { name: string; outline: string }> = {
  Home: { name: 'home', outline: 'home-outline' },
  Search: { name: 'magnify', outline: 'magnify' },
  PostJob: { name: 'plus-circle', outline: 'plus-circle-outline' },
  Messages: { name: 'message-text', outline: 'message-text-outline' },
  Profile: { name: 'account', outline: 'account-outline' },
};

const labels: Record<string, string> = {
  Home: 'Bosh sahifa',
  Search: 'Qidiruv',
  PostJob: "E'lon berish",
  Messages: 'Xabarlar',
  Profile: 'Profil',
};

export const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const iconSet = icons[route.name] || { name: 'circle', outline: 'circle-outline' };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabButton}
          >
            <TabBarButton
              label={labels[route.name] || route.name}
              iconName={isFocused ? iconSet.name : iconSet.outline}
              focused={isFocused}
              onPress={onPress}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingTop: Platform.OS === 'ios' ? 10 : 4,
    paddingBottom: Platform.OS === 'ios' ? 28 : 4,
    paddingHorizontal: 4,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

