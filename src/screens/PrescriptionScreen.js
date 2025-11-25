import React, { useState, useContext, useEffect } from 'react';
<<<<<<< HEAD
import { View, Text, Pressable, ScrollView, Alert, TextInput, TouchableOpacity } from 'react-native';
=======
import { View, Text, Pressable, ScrollView } from 'react-native';
>>>>>>> 95f0f2be418f6437fae584e2fbc708221b9001df
import { PrescriptionsContext } from '../contexts/AppContext';
import { useDualPress } from '../hooks/useDualPress';
import { ScreenTitle } from '../components/ScreenTitle';
import { BottomNav } from '../components/BottomNav';
import { styles } from '../styles/styles';

const API_URL = "https://a6p5u37ybkzmvauf4lko6j3yda0qgkcb.lambda-url.us-east-1.on.aws/";

export const PrescriptionScreen = ({ navigation }) => {
<<<<<<< HEAD
  const { 
    accessibilitySettings, 
    user, 
    prescriptions, 
    addPrescriptionWithNotification,
    removePrescription 
  } = useContext(PrescriptionsContext); 
  
=======
  const { accessibilitySettings, user } = useContext(PrescriptionsContext);

>>>>>>> 95f0f2be418f6437fae584e2fbc708221b9001df
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMedication, setShowAddMedication] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dose: '',
    instructions: '',
    hour: '',
    minute: ''
  });

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

<<<<<<< HEAD
  // Hooks de accesibilidad para las tarjetas
  const card1 = useDualPress();
  const card2 = useDualPress();
  const card3 = useDualPress();
  const card4 = useDualPress();
  const addButton = useDualPress();

  // Agregar nuevo medicamento con notificación
  const handleAddMedication = async () => {
    if (!newMedication.name || !newMedication.dose || !newMedication.hour || !newMedication.minute) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (newMedication.hour < 0 || newMedication.hour > 23) {
      Alert.alert('Error', 'La hora debe estar entre 0 y 23');
      return;
    }

    if (newMedication.minute < 0 || newMedication.minute > 59) {
      Alert.alert('Error', 'Los minutos deben estar entre 0 y 59');
      return;
    }

    try {
      await addPrescriptionWithNotification(newMedication);
      
      Alert.alert(
        '✅ Medicamento Agregado', 
        `Notificación programada para las ${newMedication.hour.padStart(2, '0')}:${newMedication.minute.padStart(2, '0')}`
      );
      
      setNewMedication({
        name: '',
        dose: '',
        instructions: '',
        hour: '',
        minute: ''
      });
      setShowAddMedication(false);
      
    } catch (error) {
      Alert.alert('❌ Error', 'No se pudo programar la notificación. Verifica los permisos.');
    }
  };

  // Eliminar medicamento
  const handleRemoveMedication = async (medicationId) => {
    Alert.alert(
      'Eliminar Medicamento',
      '¿Estás seguro de que quieres eliminar este medicamento y su notificación?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            await removePrescription(medicationId);
            Alert.alert('✅ Medicamento eliminado');
          }
        }
      ]
    );
  };

  // Formatear hora para mostrar
  const formatTime = (hour, minute) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };
=======
    fetchRecetas();
  }, [user]);
>>>>>>> 95f0f2be418f6437fae584e2fbc708221b9001df

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
<<<<<<< HEAD
  
=======

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
>>>>>>> 95f0f2be418f6437fae584e2fbc708221b9001df
  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.prescriptionScrollContent}>
            <ScreenTitle accessibilitySettings={accessibilitySettings}>
              Mis Recetas
            </ScreenTitle>

<<<<<<< HEAD
            {/* SECCIÓN: AGREGAR MEDICAMENTO MANUAL */}
            <View style={styles.prescriptionContainer}>
              <ScreenTitle accessibilitySettings={accessibilitySettings}>
                Recordatorios de Medicamentos
              </ScreenTitle>

              {/* Botón para agregar nuevo medicamento */}
              <TouchableOpacity 
                style={[
                  styles.infoCard, 
                  { 
                    backgroundColor: '#e8f5e8', 
                    borderColor: '#4CAF50',
                    alignItems: 'center',
                    padding: 15
                  }
                ]}
                onPress={() => setShowAddMedication(!showAddMedication)}
                onPressIn={addButton.handlePressIn}
                onPressOut={addButton.handlePressOut}
              >
                <Text style={[styles.cardTitle, { color: '#2E7D32' }]}>
                  {showAddMedication ? '↶ Cancelar' : '＋ Agregar Recordatorio'}
                </Text>
              </TouchableOpacity>

              {/* Formulario para agregar medicamento */}
              {showAddMedication && (
                <View style={[styles.infoCard, { backgroundColor: '#f8f9fa' }]}>
                  <Text style={[styles.cardTitle, { marginBottom: 15 }]}>Nuevo Recordatorio</Text>
                  
                  <TextInput
                    style={[styles.input, accessibilitySettings.largeFont && { fontSize: 18 }]}
                    placeholder="Nombre del medicamento"
                    value={newMedication.name}
                    onChangeText={(text) => setNewMedication({...newMedication, name: text})}
                  />
                  
                  <TextInput
                    style={[styles.input, accessibilitySettings.largeFont && { fontSize: 18 }]}
                    placeholder="Dosis (ej: 500 mg)"
                    value={newMedication.dose}
                    onChangeText={(text) => setNewMedication({...newMedication, dose: text})}
                  />
                  
                  <TextInput
                    style={[styles.input, accessibilitySettings.largeFont && { fontSize: 18 }]}
                    placeholder="Instrucciones (opcional)"
                    value={newMedication.instructions}
                    onChangeText={(text) => setNewMedication({...newMedication, instructions: text})}
                  />
                  
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextInput
                      style={[
                        styles.input, 
                        { width: '48%' }, 
                        accessibilitySettings.largeFont && { fontSize: 18 }
                      ]}
                      placeholder="Hora (0-23)"
                      keyboardType="numeric"
                      value={newMedication.hour}
                      onChangeText={(text) => setNewMedication({...newMedication, hour: text})}
                    />
                    <TextInput
                      style={[
                        styles.input, 
                        { width: '48%' }, 
                        accessibilitySettings.largeFont && { fontSize: 18 }
                      ]}
                      placeholder="Minutos (0-59)"
                      keyboardType="numeric"
                      value={newMedication.minute}
                      onChangeText={(text) => setNewMedication({...newMedication, minute: text})}
                    />
                  </View>
                  
                  <TouchableOpacity 
                    style={{
                      backgroundColor: '#4CAF50',
                      padding: 15,
                      borderRadius: 8,
                      alignItems: 'center',
                      marginTop: 10
                    }}
                    onPress={handleAddMedication}
                  >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                      💊 Programar Recordatorio
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* LISTA DE MEDICAMENTOS PROGRAMADOS */}
              {prescriptions.length > 0 ? (
                <View style={{ marginTop: 20 }}>
                  <Text style={[styles.cardTitle, { marginBottom: 15 }]}>Mis Recordatorios Activos</Text>
                  
                  {prescriptions.map((med, index) => (
                    <Pressable 
                      key={med.id}
                      style={[
                        styles.infoCard, 
                        { 
                          backgroundColor: '#fff3cd', 
                          borderColor: '#ffc107',
                          marginBottom: 10
                        }
                      ]}
                    >
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.cardTitle, { color: '#856404', marginBottom: 5 }]}>
                            ⏰ {formatTime(med.hour, med.minute)}
                          </Text>
                          <Text style={[styles.cardContent, { fontWeight: 'bold', marginBottom: 3 }]}>
                            {med.name} {med.dose}
                          </Text>
                          {med.instructions ? (
                            <Text style={[styles.cardContent, { fontSize: 14, color: '#666' }]}>
                              {med.instructions}
                            </Text>
                          ) : null}
                        </View>
                        
                        <TouchableOpacity 
                          onPress={() => handleRemoveMedication(med.id)}
                          style={{
                            padding: 5,
                            marginLeft: 10
                          }}
                        >
                          <Text style={{ color: '#dc3545', fontSize: 16 }}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </Pressable>
                  ))}
                </View>
              ) : (
                <View style={[styles.infoCard, { backgroundColor: '#e9ecef', alignItems: 'center' }]}>
                  <Text style={[styles.cardContent, { color: '#6c757d', textAlign: 'center' }]}>
                    No tienes recordatorios programados. Agrega uno arriba.
                  </Text>
                </View>
              )}
            </View>
=======
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
>>>>>>> 95f0f2be418f6437fae584e2fbc708221b9001df

            {/* SECCIÓN: RECETAS MÉDICAS (CÓDIGO ORIGINAL) */}
            {recetas.length > 0 && (
              <View style={styles.prescriptionContainer}>
                <ScreenTitle accessibilitySettings={accessibilitySettings}>
                  Última Receta Médica
                </ScreenTitle>
                
                <Text style={{textAlign: 'center', color: '#666', marginBottom: 15, fontSize: 14}}>
                    Dr. {recetas[0].doctorNombre || 'General'}
                </Text>
                
                {/* TARJETA 1: FECHA */}
                <Pressable style={styles.infoCard} onPressIn={card1.handlePressIn} onPressOut={card1.handlePressOut}>
                  <Text style={[styles.cardTitle, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                    Fecha de Emisión
                  </Text>
                  <Text style={[styles.cardContent, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                    {new Date(recetas[0].fechaEmision).toLocaleDateString('es-ES', { 
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
                    {recetas[0].diagnostico}
                  </Text>
                </Pressable>

                {/* TARJETA 3: OBSERVACIONES (Si existen) */}
                {recetas[0].observaciones ? (
                    <Pressable style={styles.infoCard} onPressIn={card3.handlePressIn} onPressOut={card3.handlePressOut}>
                      <Text style={[styles.cardTitle, accessibilitySettings.largeFont && { fontSize: 18 }]}>
                        Observaciones
                      </Text>
                      <Text style={[styles.cardContent, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                        {recetas[0].observaciones}
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

                  {recetas[0].medicamentos && recetas[0].medicamentos.length > 0 ? (
                      recetas[0].medicamentos.map((med, index) => (
                          <View 
                              key={index} 
                              style={{
                                  marginBottom: 15,
                                  paddingBottom: 15,
                                  borderBottomWidth: index === recetas[0].medicamentos.length - 1 ? 0 : 1,
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
            )}

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