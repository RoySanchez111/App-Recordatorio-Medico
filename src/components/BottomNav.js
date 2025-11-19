import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDualPress } from '../hooks/useDualPress';
import { speakIfEnabled } from '../utils/speech';
import { styles } from '../styles/styles';

export const BottomNav = ({ navigation, accessibilitySettings, active }) => {
  const navItems = [
    {
      id: 'calendar',
      icon: 'calendar',
      label: 'Calendario\nHealth',
      screen: 'MainApp'
    },
    {
      id: 'request',
      icon: 'add-circle',
      label: 'Solicitar\nConsulta',
      screen: 'RequestAppointment'
    },
    {
      id: 'prescription',
      icon: 'document-text',
      label: 'Receta',
      screen: 'Prescription'
    },
    {
      id: 'profile',
      icon: 'person',
      label: 'Perfil',
      screen: 'Profile'
    }
  ];

  return (
    <View style={styles.bottomNavigation}>
      {navItems.map((item) => {
        const navPress = useDualPress(() => {
          speakIfEnabled(accessibilitySettings, item.label.split('\n')[0]);
          navigation.navigate(item.screen);
        });

        const iconColor = active === item.id ? '#007AFF' : '#666';
        const textStyle = [
          styles.navText,
          active === item.id && styles.activeNavText,
          accessibilitySettings.largeFont && { fontSize: 12 },
        ];

        return (
          <Pressable
            key={item.id}
            style={styles.navItem}
            onPress={navPress.handleQuickPress}
            onPressIn={navPress.handlePressIn}
            onPressOut={navPress.handlePressOut}
          >
            <Ionicons name={item.icon} size={24} color={iconColor} />
            <Text style={textStyle}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};