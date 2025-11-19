import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { PrescriptionsContext } from '../contexts/AppContext';
import { ScreenTitle } from '../components/ScreenTitle';
import { BottomNav } from '../components/BottomNav';
import { CalendarStrip } from '../components/common/CalendarStrip';
import { MedicationItem } from '../components/common/MedicationItem';
import { apiRequest } from '../utils/api';
import { formatDate } from '../utils/dateUtils';
import { styles } from '../styles/styles';

export const MainAppScreen = ({ navigation }) => {
  const { prescriptions, setPrescriptions, accessibilitySettings, user } = useContext(PrescriptionsContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Obtener medicamentos desde la API
  useEffect(() => {
    const fetchMedications = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const exampleMeds = [
          {
            id: 1,
            nombre: 'Paracetamol',
            inicio: new Date(),
            fin: new Date(new Date().setDate(new Date().getDate() + 7)),
            horarios: ['08:00', '20:00'],
            stock: 14,
            dosisPorToma: 1,
            esLargoPlazo: true,
          },
          {
            id: 2,
            nombre: 'Ibuprofeno',
            inicio: new Date(),
            fin: new Date(new Date().setDate(new Date().getDate() + 5)),
            horarios: ['12:00'],
            stock: 5,
            dosisPorToma: 1,
            esLargoPlazo: true,
          },
        ];
        
        setPrescriptions(exampleMeds);
      } catch (error) {
        console.error('Error fetching medications:', error);
        Alert.alert('Error', 'No se pudieron cargar los medicamentos');
      } finally {
        setLoading(false);
      }
    };

    fetchMedications();
  }, [user]);

  const getMedsForDate = (date) => {
    const d = formatDate(date);
    return prescriptions.filter((med) => {
      if (!med.inicio || !med.fin) return false;
      const inicio = formatDate(new Date(med.inicio));
      const fin = formatDate(new Date(med.fin));
      return d >= inicio && d <= fin;
    });
  };

  const getLowStockMeds = () =>
    prescriptions.filter((med) => {
      if (!med.esLargoPlazo) return false;
      const dosisPorDia = (med.horarios?.length || 0) * (med.dosisPorToma || 1);
      if (!dosisPorDia) return false;
      const diasRestantes = med.stock / dosisPorDia;
      return diasRestantes <= 3;
    });

  const lowStock = getLowStockMeds();

  if (loading) {
    return (
      <View style={styles.screenContainer}>
        <View style={styles.contentFrame}>
          <View style={styles.container}>
            <Text style={{textAlign: 'center', padding: 20}}>Cargando medicamentos...</Text>
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
                    Quedan pocas dosis de {med.nombre}. Revisa tu receta.
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
                Recordatorios de medicamentos y horarios
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
                  <Text style={[styles.emptyText, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                    No hay medicamentos para este día.
                  </Text>
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