import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Pressable, Image, Linking, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PrescriptionsContext } from '../contexts/AppContext';
import { useDualPress } from '../hooks/useDualPress';
import { styles } from '../styles/styles';

const heartbeatLogo = require('../../assets/heartbeat_logo.png');

export const HomeScreen = ({ navigation }) => {
  const emergencyNumber = '911';
  const { accessibilitySettings, prescriptions } = useContext(PrescriptionsContext);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [todayMedications, setTodayMedications] = useState([]);

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

  // Actualizar hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    const upcomingMeds = prescriptions.filter(med => {
      const medHour = parseInt(med.hour);
      const medMinute = parseInt(med.minute);
      const currentHour = new Date().getHours();
      const currentMinute = new Date().getMinutes();
      
      return (medHour > currentHour) || 
             (medHour === currentHour && medMinute >= currentMinute);
    }).sort((a, b) => {
      const timeA = parseInt(a.hour) * 60 + parseInt(a.minute);
      const timeB = parseInt(b.hour) * 60 + parseInt(b.minute);
      return timeA - timeB;
    });

    setTodayMedications(upcomingMeds);

    return () => clearInterval(timer);
  }, [prescriptions]);

  const formatTime = (hour, minute) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const getCurrentDate = () => {
    const options = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    };
    return currentTime.toLocaleDateString('es-ES', options);
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <ScrollView contentContainerStyle={styles.homeScrollContent}>
          <View style={styles.homeContainer}>
            
            {/* Header con hora y botón de notificaciones */}
            <View style={styles.homeHeader}>
              <View style={styles.timeContainer}>
                <Text style={[styles.currentTime, accessibilitySettings.largeFont && { fontSize: 32 }]}>
                  {formatTime(currentTime.getHours(), currentTime.getMinutes())}
                </Text>
                <Text style={[styles.currentDate, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                  {getCurrentDate()}
                </Text>
              </View>
              
              {/* Botón de notificaciones con badge */}
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={() => setShowNotifications(true)}
              >
                <Text style={styles.bellIcon}>🔔</Text>
                {todayMedications.length > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>{todayMedications.length}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Logo y título */}
            <View style={styles.homeLogoSection}>
              <Image source={heartbeatLogo} style={styles.homeLogoImage} resizeMode="contain" />
            </View>

            <Text style={[styles.homeTitle, accessibilitySettings.largeFont && { fontSize: 28 }]}>
              Health Reminder
            </Text>

            <Text style={[styles.welcomeText, accessibilitySettings.largeFont && { fontSize: 16 }]}>
              Tu asistente personal de salud
            </Text>

            {/* Botón de Inicio */}
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

            {/* Modal de Notificaciones */}
            <Modal
              visible={showNotifications}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setShowNotifications(false)}
            >
              <View style={styles.modalOverlay}>
                <View style={styles.notificationsModal}>
                  {/* Header del modal */}
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Tus Recordatorios</Text>
                    <TouchableOpacity 
                      style={styles.closeButton}
                      onPress={() => setShowNotifications(false)}
                    >
                      <Text style={styles.closeIcon}>✕</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Lista de medicamentos */}
                  <ScrollView style={styles.modalContent}>
                    {todayMedications.length > 0 ? (
                      todayMedications.map((med, index) => (
                        <View key={med.id} style={styles.medicationModalItem}>
                          <View style={styles.medicationIcon}>
                            <Text style={styles.pillIcon}>💊</Text>
                          </View>
                          <View style={styles.medicationDetails}>
                            <Text style={styles.medicationModalName}>
                              {med.name} {med.dose}
                            </Text>
                            <Text style={styles.medicationModalTime}>
                              ⏰ {formatTime(med.hour, med.minute)}
                            </Text>
                            <Text style={styles.medicationModalInstructions}>
                              {med.instructions || 'Toma según indicaciones'}
                            </Text>
                          </View>
                        </View>
                      ))
                    ) : (
                      <View style={styles.emptyModal}>
                        <Text style={styles.emptyModalIcon}>📋</Text>
                        <Text style={styles.emptyModalText}>
                          No tienes recordatorios programados
                        </Text>
                        <Text style={styles.emptyModalSubtext}>
                          Ve a "Receta" para agregar medicamentos
                        </Text>
                      </View>
                    )}
                  </ScrollView>
                </View>
              </View>
            </Modal>

            <StatusBar style="auto" />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};