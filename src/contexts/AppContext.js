import React, { createContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { apiRequest } from '../utils/api'; 

export const PrescriptionsContext = createContext();

// Paleta de colores para los medicamentos (De la versión Incoming)
const VIBRANT_COLOR_PALETTE = [
    '#FF8C00', // 1. Naranja Brillante
    '#32CD32', // 3. Verde Lima Brillante
    '#FF1493', // 4. Rosa Profundo Brillante
    '#9932CC', // 5. Morado Oscuro Brillante
    '#FFD700', // 6. Dorado Brillante
    '#6A5ACD', // 7. Azul Pizarra Oscuro
    '#00CED1', // 8. Turquesa Oscuro
];

export const AppProvider = ({ children }) => {
  // --- ESTADOS ---
  const [user, setUser] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    largeFont: false,
    ttsEnabled: false,
  });
  
  // Estados para Notificaciones (De HEAD)
  const [scheduledNotifications, setScheduledNotifications] = useState([]);
  
  // Estados para API y UI (De Incoming)
  const [medicationColorsMap, setMedicationColorsMap] = useState({}); 
  const [isLoading, setIsLoading] = useState(true);

  // ============================================================
  // 1. LÓGICA DE NOTIFICACIONES (De HEAD)
  // ============================================================

  // Cargar notificaciones al iniciar
  useEffect(() => {
    loadScheduledNotifications();
  }, []);

  const loadScheduledNotifications = async () => {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      setScheduledNotifications(scheduled);
    } catch (error) {
      console.error('Error loading scheduled notifications:', error);
    }
  };

  const scheduleMedicationNotification = async (medication) => {
    try {
      const notificationBody = `
💊 Centro de notificaciones

Ya es hora de tu ${medication.name} ${medication.dose || ''}
Toma 1 cápsula con agua ${medication.instructions ? medication.instructions.toLowerCase() : 'según indicaciones'}

(100%✓)
      `.trim();

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: `⏰ ${medication.hour.toString().padStart(2, '0')}:${medication.minute.toString().padStart(2, '0')}`,
          body: notificationBody,
          data: { 
            medicationId: medication.id,
            type: 'medication'
          },
          sound: true,
          priority: Notifications.AndroidImportance.HIGH,
          autoDismiss: false,
        },
        trigger: {
          hour: parseInt(medication.hour),
          minute: parseInt(medication.minute),
          repeats: true,
        },
      });

      setScheduledNotifications(prev => [
        ...prev,
        { 
          id: notificationId, 
          medicationId: medication.id,
          medicationName: medication.name
        }
      ]);

      console.log('✅ Notificación programada:', medication.name);
      return notificationId;
    } catch (error) {
      console.error('❌ Error scheduling notification:', error);
      throw error;
    }
  };

  const cancelMedicationNotification = async (notificationId) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      setScheduledNotifications(prev => 
        prev.filter(notif => notif.id !== notificationId)
      );
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  };

  const cancelAllMedicationNotifications = async (medicationId) => {
    try {
      const notificationsToCancel = scheduledNotifications.filter(
        notif => notif.medicationId === medicationId
      );
      
      for (const notif of notificationsToCancel) {
        await Notifications.cancelScheduledNotificationAsync(notif.id);
      }
      
      setScheduledNotifications(prev => 
        prev.filter(notif => notif.medicationId !== medicationId)
      );
    } catch (error) {
      console.error('Error canceling medication notifications:', error);
    }
  };

  const addPrescriptionWithNotification = async (prescription) => {
    try {
      const newPrescription = {
        ...prescription,
        id: Date.now().toString(),
        notificationId: null
      };

      const notificationId = await scheduleMedicationNotification(newPrescription);
      
      const prescriptionWithNotification = {
        ...newPrescription,
        notificationId: notificationId
      };

      setPrescriptions(prev => [...prev, prescriptionWithNotification]);
      
      return prescriptionWithNotification;
    } catch (error) {
      console.error('Error adding prescription with notification:', error);
      throw error;
    }
  };

  const removePrescription = async (prescriptionId) => {
    try {
      const prescription = prescriptions.find(p => p.id === prescriptionId);
      
      if (prescription && prescription.notificationId) {
        await cancelMedicationNotification(prescription.notificationId);
      }
      
      setPrescriptions(prev => prev.filter(p => p.id !== prescriptionId));
    } catch (error) {
      console.error('Error removing prescription:', error);
    }
  };

  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setScheduledNotifications([]);
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  };

  const getNotificationsForMedication = (medicationId) => {
    return scheduledNotifications.filter(
      notif => notif.medicationId === medicationId
    );
  };

  // ============================================================
  // 2. LÓGICA DE API Y COLORES (De Incoming)
  // ============================================================

  const generateColorMap = (recetas) => {
      const colorMap = {};
      let colorIndex = 0;
      
      recetas.forEach(receta => {
          (receta.medicamentos || []).forEach(med => {
              const medName = med.nombre_medicamento; 
              if (medName && !colorMap[medName]) {
                  const color = VIBRANT_COLOR_PALETTE[colorIndex % VIBRANT_COLOR_PALETTE.length];
                  colorMap[medName] = color;
                  colorIndex++; 
              }
          });
      });
      setMedicationColorsMap(colorMap);
  };
  
  // Carga automática desde API cuando cambia el usuario
  useEffect(() => {
      const loadData = async () => {
          if (!user || !user.id) {
              setIsLoading(false);
              return; 
          }
          
          setIsLoading(true);
          try {
              const fetchedRecetas = await apiRequest('getRecipesByPatient', {
                  pacienteId: user.id 
              }); 
              
              // Nota: Aquí combinamos los datos de la API. 
              // Si quieres mantener las prescripciones manuales (locales), deberías concatenarlas.
              // Por ahora, priorizamos la API como fuente de verdad.
              setPrescriptions(fetchedRecetas); 
              generateColorMap(fetchedRecetas);
              
          } catch (error) {
              console.error("Error al cargar recetas o asignar colores:", error);
              // No borramos prescriptions si falla, para mantener datos previos si los hubiera
          } finally {
              setIsLoading(false);
          }
      };

      loadData();
  }, [user]);

  const getMedicationColor = (name) => {
      return medicationColorsMap[name] || '#CCCCCC'; 
  };

  return (
    <PrescriptionsContext.Provider
      value={{
        // Datos y Configuración
        user,
        setUser,
        prescriptions,
        setPrescriptions,
        accessibilitySettings,
        setAccessibilitySettings,
        isLoading,
        medicationColorsMap,
        
        // Funciones de Notificaciones
        scheduledNotifications,
        addPrescriptionWithNotification,
        removePrescription,
        scheduleMedicationNotification,
        cancelMedicationNotification,
        cancelAllMedicationNotifications,
        cancelAllNotifications,
        getNotificationsForMedication,
        loadScheduledNotifications,

        // Funciones de UI
        getMedicationColor
      }}
    >
      {children}
    </PrescriptionsContext.Provider>
  );
};