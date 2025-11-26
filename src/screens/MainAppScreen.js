import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
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
  const [loading, setLoading] = useState(true);

  // Función para calcular horarios basados en frecuencia y primera ingesta
  const calcularHorariosFrecuencia = (primeraIngesta, frecuencia) => {
    if (!primeraIngesta || !frecuencia) return [];
    
    // Extraer número de horas de la frecuencia (ej: "cada 8 horas" -> 8)
    const match = frecuencia.match(/\d+/);
    if (!match) return [primeraIngesta];
    
    const frecuenciaHoras = parseInt(match[0]);
    const horarios = [primeraIngesta];
    const [hora, minuto] = primeraIngesta.split(':').map(Number);
    
    // Calcular las siguientes 3 tomas basadas en la frecuencia
    for (let i = 1; i <= 3; i++) {
      const nuevaHoraTotal = hora + (frecuenciaHoras * i);
      const nuevaHora = nuevaHoraTotal % 24;
      const nuevaHoraStr = nuevaHora.toString().padStart(2, '0');
      const nuevoMinutoStr = minuto.toString().padStart(2, '0');
      
      horarios.push(`${nuevaHoraStr}:${nuevoMinutoStr}`);
    }
    
    return horarios;
  };

  // Formatear hora para mostrar
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

  // Obtener medicamentos REALES desde la API
  useEffect(() => {
    const fetchMedications = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
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

        if (!response.ok) {
          throw new Error(recetas.message || 'Error al obtener recetas');
        }

        // Transformación de Datos con información COMPLETA de la API
        const allMeds = [];

        if (Array.isArray(recetas)) {
            recetas.forEach(receta => {
                if (receta.medicamentos && Array.isArray(receta.medicamentos)) {
                    receta.medicamentos.forEach(med => {
                        
                        // Calculamos fechas basadas en la duración REAL
                        const fechaInicio = new Date(receta.fechaEmision);
                        
                        // Parsear duración para calcular fecha fin CORRECTAMENTE
                        let diasDuracion = 30; // Default 1 mes para que dure más tiempo
                        if (med.duracion) {
                          const matchDuracion = med.duracion.match(/\d+/);
                          if (matchDuracion) {
                            diasDuracion = parseInt(matchDuracion[0], 10);
                            // Si dice "semanas", multiplicar por 7
                            if (med.duracion.includes('semanas') || med.duracion.includes('semana')) {
                              diasDuracion = diasDuracion * 7;
                            }
                            // Si dice "meses", multiplicar por 30
                            if (med.duracion.includes('meses') || med.duracion.includes('mes')) {
                              diasDuracion = diasDuracion * 30;
                            }
                          }
                        }

                        const fechaFin = new Date(fechaInicio);
                        fechaFin.setDate(fechaInicio.getDate() + diasDuracion);

                        // Calcular horarios si hay frecuencia y primera ingesta
                        let horariosMostrar = [];
                        if (med.primeraIngesta && med.frecuencia) {
                          horariosMostrar = calcularHorariosFrecuencia(med.primeraIngesta, med.frecuencia);
                        } else if (med.frecuencia) {
                          // Si solo hay frecuencia, mostrar la frecuencia como horario
                          horariosMostrar = [med.frecuencia];
                        } else if (med.primeraIngesta) {
                          // Si solo hay primera ingesta, mostrar solo esa
                          horariosMostrar = [med.primeraIngesta];
                        }

                        // Mapear al formato que usa la App con TODOS los campos REALES
                        allMeds.push({
                            // Información básica
                            id: med.id || `${receta.id}-${med.nombre_medicamento}`,
                            recetaId: receta.id,
                            
                            // Campos REALES de la API (los que realmente se guardan)
                            nombre: med.nombre_medicamento,
                            dosis: med.dosis,
                            duracion: med.duracion,
                            frecuencia: med.frecuencia,
                            primeraIngesta: med.primeraIngesta,
                            instrucciones: med.instrucciones,
                            cantidadInicial: med.cantidadInicial,
                            
                            // Campos calculados
                            inicio: fechaInicio,
                            fin: fechaFin,
                            horarios: horariosMostrar.length > 0 ? horariosMostrar : ['Horario no especificado'],
                            stock: med.cantidadInicial || 0,
                            dosisPorToma: 1,
                            esLargoPlazo: diasDuracion > 30,
                            diasDuracion: diasDuracion // Guardamos los días para debug
                        });
                    });
                }
            });
        }
        
        setPrescriptions(allMeds);

      } catch (error) {
        console.error('Error fetching medications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [user]);

  // Filtrar medicamentos para el día seleccionado - CORREGIDO DEFINITIVAMENTE
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

  // Lógica de stock bajo
  const getLowStockMeds = () =>
    prescriptions.filter((med) => {
        return med.stock && med.stock < 5;
    });

  const lowStock = getLowStockMeds();

  if (loading) {
    return (
      <View style={styles.screenContainer}>
        <View style={styles.contentFrame}>
          <View style={styles.container}>
            <Text style={{textAlign: 'center', padding: 20, marginTop: 50}}>Sincronizando con tu doctor...</Text>
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
                    
                    {/* Mostrar dosis - SIEMPRE mostrar aunque esté vacía */}
                    <Text style={[styles.medicationTime, { marginBottom: 3 }]}>
                      Dosis: {med.dosis || 'No especificada'}
                    </Text>

                    {/* Mostrar duración - USAR el campo duracion que sí funciona */}
                    <Text style={[styles.medicationTime, { marginBottom: 3, color: '#007AFF' }]}>
                      Duración: {med.duracion || 'No especificada'}
                    </Text>

                    {/* Mostrar horarios */}
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

                    {/* Mostrar instrucciones si existen */}
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