import React, { useContext } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PrescriptionsContext } from '../contexts/AppContext';
import { useDualPress } from '../hooks/useDualPress';
import { ScreenTitle } from '../components/ScreenTitle';
import { BottomNav } from '../components/BottomNav';
import { speakIfEnabled } from '../utils/speech';
import { calculateAge, formatBirthDate } from '../utils/dateUtils';
import { styles } from '../styles/styles';

export const ProfileScreen = ({ navigation }) => {
  const { accessibilitySettings, setAccessibilitySettings, user, setUser } = useContext(PrescriptionsContext);

  const toggleLargeFont = () =>
    setAccessibilitySettings((prev) => ({ ...prev, largeFont: !prev.largeFont }));

  const toggleTts = () =>
    setAccessibilitySettings((prev) => ({ ...prev, ttsEnabled: !prev.ttsEnabled }));

  const changePassword = useDualPress(() => {
    speakIfEnabled(accessibilitySettings, 'Cambiar contraseña');
    navigation.navigate('ChangePassword');
  });

  const logout = useDualPress(() => {
    speakIfEnabled(accessibilitySettings, 'Cerrar sesión');
    Alert.alert('Sesión cerrada', 'Sesión cerrada exitosamente');
    setUser(null);
    navigation.navigate('Login');
  });

  const photo = useDualPress();
  const personalInfo = useDualPress();
  const medicalInfo = useDualPress();

  if (!user) {
      return (
        <View style={styles.screenContainer}>
            <View style={styles.contentFrame}>
                <View style={styles.container}>
                    <Text style={{textAlign: 'center', padding: 20}}>Cargando perfil...</Text>
                    <BottomNav navigation={navigation} accessibilitySettings={accessibilitySettings} active="profile" />
                </View>
            </View>
        </View>
      );
  }

  const edadCalculada = calculateAge(user.fechaNacimiento);
  const fechaNacFormateada = formatBirthDate(user.fechaNacimiento);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <View style={styles.headerButtons}>
              <Pressable
                style={styles.changePasswordButton}
                onPress={changePassword.handleQuickPress}
                onPressIn={changePassword.handlePressIn}
                onPressOut={changePassword.handlePressOut}
              >
                <Ionicons name="key" size={20} color="#007AFF" />
                <Text style={[styles.changePasswordText, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                  Cambiar Contraseña
                </Text>
              </Pressable>

              <Pressable
                style={styles.logoutButton}
                onPress={logout.handleQuickPress}
                onPressIn={logout.handlePressIn}
                onPressOut={logout.handlePressOut}
              >
                <Ionicons name="log-out" size={20} color="#FF3B30" />
                <Text style={[styles.logoutText, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                  Cerrar Sesión
                </Text>
              </Pressable>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.profileScrollContent}>
            <View style={styles.invisiblePadding} />

            <View style={styles.profileContainer}>
              <ScreenTitle accessibilitySettings={accessibilitySettings}>
                Perfil - Health Reminder
              </ScreenTitle>

              <Pressable style={styles.profilePhotoContainer} onPressIn={photo.handlePressIn} onPressOut={photo.handlePressOut}>
                <View style={styles.profilePhoto}>
                  <Ionicons name="person" size={60} color="#fff" />
                </View>
                <Text style={[styles.profileName, accessibilitySettings.largeFont && { fontSize: 26 }]}>
                  {user.nombreCompleto}
                </Text>
                <Text style={[styles.profileEmail, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                  Clave: {user.claveUnica}
                </Text>
              </Pressable>

              <Pressable style={styles.infoCard} onPressIn={personalInfo.handlePressIn} onPressOut={personalInfo.handlePressOut}>
                <Text style={[styles.cardTitle, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                  Información Personal
                </Text>

                <View style={styles.profileGrid}>
                  {[
                    ['Nombre(s)', user.nombreCompleto],
                    ['Sexo', user.sexo || 'N/A'],
                    ['Número Telefónico', user.telefono || 'N/A'],
                    ['Dirección', user.direccion || 'N/A'],
                    ['Fecha de Nacimiento', fechaNacFormateada],
                    ['Edad', edadCalculada]
                  ].map(([label, value]) => (
                    <View key={label} style={styles.profileField}>
                      <Text style={[styles.fieldLabel, accessibilitySettings.largeFont && { fontSize: 13 }]}>
                        {label}
                      </Text>
                      <Text style={[styles.fieldValue, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                        {value}
                      </Text>
                    </View>
                  ))}
                </View>
              </Pressable>
              
              <Pressable style={styles.infoCard} onPressIn={medicalInfo.handlePressIn} onPressOut={medicalInfo.handlePressOut}>
                <Text style={[styles.cardTitle, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                  Información Médica
                </Text>

                {[
                  ['Enfermedades Crónicas', user.enfermedadesCronicas || 'Ninguna'],
                  ['Tipo de Sangre', user.tipoSangre || 'N/A'],
                  ['Alergias', user.alergias || 'Ninguna'],
                ].map(([label, value]) => (
                  <View key={label} style={styles.profileField}>
                    <Text style={[styles.fieldLabel, accessibilitySettings.largeFont && { fontSize: 13 }]}>
                      {label}
                    </Text>
                    <Text style={[styles.fieldValue, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                      {value}
                    </Text>
                  </View>
                ))}
              </Pressable>
            </View>

            <View style={styles.infoCard}>
              <Text style={[styles.cardTitle, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                Accesibilidad
              </Text>

              <Pressable style={styles.accessRow} onPress={toggleLargeFont}>
                <Text style={[styles.fieldLabel, accessibilitySettings.largeFont && { fontSize: 13 }]}>
                  Texto grande
                </Text>
                <Text style={[styles.fieldValue, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                  {accessibilitySettings.largeFont ? 'Activado' : 'Desactivado'}
                </Text>
              </Pressable>

              <Pressable style={styles.accessRow} onPress={toggleTts}>
                <Text style={[styles.fieldLabel, accessibilitySettings.largeFont && { fontSize: 13 }]}>
                  Lectura de botones
                </Text>
                <Text style={[styles.fieldValue, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                  {accessibilitySettings.ttsEnabled ? 'Activado' : 'Desactivado'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.extraBottomPadding} />
          </ScrollView>

          <BottomNav navigation={navigation} accessibilitySettings={accessibilitySettings} active="profile" />
        </View>
      </View>
    </View>
  );
};