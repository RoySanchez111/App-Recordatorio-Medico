import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { PrescriptionsContext } from "../contexts/AppContext";
import { useDualPress } from "../hooks/useDualPress";
import { ScreenTitle } from "../components/ScreenTitle";
import { BottomNav } from "../components/BottomNav";
// import { PickerField } from '../components/PickerField'; // YA NO LO NECESITAMOS PARA ESTO
import { calculateAge } from "../utils/dateUtils";
import { styles } from "../styles/styles";

// Tu URL de Lambda Corregida
const API_URL =
  "https://a6p5u37ybkzmvauf4lko6j3yda0qgkcb.lambda-url.us-east-1.on.aws/";

export const RequestAppointmentScreen = ({ navigation }) => {
  const [fechaConsulta, setFechaConsulta] = useState(new Date());
  const [motivoConsulta, setMotivoConsulta] = useState("");
  const [sintomas, setSintomas] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const { accessibilitySettings, user } = useContext(PrescriptionsContext);

  const handleSubmitConsulta = async () => {
    if (!motivoConsulta || !prioridad) {
      Alert.alert(
        "Campos incompletos",
        "Por favor describe el motivo y la prioridad."
      );
      return;
    }

    if (!user || !user.id) {
      Alert.alert(
        "Error de Sesión",
        "No se pudo identificar al paciente. Por favor, inicia sesión de nuevo."
      );
      return;
    }

    if (!user.id_doctor) {
      Alert.alert(
        "Error",
        "Tu cuenta no tiene un médico asignado correctamente. Contacta a soporte."
      );
      return;
    }

    setLoading(true);

    const edadCalculada = user.fechaNacimiento
      ? calculateAge(user.fechaNacimiento)
      : "N/A";

    const payload = {
      id_paciente: user.id,
      pacienteNombre: user.nombreCompleto,
      edad: edadCalculada,
      telefono: user.telefono || "N/A",
      id_doctor: user.id_doctor,
      fecha: fechaConsulta.toISOString(),
      motivo: motivoConsulta,
      sintomas: sintomas,
      status: "pendiente",
      prioridad: prioridad,
      fechaCreacion: new Date().toISOString(),
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createConsulta",
          data: payload,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert(
          "Solicitud Enviada",
          "Tu doctor ha recibido la solicitud de consulta.",
          [{ text: "OK", onPress: () => navigation.navigate("MainApp") }]
        );
        setMotivoConsulta("");
        setSintomas("");
        setPrioridad("");
      } else {
        throw new Error(result.message || "Error al solicitar consulta");
      }
    } catch (err) {
      console.error("Error creando consulta:", err);
      Alert.alert(
        "Error",
        "No se pudo conectar al servidor. Intente más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const {
    isPressing: submitPressing,
    handlePressIn: submitPressIn,
    handlePressOut: submitPressOut,
  } = useDualPress(handleSubmitConsulta, () =>
    console.log("Long press submit")
  );

  const handleStatusClick = async () => {
    navigation.navigate("AppointmentStatusScreen");
  };

  // Logic for status button
  const {
    isPressing: statusPressing,
    handlePressIn: statusPressIn,
    handlePressOut: statusPressOut,
  } = useDualPress(handleStatusClick, () => console.log("Long press status"));

  const onDateChange = (_, selectedDate) => {
    setShowDatePicker(false);
    selectedDate && setFechaConsulta(selectedDate);
  };

  const formatDate = (date) =>
    date.toISOString().split("T")[0].replace(/-/g, "/");

  // Componente interno para los botones de prioridad (Estilo Chips)
  const PriorityButton = ({ label, value, color, isSelected, onPress }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 5,
        marginHorizontal: 4,
        borderRadius: 8,
        backgroundColor: isSelected ? color : "#f0f0f0",
        borderWidth: 1,
        borderColor: isSelected ? color : "#ddd",
        alignItems: "center",
        opacity: pressed ? 0.7 : 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: isSelected ? 0.2 : 0,
        shadowRadius: 1.41,
        elevation: isSelected ? 2 : 0,
      })}
    >
      <Text
        style={{
          color: isSelected ? "white" : "#555",
          fontWeight: isSelected ? "bold" : "normal",
          fontSize: accessibilitySettings.largeFont ? 16 : 14,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.requestContainer}>
          <ScrollView contentContainerStyle={styles.requestScrollContent}>
            <View style={styles.invisiblePadding} />

            <View style={styles.requestForm}>
              <ScreenTitle accessibilitySettings={accessibilitySettings}>
                Solicitar Consulta
              </ScreenTitle>

              {/* CAMPO FECHA */}
              <Text
                style={[
                  styles.label,
                  accessibilitySettings.largeFont && { fontSize: 16 },
                ]}
              >
                Fecha deseada
              </Text>
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.dateInputText,
                    accessibilitySettings.largeFont && { fontSize: 18 },
                  ]}
                >
                  {formatDate(fechaConsulta)}
                </Text>
                <Ionicons name="calendar" size={20} color="#666" />
              </Pressable>

              {showDatePicker && (
                <DateTimePicker
                  value={fechaConsulta}
                  mode="date"
                  display="default"
                  minimumDate={new Date()}
                  onChange={onDateChange}
                />
              )}

              {/* CAMPO MOTIVO */}
              <Text
                style={[
                  styles.label,
                  accessibilitySettings.largeFont && { fontSize: 16 },
                ]}
              >
                Motivo de la Consulta *
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  styles.multilineInput,
                  accessibilitySettings.largeFont && { fontSize: 18 },
                ]}
                placeholder="Ej. Dolor de cabeza persistente..."
                placeholderTextColor="#666"
                value={motivoConsulta}
                onChangeText={setMotivoConsulta}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!loading}
              />

              {/* CAMPO SÍNTOMAS */}
              <Text
                style={[
                  styles.label,
                  accessibilitySettings.largeFont && { fontSize: 16 },
                ]}
              >
                Síntomas (opcional)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  styles.multilineInput,
                  accessibilitySettings.largeFont && { fontSize: 18 },
                ]}
                placeholder="Describe tus síntomas detalladamente"
                placeholderTextColor="#666"
                value={sintomas}
                onChangeText={setSintomas}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!loading}
              />

              {/* SELECCIÓN DE PRIORIDAD - CORREGIDO PARA IOS/ANDROID */}
              <Text
                style={[
                  styles.label,
                  accessibilitySettings.largeFont && { fontSize: 16 },
                ]}
              >
                Nivel de prioridad *
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 5,
                  marginBottom: 20,
                }}
              >
                <PriorityButton
                  label="Baja"
                  value="baja"
                  color="#27ae60" // Verde
                  isSelected={prioridad === "baja"}
                  onPress={() => setPrioridad("baja")}
                />
                <PriorityButton
                  label="Media"
                  value="media"
                  color="#f39c12" // Naranja
                  isSelected={prioridad === "media"}
                  onPress={() => setPrioridad("media")}
                />
                <PriorityButton
                  label="Alta"
                  value="alta"
                  color="#c0392b" // Rojo
                  isSelected={prioridad === "alta"}
                  onPress={() => setPrioridad("alta")}
                />
              </View>

              {/* BOTÓN ENVIAR CON DELAY */}
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                  (submitPressing || loading) && styles.navButtonActive,
                  { marginTop: 10 },
                ]}
                onPressIn={submitPressIn}
                onPressOut={submitPressOut}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.buttonText,
                    accessibilitySettings.largeFont && { fontSize: 18 },
                  ]}
                >
                  {loading
                    ? "Enviando..."
                    : submitPressing
                    ? "Confirmando..."
                    : "Solicitar Cita"}
                </Text>
              </Pressable>
              {/* BOTÓN PARA EL ESTATUS DE LAS CITAS */}
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                  (statusPressing || loading) && styles.navButtonActive,
                  { marginTop: 40 },
                ]}
                onPressIn={statusPressIn}
                onPressOut={statusPressOut}
                disabled={loading}
              >
                <Text
                  style={[
                    styles.buttonText,
                    accessibilitySettings.largeFont && { fontSize: 14 },
                  ]}
                >
                  {loading
                    ? "Consultando..."
                    : statusPressing
                    ? "Confirmando..."
                    : "Status de Mis Citas"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.extraBottomPadding} />
          </ScrollView>

          <BottomNav
            navigation={navigation}
            accessibilitySettings={accessibilitySettings}
            active="request"
          />
        </View>
      </View>
    </View>
  );
};
