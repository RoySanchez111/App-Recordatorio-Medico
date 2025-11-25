import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { PrescriptionsContext } from '../contexts/AppContext';
import { ScreenTitle } from '../components/ScreenTitle';
import { BottomNav } from '../components/BottomNav';
import { CalendarStrip } from '../components/common/CalendarStrip';
import { styles } from '../styles/styles';

const API_URL = "https://a6p5u37ybkzmvauf4lko6j3yda0qgkcb.lambda-url.us-east-1.on.aws/";

export const MainAppScreen = ({ navigation }) => {
  const { prescriptions, setPrescriptions, accessibilitySettings, user, getMedicationColor } = useContext(PrescriptionsContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

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

        const allMeds = [];

        if (Array.isArray(recetas)) {
            recetas.forEach(receta => {
                if (receta.medicamentos && Array.isArray(receta.medicamentos)) {
                    receta.medicamentos.forEach(med => {
                        const fechaInicio = new Date(receta.fechaEmision);
                        
                        let fechaFin = new Date(fechaInicio);
                        
                        if (med.duracion) {
                          const matchDuracion = med.duracion.match(/\d+/);
                          if (matchDuracion) {
                            const duracionNum = parseInt(matchDuracion[0], 10);
                            
                            if (med.duracion.includes('mes') || med.duracion.includes('month')) {
                              fechaFin.setMonth(fechaInicio.getMonth() + duracionNum);
                            } else if (med.duracion.includes('semana') || med.duracion.includes('week')) {
                              fechaFin.setDate(fechaInicio.getDate() + (duracionNum * 7));
                            } else {
                              fechaFin.setDate(fechaInicio.getDate() + duracionNum);
                            }
                          }
                        } else {
                          fechaFin.setDate(fechaInicio.getDate() + 7);
                        }

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
                            esLargoPlazo: med.duracion && (med.duracion.includes('mes') || med.duracion.includes('month'))
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

  const getMedsForDate = (date) => {
    const targetDate = new Date(date).setHours(0,0,0,0);
    
    return prescriptions.filter((med) => {
      if (!med.inicio || !med.fin) return false;
      
      const inicio = new Date(med.inicio).setHours(0,0,0,0);
      const fin = new Date(med.fin).setHours(23,59,59,999);
      
      return targetDate >= inicio && targetDate <= fin;
    });
  };

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
                  <View key={med.id} style={styles.medicationDetailCardEnhanced}>
                    <Text style={[styles.medicationName, { 
                      marginBottom: 16,
                      color: getMedicationColor(med.nombre)
                    }]}>
                      {med.nombre}
                    </Text>
                    
                    <View style={styles.detailRowEnhanced}>
                      <Text style={styles.detailLabelEnhanced}>Dosis:</Text>
                      <Text style={styles.detailValueEnhanced}>
                        {med.dosis || 'No especificada'}
                      </Text>
                    </View>

                    <View style={styles.detailRowEnhanced}>
                      <Text style={styles.detailLabelEnhanced}>Duración:</Text>
                      <Text style={styles.detailValueEnhanced}>
                        {med.duracion || 'No especificada'}
                      </Text>
                    </View>

                    {med.frecuencia && (
                      <View style={styles.detailRowEnhanced}>
                        <Text style={styles.detailLabelEnhanced}>Frecuencia:</Text>
                        <Text style={styles.detailValueEnhanced}>
                          {med.frecuencia}
                        </Text>
                      </View>
                    )}

                    {med.primeraIngesta && (
                      <View style={styles.detailRowEnhanced}>
                        <Text style={styles.detailLabelEnhanced}>Primera toma:</Text>
                        <Text style={styles.detailValueEnhanced}>
                          {formatTime(med.primeraIngesta)}
                        </Text>
                      </View>
                    )}

                    {med.horarios && med.horarios.length > 0 && (
                      <View style={styles.detailRowEnhanced}>
                        <Text style={styles.detailLabelEnhanced}>Horarios:</Text>
                        <View style={styles.horariosContainerEnhanced}>
                          {med.horarios.map((hora, idx) => (
                            <Text key={idx} style={[
                              styles.horarioTagEnhanced,
                              med.primeraIngesta && hora === med.primeraIngesta ? styles.horarioPrincipalEnhanced : {}
                            ]}>
                              {hora.includes(':') ? formatTime(hora) : hora}
                            </Text>
                          ))}
                        </View>
                      </View>
                    )}

                    {med.instrucciones && (
                      <View style={styles.instruccionesSection}>
                        <Text style={[styles.detailLabelEnhanced, { marginBottom: 8 }]}>Instrucciones:</Text>
                        <Text style={[styles.detailValueEnhanced, { fontStyle: 'italic', color: '#555' }]}>
                          {med.instrucciones}
                        </Text>
                      </View>
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