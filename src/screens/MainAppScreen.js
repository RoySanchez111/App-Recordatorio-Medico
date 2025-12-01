import React, { useState, useContext, useCallback, useRef } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { PrescriptionsContext } from '../contexts/AppContext';
import { ScreenTitle } from '../components/ScreenTitle';
import { BottomNav } from '../components/BottomNav';
import { CalendarStrip } from '../components/common/CalendarStrip';
import { styles } from '../styles/styles';

import { 
  registerForPushNotificationsAsync, 
  synchronizeLocalNotifications,
  cancelAllNotifications // <--- Importamos esto para el botón de limpieza
} from '../utils/notifications';

const API_URL = "https://a6p5u37ybkzmvauf4lko6j3yda0qgkcb.lambda-url.us-east-1.on.aws/";

export const MainAppScreen = ({ navigation }) => {
  const { prescriptions, setPrescriptions, accessibilitySettings, user, getMedicationColor } = useContext(PrescriptionsContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [loading, setLoading] = useState(prescriptions.length === 0);
  
  // Bloqueo para evitar llamadas dobles rápidas
  const isProcessingRef = useRef(false);

  const formatTime = (timeString) => {
    if (!timeString || typeof timeString !== 'string') return '';
    const timeParts = timeString.split(':');
    if (timeParts.length < 2) return timeString;
    const hours = parseInt(timeParts[0]);
    const minutes = parseInt(timeParts[1]);
    if (isNaN(hours) || isNaN(minutes)) return timeString;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  // Función de emergencia para el botón
  const handleEmergencyCleanup = async () => {
    Alert.alert(
      "¿Limpiar Alertas?",
      "Esto borrará todas las alarmas del celular. Se volverán a programar correctamente la próxima vez que entres a esta pantalla.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Borrar Todo", 
          style: "destructive", 
          onPress: async () => {
            await cancelAllNotifications();
            Alert.alert("Listo", "Notificaciones limpiadas. Recarga la pantalla para sincronizar.");
          }
        }
      ]
    );
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true; 

      const fetchAndSchedule = async () => {
        if (isProcessingRef.current) return;
        isProcessingRef.current = true;

        await registerForPushNotificationsAsync();

        if (!user || !user.id) {
          if (isActive) setLoading(false);
          isProcessingRef.current = false;
          return;
        }

        if (prescriptions.length === 0 && isActive) setLoading(true);
        else setLoading(false);

        try {
          // 1. OBTENER DATOS DE LA API
          const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'getRecipesByPatient',
              data: { pacienteId: user.id }
            })
          });

          const recetas = await response.json();

          if (response.ok && isActive) {
            const allMeds = [];
            const alarmasDeseadas = []; 
            
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            if (Array.isArray(recetas)) {
                for (const receta of recetas) {
                    if (receta.medicamentos && Array.isArray(receta.medicamentos)) {
                        for (const med of receta.medicamentos) {
                            
                            // --- CÁLCULO DE FECHAS ---
                            const fechaInicio = new Date(receta.fechaEmision);
                            fechaInicio.setHours(0, 0, 0, 0);

                            let diasDuracion = 30; 
                            if (med.duracion) {
                              const match = med.duracion.match(/\d+/);
                              if (match) {
                                diasDuracion = parseInt(match[0], 10);
                                if (med.duracion.toLowerCase().includes('semana')) diasDuracion *= 7;
                                if (med.duracion.toLowerCase().includes('mes')) diasDuracion *= 30;
                              }
                            }
                            const fechaFin = new Date(fechaInicio);
                            fechaFin.setDate(fechaInicio.getDate() + diasDuracion);
                            fechaFin.setHours(23, 59, 59, 999);

                            // --- NORMALIZACIÓN DE HORARIOS ---
                            let horariosMostrar = [];
                            if (med.horarios && Array.isArray(med.horarios) && med.horarios.length > 0) {
                                horariosMostrar = med.horarios;
                            } else if (med.primeraIngesta) {
                                horariosMostrar = [med.primeraIngesta];
                            }
                            horariosMostrar.sort();

                            // --- PREPARAR ALARMAS (Solo si la fecha es válida) ---
                            if (hoy.getTime() <= fechaFin.getTime()) {
                                for (const hora of horariosMostrar) {
                                    if (hora && typeof hora === 'string' && hora.includes(':')) {
                                        const [hStr, mStr] = hora.split(':');
                                        const h = parseInt(hStr, 10);
                                        const m = parseInt(mStr, 10);
                                        
                                        // VALIDACIÓN CRÍTICA: Solo agregamos si son números reales
                                        if (!isNaN(h) && !isNaN(m)) {
                                            alarmasDeseadas.push({
                                                title: `💊 Hora de tu medicina`,
                                                body: `Te toca tomar: ${med.nombre_medicamento} ${med.dosis ? '(' + med.dosis + ')' : ''}`,
                                                hour: h,
                                                minute: m,
                                                data: { nombre: med.nombre_medicamento, dosis: med.dosis }
                                            });
                                        }
                                    }
                                }
                            }

                            allMeds.push({
                                id: med.id || `${receta.id}-${med.nombre_medicamento}`,
                                recetaId: receta.id,
                                nombre: med.nombre_medicamento,
                                dosis: med.dosis,
                                duracion: med.duracion,
                                frecuencia: med.frecuencia,
                                primeraIngesta: med.primeraIngesta,
                                instrucciones: med.instrucciones,
                                cantidadInicial: med.cantidadInicial,
                                inicio: fechaInicio,
                                fin: fechaFin,
                                horarios: horariosMostrar,
                                stock: med.cantidadInicial || 0,
                                dosisPorToma: 1,
                                esLargoPlazo: diasDuracion > 30,
                                diasDuracion: diasDuracion
                            });
                        }
                    }
                }
            }
            
            // Actualizamos la UI
            setPrescriptions(allMeds);

            // --- LLAMADA A SINCRONIZACIÓN INTELIGENTE ---
            // Le pasamos la lista limpia y confiamos en que notifications.js filtre los duplicados
            console.log(`📡 Procesando ${alarmasDeseadas.length} alarmas...`);
            await synchronizeLocalNotifications(alarmasDeseadas);
          }
        } catch (error) {
          console.error('Error fetching/scheduling:', error);
        } finally {
          if (isActive) setLoading(false);
          isProcessingRef.current = false;
        }
      };

      fetchAndSchedule();

      return () => { isActive = false; };
    }, [user?.id]) 
  );

  const getMedsForDate = (date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    return prescriptions.filter((med) => {
      if (!med.inicio || !med.fin) return false;
      const inicio = new Date(med.inicio);
      inicio.setHours(0, 0, 0, 0);
      const fin = new Date(med.fin);
      fin.setHours(0, 0, 0, 0);
      return targetDate >= inicio && targetDate <= fin;
    });
  };

  const getLowStockMeds = () =>
    prescriptions.filter((med) => med.stock && med.stock < 5);

  const lowStock = getLowStockMeds();

  if (loading && prescriptions.length === 0) {
    return (
      <View style={styles.screenContainer}>
        <View style={styles.contentFrame}>
          <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{textAlign: 'center', padding: 20, fontSize: 16, color: '#666'}}>
                Sincronizando con tu doctor...
            </Text>
            <BottomNav navigation={navigation} accessibilitySettings={accessibilitySettings} active="calendar" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <ScrollView style={styles.scrollContent}>
            <View style={styles.invisiblePadding} />

            {/* ALERTA DE STOCK BAJO */}
            {lowStock.length > 0 && (
              <View style={styles.alertBox}>
                <Text style={[styles.alertTitle, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                  Atención
                </Text>
                {lowStock.map((med) => (
                  <Text key={med.id} style={[styles.alertText, accessibilitySettings.largeFont && { fontSize: 14 }]}>
                    Quedan pocas unidades de {med.nombre} ({med.stock}).
                  </Text>
                ))}
              </View>
            )}

            {/* SECCIÓN CALENDARIO */}
            <View style={styles.section}>
              <ScreenTitle accessibilitySettings={accessibilitySettings}>
                Calendario Health Reminder
              </ScreenTitle>

              <View style={styles.calendarWrapper}>
                <CalendarStrip
                  currentDate={currentDate}
                  selectedDate={selectedDate}
                  onSelectDate={(date) => {
                    setCurrentDate(date);
                    setSelectedDate(date);
                  }}
                  medications={prescriptions}
                  accessibilitySettings={accessibilitySettings}
                />
              </View>
            </View>

            {/* SECCIÓN LISTA DE HOY */}
            <View style={styles.section}>
              <View style={styles.todayHeader}>
                <Text style={styles.todayBullet}>●</Text>
                <Text style={[styles.todayTitle, accessibilitySettings.largeFont && styles.sectionTitleLarge]}>
                  Medicamentos para {selectedDate.toLocaleDateString()}
                </Text>
              </View>

              <Text style={[styles.todaySubtitle, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                {user?.nombreCompleto ? `Paciente: ${user.nombreCompleto}` : 'Tus recordatorios'}
              </Text>

              <View style={styles.medicationList}>
                {getMedsForDate(selectedDate).map((med) => (
                  <View key={med.id} style={styles.medicationDetailCard}>
                    <Text style={[styles.medicationName, { marginBottom: 5, color: getMedicationColor ? getMedicationColor(med.nombre) : '#2C3E50' }]}>
                      {med.nombre}
                    </Text>
                    
                    <Text style={[styles.medicationTime, { marginBottom: 3 }]}>
                      Dosis: {med.dosis || 'No especificada'}
                    </Text>

                    <Text style={[styles.medicationTime, { marginBottom: 3, color: '#007AFF' }]}>
                      Duración: {med.duracion || 'No especificada'}
                    </Text>

                    {med.horarios && med.horarios.length > 0 && (
                      <Text style={[styles.medicationTime, { marginBottom: 3 }]}>
                        Horarios: {med.horarios.map(hora => {
                          if (hora && hora.includes(':')) {
                            return formatTime(hora);
                          }
                          return hora;
                        }).join(', ')}
                      </Text>
                    )}

                    {med.instrucciones && (
                      <Text style={[styles.medicationTime, { fontStyle: 'italic', color: '#666' }]}>
                        {med.instrucciones}
                      </Text>
                    )}
                  </View>
                ))}

                {getMedsForDate(selectedDate).length === 0 && (
                  <View style={{padding: 20, alignItems: 'center'}}>
                    <Text style={[styles.emptyText, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                      No hay medicamentos programados para este día.
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* BOTÓN DE EMERGENCIA PARA LIMPIAR (SOLO DESARROLLO) */}
            <View style={{ padding: 20, alignItems: 'center' }}>
                <TouchableOpacity 
                    onPress={handleEmergencyCleanup}
                    style={{ backgroundColor: '#ff4444', padding: 15, borderRadius: 10 }}
                >
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>
                        ⚠️ BOTÓN DE PÁNICO: BORRAR ALARMAS
                    </Text>
                </TouchableOpacity>
                <Text style={{ marginTop: 5, color: '#999', fontSize: 10, textAlign: 'center' }}>
                    Úsalo si las notificaciones se volvieron locas. Luego reinicia la app.
                </Text>
            </View>

            <View style={styles.extraBottomPadding} />
          </ScrollView>

          <BottomNav
            navigation={navigation}
            accessibilitySettings={accessibilitySettings}
            active="calendar"
          />
        </View>
      </View>
    </View>
  );
};
