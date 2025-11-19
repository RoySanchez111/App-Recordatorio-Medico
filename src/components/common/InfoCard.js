import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useDualPress } from '../../hooks/useDualPress';
import { styles } from '../../styles/styles';

export const InfoCard = ({ 
  children, 
  title, 
  onPress, 
  accessibilitySettings,
  showPressEffect = false 
}) => {
  const { isPressing, handlePressIn, handlePressOut } = useDualPress();

  return (
    <Pressable
      style={[
        styles.infoCard,
        showPressEffect && isPressing && styles.navButtonActive
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      {title && (
        <Text style={[
          styles.cardTitle,
          accessibilitySettings?.largeFont && { fontSize: 18 },
        ]}>
          {title}
        </Text>
      )}
      {children}
    </Pressable>
  );
};