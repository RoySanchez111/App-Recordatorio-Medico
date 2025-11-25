import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { ScreenTitle } from "../components/ScreenTitle";
import { BottomNav } from "../components/BottomNav";
import { styles } from "../styles/styles";

export default function PrescriptionDetailScreen({ route, navigation }) {
  const { receta, accessibilitySettings } = route.params;
  const doctorDisplay = receta.doctorNombre || "Información No Disponible";

  // Función para calcular horarios basados en frecuencia y primera ingesta
  const calcularHorariosFrecuencia = (primeraIngesta, frecuencia) => {
    if (!primeraIngesta || !frecuencia) return [];

    // Extraer número de horas de la frecuencia (ej: "cada 8 horas" -> 8)
    const match = frecuencia.match(/\d+/);
    if (!match) return [primeraIngesta];

    const frecuenciaHoras = parseInt(match[0]);
    const horarios = [primeraIngesta];
    const [hora, minuto] = primeraIngesta.split(":").map(Number);

    // Calcular las siguientes 3 tomas basadas en la frecuencia
    for (let i = 1; i <= 3; i++) {
      const nuevaHoraTotal = hora + frecuenciaHoras * i;
      const nuevaHora = nuevaHoraTotal % 24;
      const nuevaHoraStr = nuevaHora.toString().padStart(2, "0");
      const nuevoMinutoStr = minuto.toString().padStart(2, "0");

      horarios.push(`${nuevaHoraStr}:${nuevoMinutoStr}`);
    }

    return horarios;
  };

  // Formatear hora para mostrar
  const formatTime = (timeString) => {
    if (!timeString) return "No especificado";
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

            {/* Medicamentos con detalles REALES de la API */}
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
                  const duracion = medicamento.duracion;
                  const frecuencia = medicamento.frecuencia;
                  const primeraIngesta = medicamento.primeraIngesta;

                  // Calcular horarios si hay frecuencia y primera ingesta
                  let horariosMostrar = [];
                  if (primeraIngesta && frecuencia) {
                    horariosMostrar = calcularHorariosFrecuencia(
                      primeraIngesta,
                      frecuencia
                    );
                  } else if (frecuencia) {
                    horariosMostrar = [frecuencia];
                  } else if (primeraIngesta) {
                    horariosMostrar = [primeraIngesta];
                  }

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
                      {/* Nombre del medicamento */}
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
                        {medicamento.nombre_medicamento ||
                          "Medicamento no especificado"}
                      </Text>

                      {/* Información del medicamento en columnas */}
                      <View style={styles.medicationInfoContainer}>
                        {/* Dosis */}
                        <View style={styles.detailSection}>
                          <Text style={styles.detailLabel}>Dosis:</Text>
                          <Text style={styles.detailValue}>
                            {medicamento.dosis || "No especificada"}
                          </Text>
                        </View>

                        {/* Duración */}
                        <View style={styles.detailSection}>
                          <Text style={styles.detailLabel}>Duración:</Text>
                          <Text style={styles.detailValue}>
                            {duracion || "No especificada"}
                          </Text>
                        </View>

                        {/* Frecuencia */}
                        {frecuencia && (
                          <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>Frecuencia:</Text>
                            <Text style={styles.detailValue}>
                              {frecuencia}
                            </Text>
                          </View>
                        )}

                        {/* Primera ingesta */}
                        {primeraIngesta && (
                          <View style={styles.detailSection}>
                            <Text style={styles.detailLabel}>Primera toma:</Text>
                            <Text style={styles.detailValue}>
                              {formatTime(primeraIngesta)}
                            </Text>
                          </View>
                        )}
                      </View>

                      {/* Horarios calculados COMPLETOS */}
                      {horariosMostrar.length > 0 && (
                        <View style={styles.horariosSection}>
                          <Text
                            style={[styles.detailLabel, { marginBottom: 10 }]}
                          >
                            Horarios de toma:
                          </Text>
                          <View style={styles.horariosContainer}>
                            {horariosMostrar.map((hora, idx) => (
                              <View
                                key={idx}
                                style={[
                                  styles.horarioTagContainer,
                                  primeraIngesta &&
                                  hora === primeraIngesta
                                    ? styles.horarioPrincipal
                                    : {},
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.horarioTag,
                                    primeraIngesta &&
                                    hora === primeraIngesta
                                      ? styles.horarioPrincipalText
                                      : {},
                                  ]}
                                >
                                  {hora.includes(":")
                                    ? formatTime(hora)
                                    : hora}
                                </Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      )}

                      {/* Instrucciones adicionales */}
                      {medicamento.instrucciones && (
                        <View style={styles.instruccionesSection}>
                          <Text
                            style={[
                              styles.detailLabel,
                              { marginBottom: 8 },
                            ]}
                          >
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
                    No hay medicamentos registrados en esta receta.
                  </Text>
                </View>
              )}
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>

          {/* -------- BOTÓN ABAJO -------- */}
          <View style={{ 
            width: "100%", 
            paddingHorizontal: 20, 
            marginBottom: 20 
          }}>
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
              <Text style={{ 
                color: "#fff", 
                fontSize: 16, 
                fontWeight: "600" 
              }}>
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
