import React, { useState, useContext } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { PrescriptionsContext } from '../contexts/AppContext';
import { useDualPress } from '../hooks/useDualPress';
import { ScreenTitle } from '../components/ScreenTitle';
import { BottomNav } from '../components/BottomNav';
import { styles } from '../styles/styles';

// Tu URL de Lambda
const API_URL = "https://a6p5u37ybkzmvauf4lko6j3yda0qgkcb.lambda-url.us-east-1.on.aws/";

export const ChangePasswordScreen = ({ navigation }) => {
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [loading, setLoading] = useState(false);

  // Obtenemos el usuario del contexto para sacar su ID
  const { accessibilitySettings, user } = useContext(PrescriptionsContext);

  const { isPressing: cardPressing, handlePressIn: cardPressIn, handlePressOut: cardPressOut } =
    useDualPress();

  // Lógica de envío a la API
  const handleChangePassword = async () => {
    // 1. Validaciones Locales
    if (!contrasenaActual || !nuevaContrasena || !confirmarContrasena) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos'); 
      return;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      Alert.alert('Error', 'Las nuevas contraseñas no coinciden'); 
      return;
    }
    if (nuevaContrasena.length < 6) {
      Alert.alert('Seguridad', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (contrasenaActual === nuevaContrasena) {
      Alert.alert('Error', 'La nueva contraseña no puede ser igual a la actual');
      return;
    }

    // 2. Validación de Sesión
    if (!user || !user.id) {
      Alert.alert('Error de Sesión', 'No se pudo identificar tu cuenta. Vuelve a iniciar sesión.');
      return;
    }

    setLoading(true);

    try {
      // 3. Petición a la Lambda
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'changePassword',
          data: {
            userId: user.id,
            currentPassword: contrasenaActual,
            newPassword: nuevaContrasena
          }
        })
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          'Éxito', 
          'Contraseña actualizada exitosamente',
          [{ text: 'OK', onPress: () => navigation.navigate('Profile') }]
        );
        setContrasenaActual('');
        setNuevaContrasena('');
        setConfirmarContrasena('');
      } else {
        // Manejo de errores de la API (ej: Contraseña actual incorrecta)
        throw new Error(result.message || 'Error al actualizar contraseña');
      }

    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert('Error', error.message || 'No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Integra la función con tu hook useDualPress
  const {
    isPressing: submitPressing,
    handlePressIn: submitPressIn,
    handlePressOut: submitPressOut,
    handleQuickPress: submitQuickPress,
  } = useDualPress(handleChangePassword);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.passwordScrollContent}>
            <View style={styles.invisiblePadding} />

            <View style={styles.passwordContainer}>
              <ScreenTitle accessibilitySettings={accessibilitySettings}>
                Cambiar Contraseña
              </ScreenTitle>

              <Pressable
                style={[styles.infoCard, cardPressing && styles.navButtonActive]}
                onPressIn={cardPressIn}
                onPressOut={cardPressOut}
              >
                {/* Campo: Contraseña Actual */}
                <Text style={[styles.label, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                  Contraseña Actual
                </Text>
                <TextInput
                  style={[styles.textInput, accessibilitySettings.largeFont && { fontSize: 18 }]}
                  placeholder="Ingresa tu contraseña actual"
                  placeholderTextColor="#666"
                  value={contrasenaActual}
                  onChangeText={setContrasenaActual}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />

                {/* Campo: Nueva Contraseña */}
                <Text style={[styles.label, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                  Nueva Contraseña
                </Text>
                <TextInput
                  style={[styles.textInput, accessibilitySettings.largeFont && { fontSize: 18 }]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#666"
                  value={nuevaContrasena}
                  onChangeText={setNuevaContrasena}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />

                {/* Campo: Confirmar Contraseña */}
                <Text style={[styles.label, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                  Confirmar Nueva Contraseña
                </Text>
                <TextInput
                  style={[styles.textInput, accessibilitySettings.largeFont && { fontSize: 18 }]}
                  placeholder="Repite la nueva contraseña"
                  placeholderTextColor="#666"
                  value={confirmarContrasena}
                  onChangeText={setConfirmarContrasena}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />

                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    (submitPressing || loading) && styles.navButtonActive,
                    { marginTop: 20 }
                  ]}
                  onPress={submitQuickPress}
                  onPressIn={submitPressIn}
                  onPressOut={submitPressOut}
                  disabled={loading}
                >
                  <Text style={[styles.buttonText, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                    {loading 
                      ? 'Actualizando...' 
                      : (submitPressing ? 'Mantén para confirmar...' : 'Actualizar Contraseña')}
                  </Text>
                </Pressable>
              </Pressable>
            </View>

            <View style={styles.extraBottomPadding} />
          </ScrollView>

          <BottomNav
            navigation={navigation}
            accessibilitySettings={accessibilitySettings}
            active="profile"
          />
        </View>
      </View>
    </View>
  );
};