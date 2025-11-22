import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  // Removed unused imports: TextInput, ScrollView, Alert
  Alert,
} from "react-native";
import { useDualPress } from "../hooks/useDualPress";
import { PrescriptionsContext } from "../contexts/AppContext";
import { speakIfEnabled } from "../utils/speech";
import { styles } from "../styles/styles";

// URL Lambda (Kept outside as a constant)
const API_URL =
  "https://a6p5u37ybkzmvauf4lko6j3yda0qgkcb.lambda-url.us-east-1.on.aws/";

export const AppointmentStatusScreen = ({ navigation }) => {
  // ✅ FIX: The state is now correctly inside the functional component.
  const [consulta, setConsulta] = useState(null);

  const { accessibilitySettings, user } = useContext(PrescriptionsContext);
  const BackClick = useDualPress(() => {
    speakIfEnabled(accessibilitySettings, "Regresar pagina");
    navigation.navigate("RequestAppointment");
  });

  useEffect(() => {
    const fetchConsulta = async () => {
      if (!user || !user.id) return;

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // ACTION confirmed as "getConsultasByPatient"
            action: "getConsultasByPatient",
            data: {
              pacienteId: user.id, // Parameter confirmed as 'pacienteId'
            },
          }),
        });

        const data = await response.json();

        if (response.ok && Array.isArray(data) && data.length > 0) {
          // Tomamos la más reciente
          const sorted = data.sort(
            (a, b) => new Date(b.fecha) - new Date(a.fecha)
          );
          setConsulta(sorted[0]);
        } else {
          setConsulta(null);
        }
      } catch (err) {
        console.error("Error cargando consulta:", err);
        Alert.alert("Error", "No se pudieron cargar las citas.");
      }
    };

    fetchConsulta();
  }, [user]);

  return (
    <View style={styles.screenContainerStatus}>
      <View style={styles.contentFrameStatus}>
        <View style={styles.containerStatus}>
          <Text
            style={[
              styles.header,
              { fontWeight: "bold" },
              { marginBottom: 30 },
              { fontSize: 25 },
            ]}
          >
            Estado de su Última Cita
          </Text>

          {consulta ? (
            <View style={styles.card}>
              {/* 1. Fecha de la Cita */}
              <Text style={styles.text}>
                {/* Bold Label */}
                <Text style={{ fontWeight: "bold" }}>Fecha de la Cita: </Text>
                {/* Normal Value */}
                {new Date(consulta.fecha).toLocaleDateString()}
              </Text>

              {/* 2. Hora */}
              <Text style={styles.text}>
                {/* Bold Label */}
                <Text style={{ fontWeight: "bold" }}>Hora: </Text>
                {/* Normal Value */}
                {consulta.hora}
              </Text>

              {/* 3. Estado Actual */}
              <Text style={styles.text}>
                {/* Bold Label */}
                <Text style={{ fontWeight: "bold" }}>Estado Actual: </Text>
                {/* Normal Value */}
                {consulta.status || "Pendiente"}
              </Text>
            </View>
          ) : (
            <Text style={styles.text}>
              No se encontró ninguna cita reciente para su usuario.
            </Text>
          )}

          {/* BOTÓN PARA REGRESAR */}
          <Pressable
            style={styles.button}
            onPress={BackClick.handleQuickPress}
            onPressIn={BackClick.handlePressIn}
            onPressOut={BackClick.handlePressOut}
          >
            <Text
              style={[
                styles.buttonText,
                accessibilitySettings.largeFont && { fontSize: 14 },
              ]}
            >
              Regresar
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
