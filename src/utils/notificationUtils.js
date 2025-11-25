import * as Notifications from 'expo-notifications';

// Programar notificación para medicamento
export const scheduleMedicationNotification = async (medication) => {
  try {
    const { name, dose, instructions, hour, minute } = medication;
    
    const notificationBody = `Toma ${dose} de ${name}. ${instructions || 'Según indicaciones médicas.'}`;

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: "💊 Hora de tu medicamento",
        body: notificationBody,
        data: { 
          medicationId: medication.id,
          type: 'medication',
          prescriptionData: medication
        },
        sound: true,
        autoDismiss: false,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        hour: parseInt(hour),
        minute: parseInt(minute),
        repeats: true,
      },
    });

    console.log('✅ Notificación programada:', notificationId, `para las ${hour}:${minute}`);
    return notificationId;
  } catch (error) {
    console.error('❌ Error programando notificación:', error);
    throw error;
  }
};

// Cancelar notificación específica
export const cancelScheduledNotification = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    console.log('✅ Notificación cancelada:', notificationId);
    return true;
  } catch (error) {
    console.error('❌ Error cancelando notificación:', error);
    return false;
  }
};

// Obtener todas las notificaciones programadas
export const getAllScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('❌ Error obteniendo notificaciones:', error);
    return [];
  }
};

// Cancelar todas las notificaciones
export const cancelAllNotifications = async () => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('✅ Todas las notificaciones canceladas');
    return true;
  } catch (error) {
    console.error('❌ Error cancelando todas las notificaciones:', error);
    return false;
  }
};

// Verificar permisos de notificaciones
export const checkNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  } catch (error) {
    console.error('❌ Error verificando permisos:', error);
    return 'undetermined';
  }
};

// Solicitar permisos de notificaciones
export const requestNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status;
  } catch (error) {
    console.error('❌ Error solicitando permisos:', error);
    return 'undetermined';
  }
};

// Formatear hora para notificación
export const formatTimeForNotification = (hour, minute) => {
  const formattedHour = hour.toString().padStart(2, '0');
  const formattedMinute = minute.toString().padStart(2, '0');
  return `${formattedHour}:${formattedMinute}`;
};

// Crear objeto de medicamento para notificación
export const createMedicationForNotification = (name, dose, instructions, hour, minute) => {
  return {
    id: Date.now().toString(),
    name,
    dose,
    instructions,
    hour: parseInt(hour),
    minute: parseInt(minute),
    createdAt: new Date().toISOString()
  };
};