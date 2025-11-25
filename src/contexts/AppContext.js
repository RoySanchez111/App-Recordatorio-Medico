import React, { createContext, useState, useEffect } from 'react';
<<<<<<< HEAD
import * as Notifications from 'expo-notifications';
=======
import { apiRequest } from '../utils/api'; 
>>>>>>> 95f0f2be418f6437fae584e2fbc708221b9001df

export const PrescriptionsContext = createContext();
const VIBRANT_COLOR_PALETTE = [
    '#FF8C00', // 1. Naranja Brillante
    '#1E90FF', // 2. Azul Dodger Brillante
    '#32CD32', // 3. Verde Lima Brillante
    '#FF1493', // 4. Rosa Profundo Brillante
    '#9932CC', // 5. Morado Oscuro Brillante
    '#FFD700', // 6. Dorado Brillante
    '#6A5ACD', // 7. Azul Pizarra Oscuro
    '#00CED1', // 8. Turquesa Oscuro
];

export const AppProvider = ({ children }) => {
<<<<<<< HEAD
  const [prescriptions, setPrescriptions] = useState([]);
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    largeFont: false,
    ttsEnabled: false,
  });
  const [user, setUser] = useState(null);
  const [scheduledNotifications, setScheduledNotifications] = useState([]);

  // Cargar notificaciones al iniciar
  useEffect(() => {
    loadScheduledNotifications();
  }, []);

  // Cargar notificaciones existentes
  const loadScheduledNotifications = async () => {
    try {
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      setScheduledNotifications(scheduled);
    } catch (error) {
      console.error('Error loading scheduled notifications:', error);
    }
  };

  // ✅ FUNCIÓN MEJORADA - Programar notificación con estilo personalizado
  const scheduleMedicationNotification = async (medication) => {
    try {
      const notificationBody = `
💊 Centro de notificaciones

Ya solo tu ${medication.name} ${medication.dose || ''}
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

      console.log('✅ Notificación programada:', medication.name, 'a las', `${medication.hour}:${medication.minute}`);
      return notificationId;
    } catch (error) {
      console.error('❌ Error scheduling notification:', error);
      throw error;
    }
  };

  // ✅ FUNCIÓN ORIGINAL MANTENIDA - Cancelar notificación específica
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

  // ✅ FUNCIÓN ORIGINAL MANTENIDA - Cancelar todas las notificaciones de un medicamento
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

  // ✅ FUNCIÓN ORIGINAL MANTENIDA - Agregar prescripción con notificación
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

  // ✅ FUNCIÓN ORIGINAL MANTENIDA - Eliminar prescripción
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

  // ✅ FUNCIÓN ORIGINAL MANTENIDA - Cancelar todas las notificaciones
  const cancelAllNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      setScheduledNotifications([]);
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  };

  // ✅ FUNCIÓN ORIGINAL MANTENIDA - Obtener notificaciones de medicamento
  const getNotificationsForMedication = (medicationId) => {
    return scheduledNotifications.filter(
      notif => notif.medicationId === medicationId
    );
  };

  return (
    <PrescriptionsContext.Provider
      value={{
        // ✅ ESTADO ORIGINAL MANTENIDO
        prescriptions,
        setPrescriptions,
        accessibilitySettings,
        setAccessibilitySettings,
        user,
        setUser,
        
        // ✅ NUEVO estado (no rompe compatibilidad)
        scheduledNotifications,
        
        // ✅ TODAS las funciones originales MANTENIDAS
        addPrescriptionWithNotification,
        removePrescription,
        scheduleMedicationNotification,
        cancelMedicationNotification,
        cancelAllMedicationNotifications,
        cancelAllNotifications,
        getNotificationsForMedication,
        
        // ✅ Nueva función adicional (no afecta lo existente)
        loadScheduledNotifications
      }}
    >
      {children}
    </PrescriptionsContext.Provider>
  );
=======
    // --- ESTADOS ---
    const [prescriptions, setPrescriptions] = useState([]);
    const [accessibilitySettings, setAccessibilitySettings] = useState({
        largeFont: false,
        ttsEnabled: false,
    });
    const [user, setUser] = useState(null);
    const [medicationColorsMap, setMedicationColorsMap] = useState({}); 
    const [isLoading, setIsLoading] = useState(true); // Estado de carga para evitar renderizado vacío

    // --- FUNCIÓN DE ASIGNACIÓN CÍCLICA DE COLOR (Front-end) ---
    // Esta función asigna un color único y cíclico a cada nombre de medicamento.
    const generateColorMap = (recetas) => {
        const colorMap = {};
        let colorIndex = 0;
        
        recetas.forEach(receta => {
            // Aseguramos que solo procesamos si hay medicamentos
            (receta.medicamentos || []).forEach(med => {
                // Tu Lambda usa 'nombre_medicamento'
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
    
    // --- Lógica para cargar las recetas y asignar los colores ---
    useEffect(() => {
        const loadData = async () => {
            // Utilizamos el estado isLoading para gestionar si el usuario aún no se ha cargado.
            if (!user || !user.id) {
                setIsLoading(false);
                return; 
            }
            
            setIsLoading(true);
            try {
                // 1. Llamada usando la acción 'getRecipesByPatient' de tu Lambda
                const fetchedRecetas = await apiRequest('getRecipesByPatient', {
                    pacienteId: user.id 
                }); 
                
                // 2. Actualizar estados
                setPrescriptions(fetchedRecetas); 
                generateColorMap(fetchedRecetas);
                
            } catch (error) {
                console.error("Error al cargar recetas o asignar colores:", error);
                // Si la carga falla, asegurémonos de que al menos prescriptions no esté en un estado roto.
                setPrescriptions([]); 
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user]); // Se ejecuta cuando el 'user' cambia (ej: después del login)

    // Helper para obtener el color
    const getMedicationColor = (name) => {
        return medicationColorsMap[name] || '#CCCCCC'; 
    };

    // Devolvemos 'null' o un componente de carga si la aplicación está inicializando
    // antes de que el usuario haya sido autenticado o cargado.
    if (isLoading && !user) {
        return null; 
    }

    return (
        <PrescriptionsContext.Provider
            value={{
                prescriptions,
                setPrescriptions,
                accessibilitySettings,
                setAccessibilitySettings,
                user,
                setUser,
                isLoading, // Útil para que los componentes muestren un spinner
                getMedicationColor // Función clave
            }}
        >
            {children}
        </PrescriptionsContext.Provider>
    );
>>>>>>> 95f0f2be418f6437fae584e2fbc708221b9001df
};