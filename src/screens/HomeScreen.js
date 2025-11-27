import React, { useState, useContext } from 'react';
import { View, Text, Pressable, Image, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PrescriptionsContext } from '../contexts/AppContext';
import { useDualPress } from '../hooks/useDualPress';
import { styles } from '../styles/styles';

// Logo - usa la ruta correcta
const heartbeatLogo = require('../../assets/heartbeat.png');

export const HomeScreen = ({ navigation }) => {
  const emergencyNumber = '911';
  const { accessibilitySettings } = useContext(PrescriptionsContext);

  const { isPressing, handlePressIn, handlePressOut } = useDualPress(
    () => navigation.navigate('Login'),
    () => {
      if (Linking.canOpenURL(`tel:${emergencyNumber}`)) {
        Linking.openURL(`tel:${emergencyNumber}`);
      } else {
        alert(`Llamada de emergencia: ${emergencyNumber}`);
      }
    },
    5000,
    1000
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.homeContainer}>
          <View style={styles.homeLogoSection}>
            <Image source={heartbeatLogo} style={styles.homeLogoImage} resizeMode="contain" />
          </View>

          <Text style={[styles.homeTitle, accessibilitySettings.largeFont && { fontSize: 28 }]}>
            Bienvenido a Health Reminder
          </Text>

          <Text style={[styles.instructionText, accessibilitySettings.largeFont && { fontSize: 16 }]}>
            {isPressing
              ? 'Sigue presionando para llamada de emergencia...'
              : 'Toca para iniciar • Mantén 5s para llamada de emergencia'}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              pressed && styles.navButtonPressed,
              isPressing && styles.navButtonActive,
            ]}
            onPress={() => navigation.navigate('Login')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text style={[styles.buttonText, accessibilitySettings.largeFont && { fontSize: 18 }]}>
              {isPressing ? 'Suelta para cancelar' : 'Iniciar Health Reminder'}
            </Text>
          </Pressable>

          <StatusBar style="auto" />
        </View>
      </View>
    </View>
  );
};
