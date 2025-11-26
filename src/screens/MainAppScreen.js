import React, { useState, useContext, useCallback, useRef } from 'react'; // Agregamos useRef
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native'; 
import { useFocusEffect } from '@react-navigation/native'; 
import { PrescriptionsContext } from '../contexts/AppContext';
import { ScreenTitle } from '../components/ScreenTitle';
import { BottomNav } from '../components/BottomNav';
import { CalendarStrip } from '../components/common/CalendarStrip';
import { MedicationItem } from '../components/common/MedicationItem';
import { formatDate } from '../utils/dateUtils';
import { styles } from '../styles/styles';

const API_URL = "https://a6p5u37ybkzmvauf4lko6j3yda0qgkcb.lambda-url.us-east-1.on.aws/";

export const MainAppScreen = ({ navigation }) => {
  const { prescriptions, setPrescriptions, accessibilitySettings, user } = useContext(PrescriptionsContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // CORRECCIÓN 1: El estado inicial de carga depende de si ya tenemos datos.
  const [loading, setLoading] = useState(prescriptions.length === 0);

  // Referencia para saber si es la primera carga o una actualización
  const firstLoad = useRef(true);

  // Función para calcular horarios basados en frecuencia y primera ingesta
  const calcularHorariosFrecuencia = (primeraIngesta, frecuencia) => {
    if (!primeraIngesta || !frecuencia) return [];
    
    const match = frecuencia.match(/\d+/);
    if (!match) return [primeraIngesta];
    
    const frecuenciaHoras = parseInt(match[0]);
    const horarios = [primeraIngesta];
    const [hora, minuto] = primeraIngesta.split(':').map(Number);
    
    for (let i = 1; i <= 3; i++) {
      const nuevaHoraTotal = hora + (frecuenciaHoras * i);
      const nuevaHora = nuevaHoraTotal % 24;
      const nuevaHoraStr = nuevaHora.toString().padStart(2, '0');
      const nuevoMinutoStr = minuto.toString().padStart(2, '0');
      
      horarios.push(`${nuevaHoraStr}:${nuevoMinutoStr}`);
    }
    
    return horarios;
  };

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

  // --- CORRECCIÓN PRINCIPAL: useFocusEffect BLINDADO ---
  useFocusEffect(
    useCallback(() => {
      let isActive = true; 

      const fetchMedications = async () => {
        if (!user || !user.id) {
          if (isActive) setLoading(false);
          return;
        }

        // CORRECCIÓN CRÍTICA:
        // Si ya tenemos datos (prescriptions > 0), NO mostramos el loading.
        // La actualización ocurre silenciosamente en el fondo ("background refresh").
        // Solo mostramos loading si la lista está vacía.
        if (prescriptions.length === 0 && isActive) {
            setLoading(true);
        } else {
            // Si ya hay datos, aseguramos que el loading esté apagado
            setLoading(false);
        }

        try {
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

            if (Array.isArray(recetas)) {
                recetas.forEach(receta => {
                    if (receta.medicamentos && Array.isArray(receta.medicamentos)) {
                        receta.medicamentos.forEach(med => {
                            const fechaInicio = new Date(receta.fechaEmision);
                            let diasDuracion = 30; 
                            if (med.duracion) {
                              const matchDuracion = med.duracion.match(/\d+/);
                              if (matchDuracion) {
                                diasDuracion = parseInt(matchDuracion[0], 10);
                                if (med.duracion.includes('semanas') || med.duracion.includes('semana')) diasDuracion *= 7;
                                if (med.duracion.includes('meses') || med.duracion.includes('mes')) diasDuracion *= 30;
                              }
                            }

                            const fechaFin = new Date(fechaInicio);
                            fechaFin.setDate(fechaInicio.getDate() + diasDuracion);

                            let horariosMostrar = [];
                            if (med.primeraIngesta && med.frecuencia) {
                              horariosMostrar = calcularHorariosFrecuencia(med.primeraIngesta, med.frecuencia);
                            } else if (med.frecuencia) {
                              horariosMostrar = [med.frecuencia];
                            } else if (med.primeraIngesta) {
                              horariosMostrar = [med.primeraIngesta];
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
                                horarios: horariosMostrar.length > 0 ? horariosMostrar : ['Horario no especificado'],
                                stock: med.cantidadInicial || 0,
                                dosisPorToma: 1,
                                esLargoPlazo: diasDuracion > 30,
                                diasDuracion: diasDuracion
                            });
                        });
                    }
                });
            }
            
            // Actualizamos el contexto. React es inteligente: si los datos son iguales,
            // no provocará un parpadeo visual molesto.
            setPrescriptions(allMeds);
          }
        } catch (error) {
          console.error('Error fetching medications:', error);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      fetchMedications();

      return () => { isActive = false; };
    }, [user?.id]) // Quitamos 'prescriptions' de las dependencias para evitar bucles
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

  // PANTALLA DE CARGA BLOQUEANTE
  // Solo se muestra si REALMENTE no tenemos datos en memoria.
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
                    <Text style={[styles.medicationName, { marginBottom: 5 }]}>
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
                          if (hora.includes(':')) {
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
