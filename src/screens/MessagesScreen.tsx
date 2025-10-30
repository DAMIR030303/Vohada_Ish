/**
 * Xabarlar/Chat ekrani
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../constants/colors';

export const MessagesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Xabarlar bo&apos;limi</Text>
      <Text style={styles.subtext}>Tez orada qo&apos;shiladi</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

