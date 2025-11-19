import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { PrescriptionsContext } from '../contexts/AppContext';
import { useDualPress } from '../hooks/useDualPress';
import { ScreenTitle } from '../components/ScreenTitle';
import { BottomNav } from '../components/BottomNav';
import { styles } from '../styles/styles';

// Tu URL de Lambda
const API_URL = "https://a6p5u37ybkzmvauf4lko6j3yda0qgkcb.lambda-url.us-east-1.on.aws/";

export const PrescriptionScreen = ({ navigation }) => {
  const { accessibilitySettings, user } = useContext(PrescriptionsContext); 
  
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar Recetas
  useEffect(() => {
    if (!user || !user.id) {
        setLoading(false);
        return;
    }
    
    const fetchRecetas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'getRecipesByPatient',
                    data: { pacienteId: user.id }
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Ordenar por fecha (la más reciente primero)
                const recetasOrdenadas = data.sort((a, b) => 
                    new Date(b.fechaEmision) - new Date(a.fechaEmision)
                );
                setRecetas(recetasOrdenadas);
            } else {
                throw new Error(data.message || "No se pudieron cargar las recetas");
            }
        } catch (err) {
            console.error("Error fetching recipes:", err);
            setError("No se pudo conectar con el servidor.");
        } finally {
            setLoading(false);
        }
    };
    
    fetchRecetas();
  }, [user]); 

  // Hooks de accesibilidad para las tarjetas
  const card1 = useDualPress();
  const card2 = useDualPress();
  const card3 = useDualPress();
  const card4 = useDualPress();

  // --- ESTADO: CARGANDO ---
  if (loading) {
      return (
          <View style={styles.screenContainer}>
              <View style={styles.contentFrame}>
                  <View style={styles.container}>
                      <ScreenTitle accessibilitySettings={accessibilitySettings}>Mis Recetas</ScreenTitle>
                      <Text style={{textAlign: 'center', padding: 20, fontSize: 18}}>Cargando historial médico...</Text>
                      <BottomNav navigation={navigation} accessibilitySettings={accessibilitySettings} active="prescription" />
                  </View>
              </View>
          </View>
      );
  }
  
  // --- ESTADO: ERROR O VACÍO ---
  if (error || recetas.length === 0) {
      return (
          <View style={styles.screenContainer}>
              <View style={styles.contentFrame}>
                  <View style={styles.container}>
                      <ScrollView contentContainerStyle={styles.prescriptionScrollContent}>
                          <View style={styles.invisiblePadding} />
                          <View style={styles.prescriptionContainer}>
                              <ScreenTitle accessibilitySettings={accessibilitySettings}>Receta</ScreenTitle>
                              <View style={{
                                  backgroundColor: '#fff', 
                                  padding: 20, 
                                  borderRadius: 10, 
                                  alignItems: 'center',
                                  marginTop: 20
                              }}>
                                  <Text style={{ fontSize: 18, color: '#666', textAlign: 'center' }}>
                                      {error ? error : "Aún no tienes recetas registradas por tu doctor."}
                                  </Text>
                              </View>
                          </View>
                          <View style={styles.extraBottomPadding} />
                      </ScrollView>
                      <BottomNav navigation={navigation} accessibilitySettings={accessibilitySettings} active="prescription" />
                  </View>
              </View>
          </View>
      );
  }
  
  // Tomamos la receta más reciente
  const recetaMasReciente = recetas[0];

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.prescriptionScrollContent}>
            <View style={styles.invisiblePadding} />

            <View style={styles.prescriptionContainer}>
              <ScreenTitle accessibilitySettings={accessibilitySettings}>
                Última Receta
              </ScreenTitle>
              
              <Text style={{textAlign: 'center', color: '#666', marginBottom: 15, fontSize: 14}}>
                  Dr. {recetaMasReciente.doctorNombre || 'General'}
              </Text>
              
              {/* TARJETA 1: FECHA */}
              <Pressable style={styles.infoCard} onPressIn={card1.handlePressIn} onPressOut={card1.handlePressOut}>
                <Text style={[styles.cardTitle, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                  Fecha de Emisión
                </Text>
                <Text style={[styles.cardContent, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                  {new Date(recetaMasReciente.fechaEmision).toLocaleDateString('es-ES', { 
                      year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </Text>
              </Pressable>

              {/* TARJETA 2: DIAGNÓSTICO */}
              <Pressable style={styles.infoCard} onPressIn={card2.handlePressIn} onPressOut={card2.handlePressOut}>
                <Text style={[styles.cardTitle, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                  Diagnóstico
                </Text>
                <Text style={[styles.cardContent, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                  {recetaMasReciente.diagnostico}
                </Text>
              </Pressable>

              {/* TARJETA 3: OBSERVACIONES (Si existen) */}
              {recetaMasReciente.observaciones ? (
                  <Pressable style={styles.infoCard} onPressIn={card3.handlePressIn} onPressOut={card3.handlePressOut}>
                    <Text style={[styles.cardTitle, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                      Observaciones
                    </Text>
                    <Text style={[styles.cardContent, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                      {recetaMasReciente.observaciones}
                    </Text>
                  </Pressable>
              ) : null}

              {/* TARJETA 4: LISTA DE MEDICAMENTOS MEJORADA */}
              <Pressable 
                style={[styles.infoCard, { backgroundColor: '#f0f8ff', borderColor: '#3498db', borderWidth: 1 }]} 
                onPressIn={card4.handlePressIn} 
                onPressOut={card4.handlePressOut}
              >
                <Text style={[
                    styles.cardTitle, 
                    { color: '#2980b9', marginBottom: 10 }, 
                    accessibilitySettings.largeFont && { fontSize: 20 }
                ]}>
                  Medicamentos Recetados
                </Text>

                {recetaMasReciente.medicamentos && recetaMasReciente.medicamentos.length > 0 ? (
                    recetaMasReciente.medicamentos.map((med, index) => (
                        <View 
                            key={index} 
                            style={{
                                marginBottom: 15,
                                paddingBottom: 15,
                                borderBottomWidth: index === recetaMasReciente.medicamentos.length - 1 ? 0 : 1,
                                borderBottomColor: '#ddd'
                            }}
                        >
                            <Text style={{ 
                                fontWeight: 'bold', 
                                fontSize: accessibilitySettings.largeFont ? 18 : 16, 
                                color: '#2c3e50' 
                            }}>
                                • {med.nombre_medicamento || med.nombre}
                            </Text>
                            
                            <Text style={{ fontSize: accessibilitySettings.largeFont ? 16 : 14, marginTop: 2 }}>
                                <Text style={{ fontWeight: 'bold' }}>Dosis:</Text> {med.dosis}
                            </Text>
                            
                            <Text style={{ fontSize: accessibilitySettings.largeFont ? 16 : 14, marginTop: 2 }}>
                                <Text style={{ fontWeight: 'bold' }}>Frecuencia:</Text> {med.frecuencia}
                            </Text>

                            <Text style={{ fontSize: accessibilitySettings.largeFont ? 16 : 14, marginTop: 2 }}>
                                <Text style={{ fontWeight: 'bold' }}>Duración:</Text> {med.duracion}
                            </Text>

                            {med.instrucciones ? (
                                <Text style={{ 
                                    fontSize: accessibilitySettings.largeFont ? 15 : 13, 
                                    marginTop: 4, 
                                    fontStyle: 'italic',
                                    color: '#555' 
                                }}>
                                    Nota: {med.instrucciones}
                                </Text>
                            ) : null}
                        </View>
                    ))
                ) : (
                    <Text>No hay medicamentos listados.</Text>
                )}
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