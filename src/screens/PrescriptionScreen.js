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


    return (
    <View style={styles.screenContainer}>
        <View style={styles.contentFrame}>
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.prescriptionScrollContent}>
            
            <ScreenTitle accessibilitySettings={accessibilitySettings}>
                Mis Recetas
            </ScreenTitle>

            {recetas.map((receta, index) => (
                <Pressable
                key={index}
                style={[styles.infoCard, { marginBottom: 20 }]}
                onPress={() =>
                    navigation.navigate("PrescriptionDetail", {
                    receta,
                    accessibilitySettings
                    })
                }
                >
                <Text style={[styles.cardTitle, {marginBottom:5}]}>
                    Receta del {new Date(receta.fechaEmision).toLocaleDateString("es-MX")}
                </Text>

                <Text style={styles.cardContent}>
                    Diagnóstico: {receta.diagnostico}
                </Text>

                <Text style={{marginTop:8, fontSize:16, color:"#555"}}>
                    Toca para ver detalles →
                </Text>
                </Pressable>
            ))}

            <View style={styles.extraBottomPadding} />
            </ScrollView>

            <BottomNav 
            navigation={navigation}
            accessibilitySettings={accessibilitySettings}
            active="prescription"
            />
        </View>
        </View>
    </View>
    );

};