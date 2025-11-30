import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 1. Configuración: Cómo se comportan las notificaciones cuando la App está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// 2. Pedir Permisos (Obligatorio en iOS/Android)
export async function registerForPushNotificationsAsync() {
  let token;
  
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    alert('¡Se necesitan permisos para recordarte tus medicinas!');
    return;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
}

// 3. Programar una notificación recurrente (Diaria)
export async function scheduleMedicationReminder(nombre, dosis, horaString) {
  // horaString viene como "08:00" o "14:30"
  const [hora, minuto] = horaString.split(':').map(Number);

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `💊 Hora de tu medicina`,
      body: `Te toca tomar: ${nombre} (${dosis}). ¡No lo olvides!`,
      sound: true,
    },
    trigger: {
      hour: hora,
      minute: minuto,
      repeats: true, // Se repite todos los días
    },
  });
  
  console.log(`✅ Alarma creada para ${nombre} a las ${hora}:${minuto}`);
  return id;
}

// 4. Cancelar todas (Para limpiar antes de actualizar)
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("🗑️ Todas las notificaciones anteriores canceladas.");
}