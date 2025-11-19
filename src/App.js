import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider } from './contexts/AppContext';
import { HomeScreen } from './screens/HomeScreen';
import { LoginScreen } from './screens/LoginScreen';
import { MainAppScreen } from './screens/MainAppScreen';
import { RequestAppointmentScreen } from './screens/RequestAppointmentScreen';
import { PrescriptionScreen } from './screens/PrescriptionScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { ChangePasswordScreen } from './screens/ChangePasswordScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#ffffff' },
            headerTintColor: '#000',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MainApp" component={MainAppScreen} options={{ headerShown: false }} />
          <Stack.Screen name="RequestAppointment" component={RequestAppointmentScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Prescription" component={PrescriptionScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}