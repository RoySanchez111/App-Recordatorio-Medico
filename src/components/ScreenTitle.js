import React from 'react';
import { Text } from 'react-native';
import { styles } from '../styles/styles';

export const ScreenTitle = ({ children, accessibilitySettings }) => (
  <Text
    style={[
      styles.sectionTitle,
      accessibilitySettings.largeFont && styles.sectionTitleLarge,
    ]}
  >
    {children}
  </Text>
);