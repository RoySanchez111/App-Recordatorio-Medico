import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { PrescriptionsContext } from "../contexts/AppContext";
import { useDualPress } from "../hooks/useDualPress";
import { ScreenTitle } from "../components/ScreenTitle";
import { styles } from "../styles/styles";

const heartbeatLogo = require("../../assets/heartbeat2.png");

// URL de Lambda
const API_URL =
  "https://a6p5u37ybkzmvauf4lko6j3yda0qgkcb.lambda-url.us-east-1.on.aws/";

export const LoginScreen = ({ navigation }) => {
  const [claveUnica, setClaveUnica] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);

  const { accessibilitySettings, setUser, setPrescriptions } =
    useContext(PrescriptionsContext);

  // Función auxiliar para calcular horarios
  const calcularHorariosFrecuencia = (primeraIngesta, frecuencia) => {
    if (!primeraIngesta || !frecuencia) return [];
    const match = frecuencia.match(/\d+/);
    if (!match) return [primeraIngesta];
    const frecuenciaHoras = parseInt(match[0]);
    const horarios = [primeraIngesta];
    const [hora, minuto] = primeraIngesta.split(":").map(Number);
    for (let i = 1; i <= 3; i++) {
      const nuevaHoraTotal = hora + frecuenciaHoras * i;
      const nuevaHora = nuevaHoraTotal % 24;
      const nuevaHoraStr = nuevaHora.toString().padStart(2, "0");
      const nuevoMinutoStr = minuto.toString().padStart(2, "0");
      horarios.push(`${nuevaHoraStr}:${nuevoMinutoStr}`);
    }
    return horarios;
  };

  const handleLogin = async () => {
    if (!claveUnica || !contrasena) {
      Alert.alert("Error", "Por favor ingresa tu clave única y contraseña");
      return;
    }

    setLoading(true);

    try {
      // 1. LOGIN
      const loginResponse = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          data: {
            claveUnica: claveUnica,
            password: contrasena,
          },
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok && loginData.user && loginData.user.esPaciente) {
        // --- CORRECCIÓN: NO guardamos el usuario todavía ---
        // Esperamos a tener las recetas para guardar todo junto y evitar el parpadeo en MainApp

        let allMeds = [];

        try {
          // 2. PRECARGA DE DATOS
          const recetasResponse = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "getRecipesByPatient",
              data: { pacienteId: loginData.user.id },
            }),
          });

          if (recetasResponse.ok) {
            const recetas = await recetasResponse.json();

            if (Array.isArray(recetas)) {
              recetas.forEach((receta) => {
                if (receta.medicamentos && Array.isArray(receta.medicamentos)) {
                  receta.medicamentos.forEach((med) => {
                    const fechaInicio = new Date(receta.fechaEmision);
                    let diasDuracion = 30;
                    if (med.duracion) {
                      const matchDuracion = med.duracion.match(/\d+/);
                      if (matchDuracion) {
                        diasDuracion = parseInt(matchDuracion[0], 10);
                        if (
                          med.duracion.includes("semanas") ||
                          med.duracion.includes("semana")
                        )
                          diasDuracion *= 7;
                        if (
                          med.duracion.includes("meses") ||
                          med.duracion.includes("mes")
                        )
                          diasDuracion *= 30;
                      }
                    }

                    const fechaFin = new Date(fechaInicio);
                    fechaFin.setDate(fechaInicio.getDate() + diasDuracion);

                    let horariosMostrar = [];
                    if (med.primeraIngesta && med.frecuencia) {
                      horariosMostrar = calcularHorariosFrecuencia(
                        med.primeraIngesta,
                        med.frecuencia
                      );
                    } else if (med.frecuencia) {
                      horariosMostrar = [med.frecuencia];
                    } else if (med.primeraIngesta) {
                      horariosMostrar = [med.primeraIngesta];
                    }

                    allMeds.push({
                      id: med.id || `${receta.id}-${med.nombre_medicamento}`,
                      recetaId: receta.id,
                      nombre: med.nombre_medicamento,
                      dosis: med.dosis,
                      duracion: med.duracion,
                      frecuencia: med.frecuencia,
                      primeraIngesta: med.primeraIngesta,
                      instrucciones: med.instrucciones,
                      cantidadInicial: med.cantidadInicial,
                      inicio: fechaInicio,
                      fin: fechaFin,
                      horarios:
                        horariosMostrar.length > 0
                          ? horariosMostrar
                          : ["Horario no especificado"],
                      stock: med.cantidadInicial || 0,
                      dosisPorToma: 1,
                      esLargoPlazo: diasDuracion > 30,
                      diasDuracion: diasDuracion,
                    });
                  });
                }
              });
            }
          }
        } catch (prefetchError) {
          console.log(
            "Aviso: Precarga fallida (se reintentará en MainApp)",
            prefetchError
          );
        }

        // 3. GUARDADO ATÓMICO
        // Actualizamos Recetas Y Usuario al mismo tiempo.
        // Al hacer esto, cuando MainApp se monte, YA tendrá las recetas listas.
        setPrescriptions(allMeds);
        setUser(loginData.user);

        // Pequeño delay para asegurar que el Contexto se propague antes de cambiar de pantalla
        setTimeout(() => {
          navigation.navigate("MainApp");
        }, 100);
      } else {
        throw new Error(
          loginData.message ||
            "Credenciales incorrectas o usuario no es paciente."
        );
      }
    } catch (err) {
      Alert.alert(
        "Error de Login",
        err.message || "No se pudo conectar al servidor."
      );
    } finally {
      setLoading(false);
    }
  };

  const { isPressing, handlePressIn, handlePressOut } =
    useDualPress(handleLogin);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.loginContainer}>
          <View style={styles.logoSection}>
            <Image
              source={heartbeatLogo}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.loginForm}>
            <ScreenTitle accessibilitySettings={accessibilitySettings}>
              Ingresar a Health Reminder
            </ScreenTitle>

            <Text
              style={[
                styles.label,
                accessibilitySettings.largeFont && { fontSize: 16 },
              ]}
            >
              Clave Única
            </Text>
            <TextInput
              style={[
                styles.textInput,
                accessibilitySettings.largeFont && { fontSize: 18 },
              ]}
              placeholder="Ingresa tu clave única"
              placeholderTextColor="#666"
              value={claveUnica}
              onChangeText={(text) => setClaveUnica(text.toUpperCase())}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Text
              style={[
                styles.label,
                accessibilitySettings.largeFont && { fontSize: 16 },
              ]}
            >
              Contraseña
            </Text>
            <TextInput
              style={[
                styles.textInput,
                accessibilitySettings.largeFont && { fontSize: 18 },
              ]}
              placeholder="Ingresa tu contraseña"
              placeholderTextColor="#666"
              value={contrasena}
              onChangeText={setContrasena}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                (isPressing || loading) && styles.navButtonActive,
              ]}
              onPress={handleLogin}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    accessibilitySettings.largeFont && { fontSize: 18 },
                  ]}
                >
                  {isPressing ? "Mantén..." : "Ingresar"}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};
