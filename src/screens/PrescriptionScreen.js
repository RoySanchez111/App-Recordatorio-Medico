import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { PrescriptionsContext } from '../contexts/AppContext';
import { useDualPress } from '../hooks/useDualPress';
import { ScreenTitle } from '../components/ScreenTitle';
import { BottomNav } from '../components/BottomNav';
import { MedicationItemPrescription } from '../components/common/MedicationItem';
import { apiRequest } from '../utils/api';
import { styles } from '../styles/styles';

export const PrescriptionScreen = ({ navigation }) => {
  const { accessibilitySettings, user } = useContext(PrescriptionsContext); 
  
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id) {
        setError("No se pudo identificar al paciente. Inicia sesión.");
        setLoading(false);
        return;
    }
    
    const fetchRecetas = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiRequest("getRecipesByPatient", { pacienteId: user.id });
            setRecetas(data.sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision)));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    fetchRecetas();
  }, [user]); 

  const card1 = useDualPress();
  const card2 = useDualPress();
  const card3 = useDualPress();
  const card4 = useDualPress();

  if (loading) {
      return (
          <View style={styles.screenContainer}>
              <View style={styles.contentFrame}>
                  <View style={styles.container}>
                      <ScreenTitle accessibilitySettings={accessibilitySettings}>Receta</ScreenTitle>
                      <Text style={{textAlign: 'center', padding: 20}}>Cargando tus recetas...</Text>
                      <BottomNav navigation={navigation} accessibilitySettings={accessibilitySettings} active="prescription" />
                  </View>
              </View>
          </View>
      );
  }
  
  if (error) {
      return (
          <View style={styles.screenContainer}>
              <View style={styles.contentFrame}>
                  <View style={styles.container}>
                      <ScreenTitle accessibilitySettings={accessibilitySettings}>Receta</ScreenTitle>
                      <Text style={{textAlign: 'center', padding: 20, color: 'red'}}>Error: {error}</Text>
                      <BottomNav navigation={navigation} accessibilitySettings={accessibilitySettings} active="prescription" />
                  </View>
              </View>
          </View>
      );
  }
  
  if (recetas.length === 0) {
      return (
          <View style={styles.screenContainer}>
              <View style={styles.contentFrame}>
                  <View style={styles.container}>
                      <ScrollView contentContainerStyle={styles.prescriptionScrollContent}>
                          <View style={styles.invisiblePadding} />
                          <View style={styles.prescriptionContainer}>
                              <ScreenTitle accessibilitySettings={accessibilitySettings}>Receta - Health Reminder</ScreenTitle>
                              <Text style={{textAlign: 'center', padding: 20, fontSize: 16, color: '#666'}}>
                                  No tienes recetas activas en este momento.
                              </Text>
                          </View>
                          <View style={styles.extraBottomPadding} />
                      </ScrollView>
                      <BottomNav navigation={navigation} accessibilitySettings={accessibilitySettings} active="prescription" />
                  </View>
              </View>
          </View>
      );
  }
  
  const recetaMasReciente = recetas[0];

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.prescriptionScrollContent}>
            <View style={styles.invisiblePadding} />

            <View style={styles.prescriptionContainer}>
              <ScreenTitle accessibilitySettings={accessibilitySettings}>
                Receta - Health Reminder
              </ScreenTitle>
              <Text style={{textAlign: 'center', color: '#666', marginBottom: 15, fontSize: 12}}>
                  Mostrando tu receta más reciente.
              </Text>
              
              <Pressable style={styles.infoCard} onPressIn={card1.handlePressIn} onPressOut={card1.handlePressOut}>
                <Text style={[styles.cardTitle, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                  Fecha de Emisión
                </Text>
                <Text style={[styles.cardContent, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                  {new Date(recetaMasReciente.fechaEmision).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
                </Text>
              </Pressable>

              <Pressable style={styles.infoCard} onPressIn={card2.handlePressIn} onPressOut={card2.handlePressOut}>
                <Text style={[styles.cardTitle, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                  Diagnóstico
                </Text>
                <Text style={[styles.cardContent, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                  {recetaMasReciente.diagnostico}
                </Text>
              </Pressable>

              <Pressable style={styles.infoCard} onPressIn={card3.handlePressIn} onPressOut={card3.handlePressOut}>
                <Text style={[styles.cardTitle, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                  Observación
                </Text>
                <Text style={[styles.cardContent, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                  {recetaMasReciente.observaciones || 'Sin observaciones.'}
                </Text>
              </Pressable>

              <Pressable style={styles.infoCard} onPressIn={card4.handlePressIn} onPressOut={card4.handlePressOut}>
                <Text style={[styles.cardTitle, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                  Medicamentos
                </Text>

                {recetaMasReciente.medicamentos.map((med) => (
                  <MedicationItemPrescription 
                    key={med.id} 
                    med={med} 
                    accessibilitySettings={accessibilitySettings}
                  />
                ))}
              </Pressable>
            </View>

            <View style={styles.extraBottomPadding} />
          </ScrollView>

          <BottomNav navigation={navigation} accessibilitySettings={accessibilitySettings} active="prescription" />
        </View>
      </View>
    </View>
  );
};