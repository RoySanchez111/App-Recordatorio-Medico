import React, { useState, useContext } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import { PrescriptionsContext } from '../contexts/AppContext';
import { useDualPress } from '../hooks/useDualPress';
import { ScreenTitle } from '../components/ScreenTitle';
import { BottomNav } from '../components/BottomNav';
import { styles } from '../styles/styles';

export const ChangePasswordScreen = ({ navigation }) => {
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const { accessibilitySettings } = useContext(PrescriptionsContext);

  const { isPressing: cardPressing, handlePressIn: cardPressIn, handlePressOut: cardPressOut } =
    useDualPress();

  const {
    isPressing: submitPressing,
    handlePressIn: submitPressIn,
    handlePressOut: submitPressOut,
    handleQuickPress: submitQuickPress,
  } = useDualPress(() => {
    if (!contrasenaActual || !nuevaContrasena || !confirmarContrasena) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos'); 
      return;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      Alert.alert('Error', 'Las nuevas contraseñas no coinciden'); 
      return;
    }
    Alert.alert('Éxito', 'Contraseña actualizada exitosamente'); 
    navigation.navigate('Profile');
  });

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.passwordScrollContent}>
            <View style={styles.invisiblePadding} />

            <View style={styles.passwordContainer}>
              <ScreenTitle accessibilitySettings={accessibilitySettings}>
                Cambiar Contraseña - Health Reminder
              </ScreenTitle>

              <Pressable
                style={[styles.infoCard, cardPressing && styles.navButtonActive]}
                onPressIn={cardPressIn}
                onPressOut={cardPressOut}
              >
                {[
                  ['Contraseña Actual', contrasenaActual, setContrasenaActual],
                  ['Nueva Contraseña', nuevaContrasena, setNuevaContrasena],
                  ['Confirmar Nueva Contraseña', confirmarContrasena, setConfirmarContrasena],
                ].map(([label, value, setter]) => (
                  <React.Fragment key={label}>
                    <Text style={[styles.label, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                      {label}
                    </Text>
                    <TextInput
                      style={[styles.textInput, accessibilitySettings.largeFont && { fontSize: 18 }]}
                      placeholder={label}
                      placeholderTextColor="#666"
                      value={value}
                      onChangeText={setter}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </React.Fragment>
                ))}

                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    submitPressing && styles.navButtonActive,
                  ]}
                  onPress={submitQuickPress}
                  onPressIn={submitPressIn}
                  onPressOut={submitPressOut}
                >
                  <Text style={[styles.buttonText, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                    {submitPressing
                      ? 'Mantén para vibración...'
                      : 'Actualizar Contraseña'}
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