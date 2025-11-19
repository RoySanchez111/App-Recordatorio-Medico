import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { PrescriptionsContext } from '../contexts/AppContext';
import { ScreenTitle } from '../components/ScreenTitle';
import { BottomNav } from '../components/BottomNav';
import { CalendarStrip } from '../components/common/CalendarStrip';
import { MedicationItem } from '../components/common/MedicationItem';
import { formatDate } from '../utils/dateUtils';
import { styles } from '../styles/styles';

// Tu URL de Lambda
const API_URL = "https://a6p5u37ybkzmvauf4lko6j3yda0qgkcb.lambda-url.us-east-1.on.aws/";

export const MainAppScreen = ({ navigation }) => {
  const { prescriptions, setPrescriptions, accessibilitySettings, user } = useContext(PrescriptionsContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Obtener medicamentos REALES desde la API
  useEffect(() => {
    const fetchMedications = async () => {
      // Si no hay usuario logueado o no tiene ID, no podemos buscar recetas
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        // 1. Petición a la Lambda
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

        // 2. Transformación de Datos
        // La API devuelve Recetas -> Medicamentos. La App necesita una lista plana de Medicamentos.
        const allMeds = [];

        if (Array.isArray(recetas)) {
            recetas.forEach(receta => {
                if (receta.medicamentos && Array.isArray(receta.medicamentos)) {
                    receta.medicamentos.forEach(med => {
                        
                        // Calculamos fechas
                        const fechaInicio = new Date(receta.fechaEmision); // Usamos fecha de emisión como inicio
                        
                        // Intentamos parsear la duración (ej: "5 días" -> 5)
                        let diasDuracion = 7; // Default 1 semana si falla
                        const matchDuracion = med.duracion ? med.duracion.match(/\d+/) : null;
                        if (matchDuracion) {
                            diasDuracion = parseInt(matchDuracion[0], 10);
                        }

                        const fechaFin = new Date(fechaInicio);
                        fechaFin.setDate(fechaInicio.getDate() + diasDuracion);

                        // Mapeamos al formato que usa tu App visualmente
                        allMeds.push({
                            id: med.id, // ID único del detalle
                            recetaId: receta.id,
                            nombre: med.nombre_medicamento,
                            dosis: med.dosis,
                            instrucciones: med.instrucciones,
                            inicio: fechaInicio,
                            fin: fechaFin,
                            // Usamos la frecuencia como "horario" visual ya que no tenemos horas exactas en la BD
                            horarios: [med.frecuencia], 
                            stock: med.cantidadInicial || 0,
                            dosisPorToma: 1,
                            esLargoPlazo: diasDuracion > 30 // Lógica simple para determinar si es largo plazo
                        });
                    });
                }
            });
        }
        
        // 3. Guardar en el contexto
        setPrescriptions(allMeds);

      } catch (error) {
        console.error('Error fetching medications:', error);
        // No mostramos alerta intrusiva al inicio, solo log, para no molestar al UX
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [user]); // Se ejecuta cuando cambia el usuario

  // Filtrar medicamentos para el día seleccionado
  const getMedsForDate = (date) => {
    // Convertimos a string YYYY-MM-DD para comparar sin horas
    const targetDate = new Date(date).setHours(0,0,0,0);
    
    return prescriptions.filter((med) => {
      if (!med.inicio || !med.fin) return false;
      
      const inicio = new Date(med.inicio).setHours(0,0,0,0);
      const fin = new Date(med.fin).setHours(0,0,0,0);
      
      return targetDate >= inicio && targetDate <= fin;
    });
  };

  // Lógica de stock bajo
  const getLowStockMeds = () =>
    prescriptions.filter((med) => {
        // Si el stock es menor a 5 unidades, avisar
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
                  <MedicationItem 
                    key={med.id} 
                    med={med} 
                    accessibilitySettings={accessibilitySettings}
                    showTimes={true}
                  />
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