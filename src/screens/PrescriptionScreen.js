import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { PrescriptionsContext } from '../contexts/AppContext';
import { useDualPress } from '../hooks/useDualPress';
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
      return "Duración no especificada";
    }

    // Buscar la duración más larga entre todos los medicamentos
    let duracionMasLarga = "";
    
    medicamentos.forEach(med => {
      if (med.duracion && med.duracion.length > 0) {
        // Si encontramos una duración, la usamos
        duracionMasLarga = med.duracion;
      }
    });

    if (!duracionMasLarga) {
      return "Duración no especificada";
    }

    return duracionMasLarga;
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
                  Receta
                </ScreenTitle>
                <View
                  style={{
                    backgroundColor: '#fff',
                    padding: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    marginTop: 20,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: '#666',
                      textAlign: 'center',
                    }}
                  >
                    {error
                      ? error
                      : 'Aún no tienes recetas registradas por tu doctor.'}
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

  // ========= VISTA DE LISTA (MIS RECETAS) =========
  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.prescriptionScrollContent}>
            <ScreenTitle accessibilitySettings={accessibilitySettings}>
              Mis Recetas
            </ScreenTitle>

            {recetas.map((receta, index) => {
              const duracion = calcularDuracionTratamiento(receta.medicamentos);
              const fechaFormateada = new Date(receta.fechaEmision).toLocaleDateString('es-MX');
              
              return (
                <Pressable
                  key={index}
                  style={[styles.infoCard, { marginBottom: 20 }]}
                  onPress={() => navigation.navigate('PrescriptionDetail', { 
                    receta: receta,
                    accessibilitySettings: accessibilitySettings 
                  })}
                >
                  <Text style={[styles.cardTitle, { marginBottom: 5 }]}>
                    Receta del {fechaFormateada}
                  </Text>

                  <Text style={[styles.cardContent, { marginBottom: 8 }]}>
                    Diagnóstico: {receta.diagnostico || 'No especificado'}
                  </Text>

                  <Text style={[styles.cardContent, { fontWeight: '600', color: '#007AFF' }]}>
                    Duración del tratamiento: {duracion}
                  </Text>

                  <Text style={[styles.cardContent, { marginTop: 8, fontSize: 14, color: '#666' }]}>
                    {receta.medicamentos?.length || 0} medicamento(s) prescrito(s)
                  </Text>

                  <Text
                    style={{
                      marginTop: 12,
                      fontSize: 14,
                      color: '#007AFF',
                      textAlign: 'right',
                    }}
                  >
                    Toca para ver detalles completos →
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