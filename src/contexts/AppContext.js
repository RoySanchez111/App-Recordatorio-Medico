import React, { createContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

export const PrescriptionsContext = createContext();

export const AppProvider = ({ children }) => {
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
};