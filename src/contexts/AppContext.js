import React, { createContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
// Ya no importamos apiRequest aquí para evitar conflictos de "doble carga"

export const PrescriptionsContext = createContext();

// Paleta de colores para los medicamentos
const VIBRANT_COLOR_PALETTE = [
    '#FF8C00', // Naranja Brillante
    '#32CD32', // Verde Lima Brillante
    '#FF1493', // Rosa Profundo Brillante
    '#9932CC', // Morado Oscuro Brillante
    '#FFD700', // Dorado Brillante
    '#6A5ACD', // Azul Pizarra Oscuro
    '#00CED1', // Turquesa Oscuro
];

export const AppProvider = ({ children }) => {
  // --- ESTADOS ---
  const [user, setUser] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]); // Aquí se guardan los datos YA formateados por MainApp
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    largeFont: false,
    ttsEnabled: false,
  });
  
  // Estados auxiliares
  const [medicationColorsMap, setMedicationColorsMap] = useState({}); 
  const [scheduledNotifications, setScheduledNotifications] = useState([]);

  // ============================================================
  // 1. GENERADOR DE COLORES REACTIVO
  // ============================================================
  // Cada vez que MainApp actualice la lista de medicamentos, 
  // nosotros recalculamos los colores automáticamente.
  useEffect(() => {
    if (prescriptions.length > 0) {
        const colorMap = {};
        let colorIndex = 0;
        
        prescriptions.forEach(med => {
            // Como MainApp ya aplanó los datos, accedemos directo a 'med.nombre'
            const medName = med.nombre; 
            if (medName && !colorMap[medName]) {
                const color = VIBRANT_COLOR_PALETTE[colorIndex % VIBRANT_COLOR_PALETTE.length];
                colorMap[medName] = color;
                colorIndex++; 
            }
        });
        setMedicationColorsMap(colorMap);
    }
  }, [prescriptions]); // Se dispara cuando cambian las prescripciones

  const getMedicationColor = (name) => {
      return medicationColorsMap[name] || '#CCCCCC'; 
  };

  // ============================================================
  // 2. GESTIÓN DE NOTIFICACIONES (Legacy / Helper)
  // ============================================================
  // Mantenemos estas funciones por si algún componente las necesita,
  // pero la carga pesada ahora la hace notifications.js y MainApp.

  const loadScheduledNotifications = async () => {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      setScheduledNotifications(scheduled);
    } catch (error) {
      console.error('Error loading scheduled notifications:', error);
    }
  };

  // Helper para borrar todo desde cualquier pantalla
  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setScheduledNotifications([]);
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  };

  // Cargar notificaciones al iniciar la app
  useEffect(() => {
    loadScheduledNotifications();
  }, []);

  return (
    <PrescriptionsContext.Provider
      value={{
        // Datos y Configuración
        user,
        setUser,
        prescriptions,
        setPrescriptions, // MainApp usa esto para guardar la lista limpia
        accessibilitySettings,
        setAccessibilitySettings,
        medicationColorsMap,
        
        // Funciones de UI
        getMedicationColor,

        // Funciones de Notificaciones
        scheduledNotifications,
        cancelAllNotifications,
        loadScheduledNotifications,
      }}
    >
      {children}
    </PrescriptionsContext.Provider>
  );
};
