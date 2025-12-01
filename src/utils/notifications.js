import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 1. Configuración: Qué hacer si la app está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowList: true,
  }),
});

// 2. Pedir Permisos
export async function registerForPushNotificationsAsync() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('⚠️ Sin permisos de notificación.');
      return;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Health Reminder',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  } catch (error) {
    console.error("Error pidiendo permisos:", error);
  }
}

// 3. GENERADOR DE ID ESTÁNDAR (Clave para evitar duplicados)
function generateId(nombre, hora, minuto) {
  // Eliminamos espacios y caracteres raros para el ID
  const cleanName = nombre.trim().replace(/\s+/g, '_').toUpperCase();
  // Forzamos formato de hora: "PARACETAMOL_08_30"
  return `${cleanName}_${hora.toString()}_${minuto.toString()}`;
}

// 4. FUNCIÓN MAESTRA: Sincronización
export async function synchronizeLocalNotifications(desiredAlarms) {
  try {
    // A. Obtenemos lo que YA existe en el celular
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    // Mapa para búsqueda rápida de lo existente
    const existingIds = new Set();
    scheduledNotifications.forEach(n => {
        // Guardamos el ID de la notificación
        existingIds.add(n.identifier);
    });

    // B. Lista de IDs que DEBEN estar vivos hoy
    const activeIds = new Set();

    console.log(`🔍 Analizando ${desiredAlarms.length} alarmas deseadas...`);

    // C. Recorremos las alarmas nuevas
    for (const alarm of desiredAlarms) {
      // Conversión forzada a Número (Critical Fix para el error de "todas a la vez")
      const h = parseInt(alarm.hour, 10);
      const m = parseInt(alarm.minute, 10);

      if (isNaN(h) || isNaN(m)) {
        console.warn("⚠️ Hora inválida detectada, saltando:", alarm.title);
        continue;
      }

      // Generamos el ID único
      const uniqueId = generateId(alarm.data.nombre, h, m);
      activeIds.add(uniqueId);

      // SI YA EXISTE -> NO HACEMOS NADA (Evita que suene de nuevo)
      if (existingIds.has(uniqueId)) {
        // Opcional: console.log(`✅ Alarma ya existe: ${uniqueId}`);
        continue; 
      }

      // SI NO EXISTE -> LA CREAMOS
      console.log(`➕ Creando alarma nueva: ${uniqueId}`);
      
      const triggerConfig = {
        hour: h,
        minute: m,
        repeats: true, // Se repite diario
      };

      await Notifications.scheduleNotificationAsync({
        identifier: uniqueId, // Forzamos el ID
        content: {
          title: alarm.title,
          body: alarm.body,
          sound: true,
          priority: Notifications.AndroidImportance.HIGH,
          data: alarm.data,
          ...(Platform.OS === 'android' ? { channelId: 'default' } : {}),
        },
        trigger: triggerConfig,
      });
    }

    // D. Limpieza: Borrar SOLO lo que sobra
    // (Ej: Si el doctor te quitó una pastilla)
    for (const notification of scheduledNotifications) {
      const id = notification.identifier;
      // Solo borramos si tiene nuestro formato (contiene guiones bajos) y NO está en la lista activa
      if (id.includes('_') && !activeIds.has(id)) {
        console.log(`🗑️ Borrando alarma obsoleta: ${id}`);
        await Notifications.cancelScheduledNotificationAsync(id);
      }
    }

  } catch (error) {
    console.error("Error crítico en sincronización:", error);
  }
}

// 5. Herramienta de limpieza (Úsala si todo falla)
export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  console.log("🧹 Todo limpio.");
}
