import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform, LogBox } from 'react-native';
import * as Notifications from 'expo-notifications';
import { AppProvider } from './src/contexts/AppContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { MainAppScreen } from './src/screens/MainAppScreen';
import { RequestAppointmentScreen } from './src/screens/RequestAppointmentScreen';
import { PrescriptionScreen } from './src/screens/PrescriptionScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ChangePasswordScreen } from './src/screens/ChangePasswordScreen';

// Ignorar el warning de expo-notifications en Expo Go
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
]);

const Stack = createStackNavigator();

// Configurar el manejo de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Solicitar permisos para notificaciones al iniciar la app
    registerForPushNotificationsAsync();
    createNotificationChannel();

    // Escuchar notificaciones recibidas mientras la app está en primer plano
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('📱 Notificación recibida:', notification);
    });

    // Escuchar cuando el usuario toca una notificación
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Usuario tocó la notificación:', response);
      const { medicationId } = response.notification.request.content.data;
      
      if (medicationId) {
        console.log('💊 Notificación de medicamento con ID:', medicationId);
        // Aquí podrías navegar a la pantalla de medicamentos si quieres
        // navigation.navigate('Prescription');
      }
    });

    // Limpieza al desmontar el componente
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Función para crear canal de notificaciones (Android)
  async function createNotificationChannel() {
    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('medication-reminders', {
          name: 'Recordatorios de Medicamentos',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#4CAF50',
          sound: 'default',
          enableVibrate: true,
          showBadge: true,
        });
        console.log('✅ Canal de notificaciones creado');
      } catch (error) {
        console.error('❌ Error creando canal:', error);
      }
    }
  }

  // Función para registrar permisos de notificaciones (solo locales)
  async function registerForPushNotificationsAsync() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('⚠️ Permisos de notificación no concedidos');
        return;
      }
      
      console.log('✅ Permisos de notificación concedidos para notificaciones locales');
      
    } catch (error) {
      console.error('❌ Error al solicitar permisos de notificación:', error);
    }
  }

  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="MainApp" 
            component={MainAppScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="RequestAppointment" 
            component={RequestAppointmentScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Prescription" 
            component={PrescriptionScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="ChangePassword" 
            component={ChangePasswordScreen} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}