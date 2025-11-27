import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { PrescriptionsContext } from '../contexts/AppContext';
import { ScreenTitle } from '../components/ScreenTitle';
import { BottomNav } from '../components/BottomNav';
import { styles } from '../styles/styles';

const API_URL = "https://a6p5u37ybkzmvauf4lko6j3yda0qgkcb.lambda-url.us-east-1.on.aws/";

export const PrescriptionScreen = ({ navigation }) => {
  const { accessibilitySettings, user } = useContext(PrescriptionsContext);
  
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calcular duración total del tratamiento basado en los medicamentos
  const calcularDuracionTratamiento = (medicamentos) => {
    if (!medicamentos || !Array.isArray(medicamentos) || medicamentos.length === 0) {
      return "Ver detalles";
    }

    // Intentar buscar la duración en el primer medicamento que tenga el dato
    const medConDuracion = medicamentos.find(m => m.duracion && m.duracion.length > 0);
    return medConDuracion ? medConDuracion.duracion : "Ver detalles";
  };

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
            data: { pacienteId: user.id },
          }),
        });

        const data = await response.json();

        if (response.ok) {
          // Ordenar por fecha: Más recientes primero
          const recetasOrdenadas = data.sort(
            (a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision)
          );
          setRecetas(recetasOrdenadas);
        } else {
          throw new Error(data.message || 'No se pudieron cargar las recetas');
        }
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError('No se pudo conectar con el servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecetas();
  }, [user]);

  // --- ESTADO: CARGANDO ---
  if (loading) {
    return (
      <View style={styles.screenContainer}>
        <View style={styles.contentFrame}>
          <View style={styles.container}>
            <ScreenTitle accessibilitySettings={accessibilitySettings}>
              Mis Recetas
            </ScreenTitle>
            <Text style={{ textAlign: 'center', padding: 20, fontSize: 18 }}>
              Cargando historial médico...
            </Text>
            <BottomNav
              navigation={navigation}
              accessibilitySettings={accessibilitySettings}
              active="prescription"
            />
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
                <ScreenTitle accessibilitySettings={accessibilitySettings}>
                  Historial de Recetas
                </ScreenTitle>
                <View
                  style={{
                    backgroundColor: '#fff',
                    padding: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    marginTop: 20,
                    borderWidth: 1,
                    borderColor: '#eee'
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#666',
                      textAlign: 'center',
                      lineHeight: 24
                    }}
                  >
                    {error
                      ? error
                      : 'No tienes recetas registradas en tu historial médico.'}
                  </Text>
                </View>
              </View>
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
  }

  // ========= VISTA DE LISTA (HISTORIAL COMPLETO) =========
  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.prescriptionScrollContent}>
            
            <ScreenTitle accessibilitySettings={accessibilitySettings}>
              Historial de Recetas
            </ScreenTitle>

            <Text style={{
                textAlign: 'center', 
                color: '#7f8c8d', 
                marginBottom: 15, 
                fontSize: 14
            }}>
                {user?.nombreCompleto ? `Paciente: ${user.nombreCompleto}` : 'Tus recetas médicas'}
            </Text>

            {recetas.map((receta, index) => {
              const duracion = calcularDuracionTratamiento(receta.medicamentos);
              // Formatear fecha para que sea legible (ej: 10/05/2024)
              const fechaObj = new Date(receta.fechaEmision);
              const fechaFormateada = fechaObj.toLocaleDateString('es-MX', {
                  year: 'numeric', month: 'long', day: 'numeric'
              });
              
              return (
                <Pressable
                  key={index}
                  style={[styles.infoCard, { marginBottom: 20 }]}
                  onPress={() => navigation.navigate('PrescriptionDetail', { 
                    receta: receta,
                    accessibilitySettings: accessibilitySettings 
                  })}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={[styles.cardTitle, { marginBottom: 0, fontSize: 16, color: '#2c3e50' }]}>
                      📅 {fechaFormateada}
                    </Text>
                    {index === 0 && (
                        <View style={{ backgroundColor: '#e1f5fe', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                            <Text style={{ color: '#0288d1', fontSize: 10, fontWeight: 'bold' }}>RECIENTE</Text>
                        </View>
                    )}
                  </View>

                  <View style={{ borderBottomWidth: 1, borderBottomColor: '#f0f0f0', marginBottom: 10 }} />

                  <Text style={[styles.cardContent, { marginBottom: 8, fontWeight: 'bold', color: '#34495e' }]}>
                    {receta.diagnostico || 'Diagnóstico no especificado'}
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <Text style={{ fontSize: 14, color: '#7f8c8d', marginRight: 5 }}>Dr.</Text>
                    <Text style={{ fontSize: 14, color: '#34495e' }}>
                        {receta.doctorNombre || 'Médico General'}
                    </Text>
                  </View>

                  <Text style={[styles.cardContent, { marginTop: 8, fontSize: 13, color: '#7f8c8d' }]}>
                    💊 {receta.medicamentos?.length || 0} medicamento(s) • {duracion}
                  </Text>

                  <Text
                    style={{
                      marginTop: 15,
                      fontSize: 14,
                      color: '#3498db',
                      textAlign: 'right',
                      fontWeight: '600'
                    }}
                  >
                    Ver receta completa →
                  </Text>
                </Pressable>
              );
            })}

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