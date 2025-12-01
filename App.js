import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';
import * as Notifications from 'expo-notifications';

// Contexto
import { AppProvider } from './src/contexts/AppContext';

// Pantallas
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { MainAppScreen } from './src/screens/MainAppScreen';
import { RequestAppointmentScreen } from './src/screens/RequestAppointmentScreen';
import { PrescriptionScreen } from './src/screens/PrescriptionScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { ChangePasswordScreen } from './src/screens/ChangePasswordScreen';
import PrescriptionDetailScreen from "./src/screens/PrescriptionDetailScreen";
import { AppointmentStatusScreen } from "./src/screens/AppointmentStatusScreen";

// Importamos la lógica centralizada de notificaciones
// (Esto asegura que el canal 'default' se cree igual aquí que en MainApp)
import { registerForPushNotificationsAsync } from './src/utils/notifications'; 

// Ignorar warnings de Expo Go
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
]);

const Stack = createStackNavigator();

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // 1. Inicializar permisos y canales (Usando tu archivo utils/notifications.js)
    // Esto arregla el conflicto de canales en Android
    registerForPushNotificationsAsync();

    // 2. Escuchar notificaciones en primer plano
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('📱 Notificación recibida en primer plano:', notification);
    });

    // 3. Escuchar interacción (cuando tocan la notificación)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Usuario tocó la notificación:', response);
      const { data } = response.notification.request.content;
      
      // Aquí puedes agregar lógica de navegación global si lo necesitas
      if (data?.medicationId) {
        console.log('💊 ID de medicamento:', data.medicationId);
      }
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    // ✅ EL APP PROVIDER ESTÁ PERFECTO AQUÍ
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
            name="PrescriptionDetail"
            component={PrescriptionDetailScreen}
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
          <Stack.Screen
            name="AppointmentStatusScreen"
            component={AppointmentStatusScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
