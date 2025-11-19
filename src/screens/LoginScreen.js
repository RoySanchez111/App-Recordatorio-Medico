import React, { useState, useContext } from 'react';
import { View, Text, Pressable, TextInput, Image, Alert } from 'react-native';
import { PrescriptionsContext } from '../contexts/AppContext';
import { useDualPress } from '../hooks/useDualPress';
import { ScreenTitle } from '../components/ScreenTitle';
import { styles } from '../styles/styles';

const heartbeatLogo = require('../../assets/heartbeat_logo.png');

export const LoginScreen = ({ navigation }) => {
  const [claveUnica, setClaveUnica] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const { accessibilitySettings, setUser } = useContext(PrescriptionsContext);

  const handleLogin = async () => {
    if (!claveUnica || !contrasena) {
      Alert.alert('Error', 'Por favor ingresa tu clave única y contraseña');
      return;
    }
    
    setLoading(true);

    try {
      // Simular login exitoso
      const userData = {
        id: "1",
        nombreCompleto: "Rafael Flores Lopez",
        claveUnica: claveUnica,
        esPaciente: true,
        fechaNacimiento: "2006-09-12",
        telefono: "222 402 9740",
        direccion: "AAAAAAA",
        sexo: "Hombre",
        enfermedadesCronicas: "Diabetes Tipo 45",
        tipoSangre: "O+",
        alergias: "Ninguna"
      };
      
      Alert.alert('Ingreso exitoso', `Bienvenido(a) ${userData.nombreCompleto}`);
      setUser(userData);
      navigation.navigate('MainApp');
      
    } catch (err) {
      Alert.alert('Error de Login', err.message || 'No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  const { isPressing, handlePressIn, handlePressOut } = useDualPress(handleLogin);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.loginContainer}>
          <View style={styles.logoSection}>
            <Image source={heartbeatLogo} style={styles.logoImage} resizeMode="contain" />
          </View>

          <View style={styles.loginForm}>
            <ScreenTitle accessibilitySettings={accessibilitySettings}>
              Ingresar a Health Reminder
            </ScreenTitle>

            <Text style={[styles.label, accessibilitySettings.largeFont && { fontSize: 16 }]}>
              Clave Única
            </Text>
            <TextInput
              style={[styles.textInput, accessibilitySettings.largeFont && { fontSize: 18 }]}
              placeholder="Ingresa tu clave única"
              placeholderTextColor="#666"
              value={claveUnica}
              onChangeText={setClaveUnica}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Text style={[styles.label, accessibilitySettings.largeFont && { fontSize: 16 }]}>
              Contraseña
            </Text>
            <TextInput
              style={[styles.textInput, accessibilitySettings.largeFont && { fontSize: 18 }]}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#666"
              value={contrasena}
              onChangeText={setContrasena}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                (isPressing || loading) && styles.navButtonActive,
              ]}
              onPress={handleLogin}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={loading}
            >
              <Text style={[styles.buttonText, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                {loading ? 'Ingresando...' : (isPressing ? 'Mantén...' : 'Ingresar')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};