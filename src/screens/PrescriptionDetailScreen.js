import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { ScreenTitle } from "../components/ScreenTitle";
import { BottomNav } from "../components/BottomNav";
import { styles } from "../styles/styles";

export default function PrescriptionDetailScreen({ route, navigation }) {
  const { receta, accessibilitySettings } = route.params;

  // Formatear hora (ej: "14:00" -> "2:00 PM")
  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.prescriptionScrollContent}>
            
            <ScreenTitle accessibilitySettings={accessibilitySettings}>
              Receta del{" "}
              {new Date(receta.fechaEmision).toLocaleDateString("es-MX")}
            </ScreenTitle>

            {/* Diagnóstico */}
            <View style={[styles.infoCard, { marginBottom: 20 }]}>
              <Text style={styles.cardTitle}>Diagnóstico Principal</Text>
              <Text style={styles.cardContent}>
                {receta.diagnostico || "No especificado"}
              </Text>
            </View>

            {/* Observaciones */}
            {receta.observaciones && (
              <View style={[styles.infoCard, { marginBottom: 20 }]}>
                <Text style={styles.cardTitle}>Observaciones Médicas</Text>
                <Text style={styles.cardContent}>{receta.observaciones}</Text>
              </View>
            )}

            {/* Medicamentos */}
            <View
              style={[
                styles.infoCard,
                { backgroundColor: "#f8fbff", marginBottom: 20 },
              ]}
            >
              <Text style={[styles.cardTitle, { marginBottom: 15 }]}>
                Medicamentos Prescritos
              </Text>

              {receta.medicamentos && receta.medicamentos.length > 0 ? (
                receta.medicamentos.map((medicamento, index) => {
                  
                  // ASUNCIÓN: La API trae una propiedad 'horarios' que es un array de strings ["08:00", "16:00"]
                  // Si tu propiedad se llama diferente (ej: 'listaHoras'), cámbialo aquí.
                  const horariosFijos = medicamento.horarios || []; 

                  return (
                    <View
                      key={index}
                      style={[
                        styles.medicationDetailCard,
                        {
                          marginBottom: 25,
                          padding: 20,
                          backgroundColor: "#ffffff",
                          borderRadius: 12,
                          borderLeftWidth: 4,
                          borderLeftColor: "#007AFF",
                        },
                      ]}
                    >
                      {/* Nombre */}
                      <Text
                        style={[
                          styles.medicationName,
                          {
                            fontSize: 18,
                            marginBottom: 15,
                            color: "#2c3e50",
                            fontWeight: "600",
                          },
                        ]}
                      >
                        {medicamento.nombre_medicamento || "Medicamento"}
                      </Text>

                      {/* Detalles Generales */}
                      <View style={styles.medicationInfoContainer}>
                        <View style={styles.detailSection}>
                          <Text style={styles.detailLabel}>Dosis:</Text>
                          <Text style={styles.detailValue}>
                            {medicamento.dosis || "No especificada"}
                          </Text>
                        </View>

                        <View style={styles.detailSection}>
                          <Text style={styles.detailLabel}>Duración:</Text>
                          <Text style={styles.detailValue}>
                            {medicamento.duracion || "No especificada"}
                          </Text>
                        </View>
                      </View>

                      {/* ----- SECCIÓN DE HORARIOS FIJOS ----- */}
                      {/* Solo se muestra si la lista 'horarios' tiene elementos */}
                      {horariosFijos.length > 0 && (
                        <View style={styles.horariosSection}>
                          <Text style={[styles.detailLabel, { marginBottom: 10, marginTop: 10 }]}>
                            Horarios de toma:
                          </Text>
                          
                          <View style={styles.horariosContainer}>
                            {horariosFijos.map((hora, idx) => (
                              <View
                                key={idx}
                                style={styles.horarioTagContainer} 
                              >
                                <Text style={styles.horarioTag}>
                                  {formatTime(hora)}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* Instrucciones */}
                      {medicamento.instrucciones && (
                        <View style={styles.instruccionesSection}>
                          <Text style={[styles.detailLabel, { marginBottom: 8, marginTop: 10 }]}>
                            Instrucciones:
                          </Text>
                          <Text
                            style={[
                              styles.instruccionesText,
                              {
                                fontStyle: "italic",
                                color: "#555",
                                lineHeight: 20,
                              },
                            ]}
                          >
                            {medicamento.instrucciones}
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })
              ) : (
                <View style={styles.noMedicamentosContainer}>
                  <Text style={styles.noMedicamentosText}>
                    No hay medicamentos registrados.
                  </Text>
                </View>
              )}
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>

          {/* Botón Volver */}
          <View style={{ width: "100%", paddingHorizontal: 20, marginBottom: 20 }}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={{
                width: "100%",
                paddingVertical: 14,
                backgroundColor: "#007AFF",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                elevation: 2
              }}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                ← Volver a mis recetas
              </Text>
            </Pressable>
          </View>

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