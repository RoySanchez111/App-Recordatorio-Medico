import { StatusBar } from 'expo-status-bar';
// --- ¡CORREGIDO! ---
// Añadimos 'useEffect' a la importación
import React, { useState, useRef, createContext, useContext, useEffect } from 'react'; 
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  TextInput,
  Image,
  Vibration,
  Linking,
  Alert // <-- AÑADIDO: Usaremos Alert en lugar de alert
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Speech from 'expo-speech';
import { Picker } from '@react-native-picker/picker';

const Stack = createStackNavigator();
const PrescriptionsContext = createContext();
const heartbeatLogo = require('./assets/heartbeat_logo.png');

// <-- AÑADIDO: Tu URL de API (¡Asegúrate de que sea la correcta!)
const API_URL = "https://a6p5u37ybkzmvauf4lko6j3yda0qgkcb.lambda-url.us-east-1.on.aws/";

/* ===================== HELPERS REUTILIZABLES ===================== */

// Hook dual: tap rápido + mantener presionado
const useDualPress = (onQuickPress, onLongPress, longPressDuration = 5000, vibrationDuration = 500) => {
  const [isPressing, setIsPressing] = useState(false);
  const pressTimer = useRef(null);

  const handlePressIn = () => {
    setIsPressing(true);
    pressTimer.current = setTimeout(() => {
      Vibration.vibrate(vibrationDuration);
      setIsPressing(false);
      onLongPress && onLongPress();
    }, longPressDuration);
  };

  const handlePressOut = () => {
    setIsPressing(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleQuickPress = () => onQuickPress && onQuickPress();

  return { isPressing, handlePressIn, handlePressOut, handleQuickPress };
};

// Lectura en voz alta centralizada
const speakIfEnabled = (accessibilitySettings, text) => {
  if (accessibilitySettings?.ttsEnabled && text) {
    Speech.stop();
    Speech.speak(text, { language: 'es-MX', rate: 1.0 });
  }
};

// Título de sección reutilizable
const ScreenTitle = ({ children, accessibilitySettings }) => (
  <Text
    style={[
      styles.sectionTitle,
      accessibilitySettings.largeFont && styles.sectionTitleLarge,
    ]}
  >
    {children}
  </Text>
);

// Barra de navegación inferior reutilizable
const BottomNav = ({ navigation, accessibilitySettings, active }) => {
  const navCalendar = useDualPress(() => {
    speakIfEnabled(accessibilitySettings, 'Calendario Health');
    navigation.navigate('MainApp');
  });
  const navRequest = useDualPress(() => {
    speakIfEnabled(accessibilitySettings, 'Solicitar consulta');
    navigation.navigate('RequestAppointment');
  });
  const navPrescription = useDualPress(() => {
    speakIfEnabled(accessibilitySettings, 'Receta');
    navigation.navigate('Prescription');
  });
  const navProfile = useDualPress(() => {
    speakIfEnabled(accessibilitySettings, 'Perfil');
    navigation.navigate('Profile');
  });

  const iconColor = (tab) => (active === tab ? '#007AFF' : '#666');

  const textStyle = (tab) => [
    styles.navText,
    active === tab && styles.activeNavText,
    accessibilitySettings.largeFont && { fontSize: 12 },
  ];

  return (
    <View style={styles.bottomNavigation}>
      <Pressable
        style={styles.navItem}
        onPress={navCalendar.handleQuickPress}
        onPressIn={navCalendar.handlePressIn}
        onPressOut={navCalendar.handlePressOut}
      >
        <Ionicons name="calendar" size={24} color={iconColor('calendar')} />
        <Text style={textStyle('calendar')}>Calendario{'\n'}Health</Text>
      </Pressable>

      <Pressable
        style={styles.navItem}
        onPress={navRequest.handleQuickPress}
        onPressIn={navRequest.handlePressIn}
        onPressOut={navRequest.handlePressOut}
      >
        <Ionicons name="add-circle" size={24} color={iconColor('request')} />
        <Text style={textStyle('request')}>Solicitar{'\n'}Consulta</Text>
      </Pressable>

      <Pressable
        style={styles.navItem}
        onPress={navPrescription.handleQuickPress}
        onPressIn={navPrescription.handlePressIn}
        onPressOut={navPrescription.handlePressOut}
      >
        <Ionicons name="document-text" size={24} color={iconColor('prescription')} />
        <Text style={textStyle('prescription')}>Receta</Text>
      </Pressable>

      <Pressable
        style={styles.navItem}
        onPress={navProfile.handleQuickPress}
        onPressIn={navProfile.handlePressIn}
        onPressOut={navProfile.handlePressOut}
      >
        <Ionicons name="person" size={24} color={iconColor('profile')} />
        <Text style={textStyle('profile')}>Perfil</Text>
      </Pressable>
    </View>
  );
};

// Selector reutilizable (Picker con contenedor)
const PickerField = ({ value, onChange, items, accessibilitySettings }) => (
  <View style={styles.pickerContainer}>
    <Picker
      selectedValue={value}
      onValueChange={onChange}
      style={[styles.picker, accessibilitySettings.largeFont && { fontSize: 18 }]}
      itemStyle={accessibilitySettings.largeFont ? { fontSize: 18 } : {}}
    >
      {items.map((item) => (
        <Picker.Item key={item.value} label={item.label} value={item.value} />
      ))}
    </Picker>
  </View>
);

/* ===================== PANTALLAS ===================== */

// Home (Sin cambios)
function HomeScreen({ navigation }) {
  const emergencyNumber = '911';
  const { accessibilitySettings } = useContext(PrescriptionsContext);

  const { isPressing, handlePressIn, handlePressOut, handleQuickPress } = useDualPress(
    () => navigation.navigate('Login'),
    () => Linking.openURL(`tel:${emergencyNumber}`),
    5000,
    1000
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.homeContainer}>
          <View style={styles.homeLogoSection}>
            <Image source={heartbeatLogo} style={styles.homeLogoImage} resizeMode="contain" />
          </View>

          <Text
            style={[
              styles.homeTitle,
              accessibilitySettings.largeFont && { fontSize: 28 },
            ]}
          >
            Bienvenido a Health Reminder
          </Text>

          <Text
            style={[
              styles.instructionText,
              accessibilitySettings.largeFont && { fontSize: 16 },
            ]}
          >
            {isPressing
              ? 'Sigue presionando para llamada de emergencia...'
              : 'Toca para iniciar • Mantén 5s para llamada de emergencia'}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              pressed && styles.navButtonPressed,
              isPressing && styles.navButtonActive,
            ]}
            onPress={handleQuickPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <Text
              style={[
                styles.buttonText,
                accessibilitySettings.largeFont && { fontSize: 18 },
              ]}
            >
              {isPressing ? 'Suelta para cancelar vibración' : 'Iniciar Health Reminder'}
            </Text>
          </Pressable>

          <StatusBar style="auto" />
        </View>
      </View>
    </View>
  );
}

// --- Login (MODIFICADO PARA CONECTAR A API) ---
function LoginScreen({ navigation }) {
  const [claveUnica, setClaveUnica] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [loading, setLoading] = useState(false);
  const { accessibilitySettings, setUser } = useContext(PrescriptionsContext);

  const handleLogin = async () => {
    if (!claveUnica || !contrasena) {
      Alert.alert('Error', 'Por favor ingresa tu clave única y contraseña');
      return;
    }
    
    setLoading(true);

    const payload = {
      action: "login",
      data: {
        claveUnica: claveUnica,
        password: contrasena // Usamos 'password' (sin ñ)
      }
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }
      
      if (data.user && data.user.esPaciente) {
        Alert.alert('Ingreso exitoso', `Bienvenido(a) ${data.user.nombreCompleto}`);
        setUser(data.user); // Guardamos el usuario en el Contexto
        navigation.navigate('MainApp'); 
      } else {
        throw new Error("Este usuario no es un paciente.");
      }

    } catch (err) {
      Alert.alert('Error de Login', err.message || 'No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  const { isPressing, handlePressIn, handlePressOut } = useDualPress(
    handleLogin, 
    () => Vibration.vibrate(500) 
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.loginContainer}>
          <View style={styles.logoSection}>
            <Image source={heartbeatLogo} style={styles.logoImage} resizeMode="contain" />
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
              onChangeText={setClaveUnica}
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
              <Text
                style={[
                  styles.buttonText,
                  accessibilitySettings.largeFont && { fontSize: 18 },
                ]}
              >
                {loading ? 'Ingresando...' : (isPressing ? 'Mantén...' : 'Ingresar')}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

// Pantalla principal (calendario + meds)
function MainAppScreen({ navigation }) {
  const { prescriptions, accessibilitySettings } = useContext(PrescriptionsContext);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

  const formatDate = (date) => date.toISOString().slice(0, 10);

  const getMedsForDate = (date) => {
    const d = formatDate(date);
    return prescriptions.filter((med) => {
      if (!med.inicio || !med.fin) return false;
      const inicio = formatDate(new Date(med.inicio));
      const fin = formatDate(new Date(med.fin));
      return d >= inicio && d <= fin;
    });
  };

  const getFiveDayWindow = (centerDate) => {
    const days = [];
    for (let offset = -2; offset <= 2; offset++) {
      const d = new Date(centerDate);
      d.setDate(centerDate.getDate() + offset);
      days.push(d);
    }
    return days;
  };

  const getLowStockMeds = () =>
    prescriptions.filter((med) => {
      if (!med.esLargoPlazo) return false;
      const dosisPorDia = (med.horarios?.length || 0) * (med.dosisPorToma || 1);
      if (!dosisPorDia) return false;
      const diasRestantes = med.stock / dosisPorDia;
      return diasRestantes <= 3;
    });

  const getMedColorStyle = (nombre) => {
    if (!nombre) return null;
    const n = nombre.toLowerCase();
    if (n.includes('paracetamol')) return styles.paracetamol;
    if (n.includes('ibuprofeno')) return styles.ibuprofeno;
    if (n.includes('naproxeno')) return styles.naproxeno;
    if (n.includes('tempra')) return styles.tempra;
    return null;
  };

  const lowStock = getLowStockMeds();
  const windowDays = getFiveDayWindow(currentDate);

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <ScrollView style={styles.scrollContent}>
            <View style={styles.invisiblePadding} />

            {lowStock.length > 0 && (
              <View style={styles.alertBox}>
                <Text
                  style={[
                    styles.alertTitle,
                    accessibilitySettings.largeFont && { fontSize: 16 },
                  ]}
                >
                  Atención
                </Text>
                {lowStock.map((med) => (
                  <Text
                    key={med.id}
                    style={[
                      styles.alertText,
                      accessibilitySettings.largeFont && { fontSize: 14 },
                    ]}
                  >
                    Quedan pocas dosis de {med.nombre}. Revisa tu receta.
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <ScreenTitle accessibilitySettings={accessibilitySettings}>
                Calendario Health Reminder
              </ScreenTitle>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fiveDayStrip}>
                {windowDays.map((dateObj) => {
                  const isSelected = formatDate(dateObj) === formatDate(selectedDate);
                  const medsThatDay = getMedsForDate(dateObj);
                  const hasMeds = medsThatDay.length > 0;

                  return (
                    <Pressable
                      key={formatDate(dateObj)}
                      style={[styles.dayChip, isSelected && styles.dayChipSelected]}
                      onPress={() => {
                        setCurrentDate(dateObj);
                        setSelectedDate(dateObj);
                      }}
                    >
                      <Text
                        style={[
                          styles.dayChipDow,
                          accessibilitySettings.largeFont && { fontSize: 13 },
                        ]}
                      >
                        {weekDays[dateObj.getDay()]}
                      </Text>
                      <Text
                        style={[
                          styles.dayChipNumber,
                          accessibilitySettings.largeFont && { fontSize: 20 },
                        ]}
                      >
                        {dateObj.getDate()}
                      </Text>

                      {hasMeds && (
                        <View style={styles.calendarDotRow}>
                          {medsThatDay.map((med) => (
                            <Text
                              key={med.id}
                              style={[styles.calendarDot, getMedColorStyle(med.nombre)]}
                            >
                              ●
                            </Text>
                          ))}
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <View style={styles.todayHeader}>
                <Text style={styles.todayBullet}>●</Text>
                <Text
                  style={[
                    styles.todayTitle,
                    accessibilitySettings.largeFont && styles.sectionTitleLarge,
                  ]}
                >
                  Medicamentos para {selectedDate.toLocaleDateString()}
                </Text>
              </View>

              <Text
                style={[
                  styles.todaySubtitle,
                  accessibilitySettings.largeFont && { fontSize: 16 },
                ]}
              >
                Recordatorios de medicamentos y horarios
              </Text>

              <View style={styles.medicationList}>
                {getMedsForDate(selectedDate).map((med) => (
                  <View key={med.id} style={styles.medicationItem}>
                    <Text
                      style={[
                        styles.medicationName,
                        getMedColorStyle(med.nombre),
                        accessibilitySettings.largeFont && { fontSize: 16 },
                      ]}
                    >
                      {med.nombre}
                    </Text>
                    <Text
                      style={[
                        styles.medicationTime,
                        accessibilitySettings.largeFont && { fontSize: 16 },
                      ]}
                    >
                      {med.horarios?.join(' · ')}
                    </Text>
                  </View>
                ))}

                {getMedsForDate(selectedDate).length === 0 && (
                  <Text
                    style={[
                      styles.emptyText,
                      accessibilitySettings.largeFont && { fontSize: 16 },
                    ]}
                  >
                    No hay medicamentos para este día.
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.extraBottomPadding} />
          </ScrollView>

          <BottomNav
            navigation={navigation}
            accessibilitySettings={accessibilitySettings}
            active="calendar"
          />
        </View>
      </View>
    </View>
  );
}

// --- Solicitar consulta (MODIFICADO PARA CONECTAR A API) ---
function RequestAppointmentScreen({ navigation }) {
  const [fechaConsulta, setFechaConsulta] = useState(new Date());
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [sintomas, setSintomas] = useState(''); // <-- AÑADIDO: Campo de Síntomas
  const [prioridad, setPrioridad] = useState('');
  const [doctor, setDoctor] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false); 

  const { accessibilitySettings, user } = useContext(PrescriptionsContext);

  const handleSubmitConsulta = async () => {
    if (!motivoConsulta || !prioridad || !doctor ) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos');
      return;
    }
    
    if (!user || !user.id) {
      Alert.alert('Error de Sesión', 'No se pudo identificar al paciente. Por favor, inicia sesión de nuevo.');
      navigation.navigate('Login');
      return;
    }
    
    setLoading(true);

    // TODO: La lista de doctores debería cargarse desde la API.
    // Usaremos el Doctor de prueba que tenemos en la DB (ID "2").
    const doctorData = {
        id: "2", // ID del Dr. Doctor
        nombre: "Doctor" // Nombre del Dr. Doctor
    };

    // --- AÑADIDO: Calcular edad del paciente ---
    let edadCalculada = 25; // Default
    if (user.fechaNacimiento) {
        try {
            const hoy = new Date();
            const fechaNac = new Date(user.fechaNacimiento);
            let edad = hoy.getFullYear() - fechaNac.getFullYear();
            const m = hoy.getMonth() - fechaNac.getMonth();
            if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
                edad--;
            }
            edadCalculada = edad;
        } catch(e) { console.error("Error calculando edad"); }
    }

    const payload = {
      action: "createConsulta",
      data: {
        id_paciente: user.id,
        pacienteNombre: user.nombreCompleto,
        edad: edadCalculada, 
        telefono: user.telefono || 'N/A',
        id_doctor: doctorData.id,
        doctorNombre: doctorData.nombre,
        especialidad: "General", // TODO
        fecha: fechaConsulta.toISOString(),
        motivo: motivoConsulta,
        sintomas: sintomas,
        status: "pendiente",
        prioridad: prioridad
      }
    };

    try {
      const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) {
          throw new Error(data.message || 'Error al crear la consulta');
      }

      Alert.alert('Éxito', 'Consulta solicitada exitosamente');
      navigation.navigate('MainApp');

    } catch (err) {
      Alert.alert('Error', err.message || 'No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  const { isPressing: submitPressing, handlePressIn: submitPressIn, handlePressOut: submitPressOut } =
    useDualPress(
      handleSubmitConsulta, 
      () => Vibration.vibrate(500)
    );

  const onDateChange = (_, selectedDate) => {
    setShowDatePicker(false);
    selectedDate && setFechaConsulta(selectedDate);
  };

  const formatDate = (date) => date.toISOString().split('T')[0].replace(/-/g, '/');

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.requestContainer}>
          <ScrollView contentContainerStyle={styles.requestScrollContent}>
            <View style={styles.invisiblePadding} />

            <View style={styles.requestForm}>
              <ScreenTitle accessibilitySettings={accessibilitySettings}>
                Solicitar Consulta - Health Reminder
              </ScreenTitle>

              <Text
                style={[
                  styles.label,
                  accessibilitySettings.largeFont && { fontSize: 16 },
                ]}
              >
                Fecha de la consulta
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
                  onChange={onDateChange}
                />
              )}

              <Text
                style={[
                  styles.label,
                  accessibilitySettings.largeFont && { fontSize: 16 },
                ]}
              >
                Motivo de la Consulta
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  styles.multilineInput,
                  accessibilitySettings.largeFont && { fontSize: 18 },
                ]}
                placeholder="Describe el motivo de tu consulta"
                placeholderTextColor="#666"
                value={motivoConsulta}
                onChangeText={setMotivoConsulta}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!loading}
              />

              {/* <-- AÑADIDO: Campo de Síntomas --> */}
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
                placeholder="Describe tus síntomas"
                placeholderTextColor="#666"
                value={sintomas}
                onChangeText={setSintomas}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!loading}
              />
              
              <Text
                style={[
                  styles.label,
                  accessibilitySettings.largeFont && { fontSize: 16 },
                ]}
              >
                Nivel de prioridad
              </Text>
              <PickerField
                value={prioridad}
                onChange={setPrioridad}
                accessibilitySettings={accessibilitySettings}
                items={[
                  { label: 'Elige una opción', value: '' },
                  { label: 'Baja', value: 'baja' },
                  { label: 'Media', value: 'media' },
                  { label: 'Alta', value: 'alta' },
                ]}
              />

              <Text
                style={[
                  styles.label,
                  accessibilitySettings.largeFont && { fontSize: 16 },
                ]}
              >
                Nombre del Doctor Encargado
              </Text>
              <PickerField
                value={doctor}
                onChange={setDoctor}
                accessibilitySettings={accessibilitySettings}
                items={[
                  // TODO: Cargar esta lista desde la API
                  { label: 'Elija una opción', value: '' },
                  { label: 'Doctor (Prueba)', value: 'medico1' },
                ]}
              />

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                  (submitPressing || loading) && styles.navButtonActive,
                ]}
                onPress={handleSubmitConsulta}
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
                  {loading ? 'Enviando...' : (submitPressing ? 'Mantén...' : 'Solicitar')}
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
}

// --- Receta (MODIFICADO PARA CONECTAR A API) ---
function PrescriptionScreen({ navigation }) {
  const { accessibilitySettings, user } = useContext(PrescriptionsContext); 
  
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.id) {
        setError("No se pudo identificar al paciente. Inicia sesión.");
        setLoading(false);
        return;
    }
    
    const fetchRecetas = async () => {
        setLoading(true);
        setError(null);
        try {
            const payload = {
                action: "getRecipesByPatient",
                data: { pacienteId: user.id }
            };
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Error al cargar recetas');
            }
            setRecetas(data.sort((a, b) => new Date(b.fechaEmision) - new Date(a.fechaEmision)));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    fetchRecetas();
  }, [user]); 


  const card1 = useDualPress();
  const card2 = useDualPress();
  const card3 = useDualPress();
  const card4 = useDualPress();

  if (loading) {
      return (
          <View style={styles.screenContainer}>
              <View style={styles.contentFrame}>
                  <View style={styles.container}>
                      <ScreenTitle accessibilitySettings={accessibilitySettings}>Receta</ScreenTitle>
                      <Text style={{textAlign: 'center', padding: 20}}>Cargando tus recetas...</Text>
                      <BottomNav navigation={navigation} accessibilitySettings={accessibilitySettings} active="prescription" />
                  </View>
              </View>
          </View>
      );
  }
  
  if (error) {
      return (
          <View style={styles.screenContainer}>
              <View style={styles.contentFrame}>
                  <View style={styles.container}>
                      {/* --- ¡ESTA ES LA LÍNEA CORREGIDA! --- */}
                      <ScreenTitle accessibilitySettings={accessibilitySettings}>Receta</ScreenTitle>
                      <Text style={{textAlign: 'center', padding: 20, color: 'red'}}>Error: {error}</Text>
                      <BottomNav navigation={navigation} accessibilitySettings={accessibilitySettings} active="prescription" />
                  </View>
              </View>
          </View>
      );
  }
  
  if (recetas.length === 0) {
      return (
          <View style={styles.screenContainer}>
              <View style={styles.contentFrame}>
                  <View style={styles.container}>
                      <ScrollView contentContainerStyle={styles.prescriptionScrollContent}>
                          <View style={styles.invisiblePadding} />
                          <View style={styles.prescriptionContainer}>
                              <ScreenTitle accessibilitySettings={accessibilitySettings}>Receta - Health Reminder</ScreenTitle>
                              <Text style={{textAlign: 'center', padding: 20, fontSize: 16, color: '#666'}}>
                                  No tienes recetas activas en este momento.
                              </Text>
                          </View>
                          <View style={styles.extraBottomPadding} />
                      </ScrollView>
                      <BottomNav navigation={navigation} accessibilitySettings={accessibilitySettings} active="prescription" />
                  </View>
              </View>
          </View>
      );
  }
  
  const recetaMasReciente = recetas[0]; // El array ya está ordenado

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.prescriptionScrollContent}>
            <View style={styles.invisiblePadding} />

            <View style={styles.prescriptionContainer}>
              <ScreenTitle accessibilitySettings={accessibilitySettings}>
                Receta - Health Reminder
              </ScreenTitle>
              <Text style={{textAlign: 'center', color: '#666', marginBottom: 15, fontSize: 12}}>
                  Mostrando tu receta más reciente.
              </Text>
              
              <Pressable
                style={styles.infoCard}
                onPressIn={card1.handlePressIn}
                onPressOut={card1.handlePressOut}
              >
                <Text
                  style={[
                    styles.cardTitle,
                    accessibilitySettings.largeFont && { fontSize: 18 },
                  ]}
                >
                  Fecha de Emisión
                </Text>
                <Text
                  style={[
                    styles.cardContent,
                    accessibilitySettings.largeFont && { fontSize: 16 },
                  ]}
                >
                  {new Date(recetaMasReciente.fechaEmision).toLocaleDateString('es-ES', { timeZone: 'UTC' })}
                </Text>
              </Pressable>

              <Pressable
                style={styles.infoCard}
                onPressIn={card2.handlePressIn}
                onPressOut={card2.handlePressOut}
              >
                <Text
                  style={[
                    styles.cardTitle,
                    accessibilitySettings.largeFont && { fontSize: 18 },
                  ]}
                >
                  Diagnóstico
                </Text>
                <Text
                  style={[
                    styles.cardContent,
                    accessibilitySettings.largeFont && { fontSize: 16 },
                  ]}
                >
                  {recetaMasReciente.diagnostico}
                </Text>
              </Pressable>

              <Pressable
                style={styles.infoCard}
                onPressIn={card3.handlePressIn}
                onPressOut={card3.handlePressOut}
              >
                <Text
                  style={[
                    styles.cardTitle,
                    accessibilitySettings.largeFont && { fontSize: 18 },
                  ]}
                >
                  Observación
                </Text>
                <Text
                  style={[
                    styles.cardContent,
                    accessibilitySettings.largeFont && { fontSize: 16 },
                  ]}
                >
                  {recetaMasReciente.observaciones || 'Sin observaciones.'}
                </Text>
              </Pressable>

              <Pressable
                style={styles.infoCard}
                onPressIn={card4.handlePressIn}
                onPressOut={card4.handlePressOut}
              >
                <Text
                  style={[
                    styles.cardTitle,
                    accessibilitySettings.largeFont && { fontSize: 18 },
                  ]}
                >
                  Medicamentos
                </Text>

                {recetaMasReciente.medicamentos.map((med) => (
                  <View key={med.id} style={styles.medicationItemPrescription}>
                    <Text
                      style={[
                        styles.medicationName,
                        getMedColorStyle(med.nombre_medicamento),
                        accessibilitySettings.largeFont && { fontSize: 16 },
                      ]}
                    >
                      {med.nombre_medicamento}
                    </Text>
                    <Text
                      style={[
                        styles.medicationDosage,
                        accessibilitySettings.largeFont && { fontSize: 14 },
                      ]}
                    >
                      {med.dosis} • cada {med.frecuencia} horas • {med.duracion}
                    </Text>
                  </View>
                ))}
                
              </Pressable>
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

// --- Perfil (MODIFICADO PARA CONECTAR A API) ---
function ProfileScreen({ navigation }) {
  const { accessibilitySettings, setAccessibilitySettings, user, setUser } = useContext(PrescriptionsContext);

  const toggleLargeFont = () =>
    setAccessibilitySettings((prev) => ({ ...prev, largeFont: !prev.largeFont }));

  const toggleTts = () =>
    setAccessibilitySettings((prev) => ({ ...prev, ttsEnabled: !prev.ttsEnabled }));

  const changePassword = useDualPress(() => {
    speakIfEnabled(accessibilitySettings, 'Cambiar contraseña');
    navigation.navigate('ChangePassword');
  });

  const logout = useDualPress(() => {
    speakIfEnabled(accessibilitySettings, 'Cerrar sesión');
    Alert.alert('Sesión cerrada', 'Sesión cerrada exitosamente');
    setUser(null); // Limpiamos el usuario
    navigation.navigate('Login');
  });

  const photo = useDualPress();
  const personalInfo = useDualPress();
  const medicalInfo = useDualPress();

  if (!user) {
      return (
        <View style={styles.screenContainer}>
            <View style={styles.contentFrame}>
                <View style={styles.container}>
                    <Text style={{textAlign: 'center', padding: 20}}>Cargando perfil...</Text>
                    <BottomNav
                        navigation={navigation}
                        accessibilitySettings={accessibilitySettings}
                        active="profile"
                    />
                </View>
            </View>
        </View>
      );
  }

  // --- AÑADIDO: Calcular edad ---
  let edadCalculada = 'N/A';
  if (user.fechaNacimiento) {
      try {
          const hoy = new Date();
          const fechaNac = new Date(user.fechaNacimiento);
          let edad = hoy.getFullYear() - fechaNac.getFullYear();
          const m = hoy.getMonth() - fechaNac.getMonth();
          if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
              edad--;
          }
          edadCalculada = edad.toString() + " años";
      } catch(e) { console.error("Error calculando edad"); }
  }
  
  // --- AÑADIDO: Formatear fecha ---
  let fechaNacFormateada = 'N/A';
  if (user.fechaNacimiento) {
      try {
          const d = new Date(user.fechaNacimiento);
          const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };
          fechaNacFormateada = d.toLocaleDateString('es-ES', options);
      } catch(e) { console.error("Error formateando fecha"); }
  }

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <View style={styles.profileHeader}>
            <View style={styles.headerButtons}>
              <Pressable
                style={styles.changePasswordButton}
                onPress={changePassword.handleQuickPress}
                onPressIn={changePassword.handlePressIn}
                onPressOut={changePassword.handlePressOut}
              >
                <Ionicons name="key" size={20} color="#007AFF" />
                <Text
                  style={[
                    styles.changePasswordText,
                    accessibilitySettings.largeFont && { fontSize: 16 },
                  ]}
                >
                  Cambiar Contraseña
                </Text>
              </Pressable>

              <Pressable
                style={styles.logoutButton}
                onPress={logout.handleQuickPress}
                onPressIn={logout.handlePressIn}
                onPressOut={logout.handlePressOut}
              >
                <Ionicons name="log-out" size={20} color="#FF3B30" />
                <Text
                  style={[
                    styles.logoutText,
                    accessibilitySettings.largeFont && { fontSize: 16 },
                  ]}
                >
                  Cerrar Sesión
                </Text>
              </Pressable>
            </View>
          </View>

          <ScrollView contentContainerStyle={styles.profileScrollContent}>
            <View style={styles.invisiblePadding} />

            <View style={styles.profileContainer}>
              <ScreenTitle accessibilitySettings={accessibilitySettings}>
                Perfil - Health Reminder
              </ScreenTitle>

              <Pressable
                style={styles.profilePhotoContainer}
                onPressIn={photo.handlePressIn}
                onPressOut={photo.handlePressOut}
              >
                <View style={styles.profilePhoto}>
                  <Ionicons name="person" size={60} color="#fff" />
                </View>
                <Text
                  style={[
                    styles.profileName,
                    accessibilitySettings.largeFont && { fontSize: 26 },
                  ]}
                >
                  {user.nombreCompleto}
                </Text>
                <Text
                  style={[
                    styles.profileEmail,
                    accessibilitySettings.largeFont && { fontSize: 18 },
                  ]}
                >
                  Clave: {user.claveUnica}
                </Text>
              </Pressable>

              <Pressable
                style={styles.infoCard}
                onPressIn={personalInfo.handlePressIn}
                onPressOut={personalInfo.handlePressOut}
              >
                <Text
                  style={[
                    styles.cardTitle,
                    accessibilitySettings.largeFont && { fontSize: 18 },
                  ]}
                >
                  Información Personal
                </Text>

                <View style={styles.profileGrid}>
                  {[
                    ['Nombre(s)', user.nombreCompleto],
                    ['Sexo', user.sexo || 'N/A'],
                    ['Número Telefónico', user.telefono || 'N/A'],
                    ['Dirección', user.direccion || 'N/A'],
                    ['Fecha de Nacimiento', fechaNacFormateada],
                    ['Edad', edadCalculada]
                  ].map(([label, value]) => (
                    <View key={label} style={styles.profileField}>
                      <Text
                        style={[
                          styles.fieldLabel,
                          accessibilitySettings.largeFont && { fontSize: 13 },
                        ]}
                      >
                        {label}
                      </Text>
                      <Text
                        style={[
                          styles.fieldValue,
                          accessibilitySettings.largeFont && { fontSize: 18 },
                        ]}
                      >
                        {value}
                      </Text>
                    </View>
                  ))}
                </View>
              </Pressable>
              
              <Pressable
                style={styles.infoCard}
                onPressIn={medicalInfo.handlePressIn}
                onPressOut={medicalInfo.handlePressOut}
              >
                <Text
                  style={[
                    styles.cardTitle,
                    accessibilitySettings.largeFont && { fontSize: 18 },
                  ]}
                >
                  Información Médica
                </Text>

                {[
                  ['Enfermedades Crónicas', user.enfermedadesCronicas || 'Ninguna'],
                  ['Tipo de Sangre', user.tipoSangre || 'N/A'],
                  ['Alergias', user.alergias || 'Ninguna'],
                ].map(([label, value]) => (
                  <View key={label} style={styles.profileField}>
                    <Text
                      style={[
                        styles.fieldLabel,
                        accessibilitySettings.largeFont && { fontSize: 13 },
                      ]}
                    >
                      {label}
                    </Text>
                    <Text
                      style={[
                        styles.fieldValue,
                        accessibilitySettings.largeFont && { fontSize: 18 },
                      ]}
                    >
                      {value}
                    </Text>
                  </View>
                ))}
              </Pressable>
            </View>

            <View style={styles.infoCard}>
              <Text
                style={[
                  styles.cardTitle,
                  accessibilitySettings.largeFont && { fontSize: 18 },
                ]}
              >
                Accesibilidad
              </Text>

              <Pressable style={styles.accessRow} onPress={toggleLargeFont}>
                <Text
                  style={[
                    styles.fieldLabel,
                    accessibilitySettings.largeFont && { fontSize: 13 },
                  ]}
                >
                  Texto grande
                </Text>
                <Text
                  style={[
                    styles.fieldValue,
                    accessibilitySettings.largeFont && { fontSize: 18 },
                  ]}
                >
                  {accessibilitySettings.largeFont ? 'Activado' : 'Desactivado'}
                </Text>
              </Pressable>

              <Pressable style={styles.accessRow} onPress={toggleTts}>
                <Text
                  style={[
                    styles.fieldLabel,
                    accessibilitySettings.largeFont && { fontSize: 13 },
                  ]}
                >
                  Lectura de botones
                </Text>
                <Text
                  style={[
                    styles.fieldValue,
                    accessibilitySettings.largeFont && { fontSize: 18 },
                  ]}
                >
                  {accessibilitySettings.ttsEnabled ? 'Activado' : 'Desactivado'}
                </Text>
              </Pressable>
            </View>

            <View style={styles.extraBottomPadding} />
          </ScrollView>

          <BottomNav
            navigation={navigation}
            accessibilitySettings={accessibilitySettings}
            active="profile"
          />
        </View>
      </View>
    </View>
  );
}

// Cambiar contraseña (Sin cambios por ahora)
function ChangePasswordScreen({ navigation }) {
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const { accessibilitySettings } = useContext(PrescriptionsContext);

  const { isPressing: cardPressing, handlePressIn: cardPressIn, handlePressOut: cardPressOut } =
    useDualPress();

  const {
    isPressing: submitPressing,
    handlePressIn: submitPressIn,
    handlePressOut: submitPressOut,
    handleQuickPress: submitQuickPress,
  } = useDualPress(() => {
    if (!contrasenaActual || !nuevaContrasena || !confirmarContrasena) {
      Alert.alert('Campos incompletos', 'Por favor completa todos los campos'); 
      return;
    }
    if (nuevaContrasena !== confirmarContrasena) {
      Alert.alert('Error', 'Las nuevas contraseñas no coinciden'); 
      return;
    }
    // TODO: Conectar esto a una API 'changePassword'
    Alert.alert('Éxito', 'Contraseña actualizada exitosamente'); 
    navigation.navigate('Profile');
  });

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.passwordScrollContent}>
            <View style={styles.invisiblePadding} />

            <View style={styles.passwordContainer}>
              <ScreenTitle accessibilitySettings={accessibilitySettings}>
                Cambiar Contraseña - Health Reminder
              </ScreenTitle>

              <Pressable
                style={[styles.infoCard, cardPressing && styles.navButtonActive]}
                onPressIn={cardPressIn}
                onPressOut={cardPressOut}
              >
                {[
                  ['Contraseña Actual', contrasenaActual, setContrasenaActual],
                  ['Nueva Contraseña', nuevaContrasena, setNuevaContrasena],
                  ['Confirmar Nueva Contraseña', confirmarContrasena, setConfirmarContrasena],
                ].map(([label, value, setter]) => (
                  <React.Fragment key={label}>
                    <Text
                      style={[
                        styles.label,
                        accessibilitySettings.largeFont && { fontSize: 16 },
                      ]}
                    >
                      {label}
                    </Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        accessibilitySettings.largeFont && { fontSize: 18 },
                      ]}
                      placeholder={label}
                      placeholderTextColor="#666"
                      value={value}
                      onChangeText={setter}
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </React.Fragment>
                ))}

                <Pressable
                  style={({ pressed }) => [
                    styles.button,
                    pressed && styles.buttonPressed,
                    submitPressing && styles.navButtonActive,
                  ]}
                  onPress={submitQuickPress}
                  onPressIn={submitPressIn}
                  onPressOut={submitPressOut}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      accessibilitySettings.largeFont && { fontSize: 18 },
                    ]}
                  >
                    {submitPressing
                      ? 'Mantén para vibración...'
                      : 'Actualizar Contraseña'}
                  </Text>
                </Pressable>
              </Pressable>
            </View>

            <View style={styles.extraBottomPadding} />
          </ScrollView>

          <BottomNav
            navigation={navigation}
            accessibilitySettings={accessibilitySettings}
            active="profile"
          />
        </View>
      </View>
    </View>
  );
}

/* ===================== APP PRINCIPAL ===================== */

export default function App() {
  const [prescriptions, setPrescriptions] = useState([
    // <-- MODIFICADO: Estos datos de ejemplo del calendario están bien por ahora
    // (La pantalla de recetas ahora carga sus propios datos)
    {
      id: 1,
      nombre: 'Paracetamol',
      inicio: new Date(),
      fin: new Date(new Date().setDate(new Date().getDate() + 7)),
      horarios: ['08:00', '20:00'],
      stock: 14,
      dosisPorToma: 1,
      esLargoPlazo: true,
    },
    {
      id: 2,
      nombre: 'Ibuprofeno',
      inicio: new Date(),
      fin: new Date(new Date().setDate(new Date().getDate() + 5)),
      horarios: ['12:00'],
      stock: 5,
      dosisPorToma: 1,
      esLargoPlazo: true,
    },
  ]);

  const [accessibilitySettings, setAccessibilitySettings] = useState({
    largeFont: false,
    ttsEnabled: false,
  });
  
  // <-- AÑADIDO: Estado para guardar el usuario logueado
  const [user, setUser] = useState(null);

  return (
    // <-- MODIFICADO: Pasamos 'user' y 'setUser' al contexto
    <PrescriptionsContext.Provider
      value={{
        prescriptions,
        setPrescriptions,
        accessibilitySettings,
        setAccessibilitySettings,
        user,
        setUser
      }}
    >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: '#ffffff' },
            headerTintColor: '#000',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          {/* (El Stack.Navigator no cambia) */}
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MainApp" component={MainAppScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="RequestAppointment"
            component={RequestAppointmentScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Prescription"
            component={PrescriptionScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PrescriptionsContext.Provider>
  );
}

/* ===================== ESTILOS ===================== */

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 25,
    paddingBottom: 35,
    paddingHorizontal: 10,
  },
  contentFrame: { flex: 1, backgroundColor: '#ffffff' },

  invisiblePadding: { height: 25 },
  extraBottomPadding: { height: 40 },

  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  requestContainer: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { flex: 1 },

  homeTitle: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructionText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  navButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    maxWidth: 300,
  },
  navButtonPressed: { backgroundColor: '#0056CC', transform: [{ scale: 0.95 }] },
  navButtonActive: { backgroundColor: '#004499' },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonPressed: { backgroundColor: '#0056CC', transform: [{ scale: 0.95 }] },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  homeLogoSection: { padding: 20, alignItems: 'center', marginBottom: 20 },
  homeLogoImage: { width: 150, height: 150 },

  logoSection: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    marginBottom: 25,
    borderRadius: 10,
    width: '100%',
    maxWidth: 400,
  },
  logoImage: { width: 120, height: 120 },
  loginForm: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#f8f9fa',
    padding: 25,
    borderRadius: 10,
  },
  requestForm: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    maxWidth: 400,
    alignSelf: 'center',
    width: '100%',
  },

  section: {
    padding: 18,
    backgroundColor: '#f8f9fa',
    margin: 12,
    borderRadius: 10,
  },
  sectionTitle: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitleLarge: { fontSize: 24 },
  alertBox: {
    backgroundColor: '#FFF4E5',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  alertTitle: { fontWeight: 'bold', marginBottom: 4, color: '#E65100' },
  alertText: { fontSize: 13, color: '#5D4037' },

  fiveDayStrip: { marginTop: 10 },
  dayChip: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    minWidth: 70,
  },
  dayChipSelected: { backgroundColor: '#007AFF' },
  dayChipDow: { fontSize: 12, color: '#555' },
  dayChipNumber: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  calendarDotRow: { flexDirection: 'row', marginTop: 2 },
  calendarDot: { fontSize: 14, color: '#007AFF', marginRight: 2 },

  todayHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  todayBullet: { color: '#007AFF', fontSize: 16, marginRight: 8 },
  todayTitle: { color: '#000', fontSize: 18, fontWeight: 'bold' },
  todaySubtitle: { color: '#666', fontSize: 14, marginBottom: 15 },
  medicationList: { backgroundColor: '#ffffff', borderRadius: 8, padding: 12 },
  emptyText: { color: '#666', fontSize: 14, textAlign: 'center', paddingVertical: 8 },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  medicationName: { fontSize: 14, fontWeight: 'bold' },
  medicationTime: { color: '#000', fontSize: 14 },

  prescriptionScrollContent: { flexGrow: 1, justifyContent: 'center', padding: 15 },
  prescriptionContainer: { maxWidth: 400, alignSelf: 'center', width: '100%', padding: 10 },
  medicationItemPrescription: {
    marginBottom: 15,
    borderLeftWidth: 2,
    borderLeftColor: '#e0e0e0',
    paddingLeft: 12,
  },
  medicationDosage: { color: '#666', fontSize: 12, marginTop: 4, lineHeight: 16 },

  label: {
    color: '#000',
    fontSize: 14,
    marginBottom: 5,
    marginTop: 10,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    color: '#000',
    fontSize: 16,
  },
  multilineInput: { minHeight: 80, textAlignVertical: 'top' },
  dateInput: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInputText: { color: '#000', fontSize: 16 },

  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginTop: 10,
    marginBottom: 10,
    height: 54,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  picker: { height: 54, fontSize: 16 },

  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  accessRow: { paddingVertical: 8 },
  cardTitle: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardContent: { color: '#000', fontSize: 14, lineHeight: 20 },

  profileScrollContent: { flexGrow: 1, padding: 15 },
  profileContainer: { maxWidth: 400, alignSelf: 'center', width: '100%', padding: 10 },
  profileHeader: { padding: 20, paddingTop: 60, backgroundColor: '#f8f9fa' },
  headerButtons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  changePasswordText: { color: '#007AFF', fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffebee',
    borderRadius: 8,
  },
  logoutText: { color: '#FF3B30', fontSize: 14, fontWeight: 'bold', marginLeft: 8 },
  profilePhotoContainer: { alignItems: 'center', marginBottom: 30, padding: 25 },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileName: { color: '#000', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  profileEmail: { color: '#666', fontSize: 16, textAlign: 'center' },
  profileGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  profileField: {
    width: '48%',
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  fieldLabel: { color: '#666', fontSize: 12, marginBottom: 6, fontWeight: '500' },
  fieldValue: { color: '#000', fontSize: 16, fontWeight: '500' },

  passwordScrollContent: { flexGrow: 1, justifyContent: 'center', padding: 15 },
  passwordContainer: { maxWidth: 400, alignSelf: 'center', width: '100%', padding: 10 },

  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    padding: 12,
  },
  navItem: { padding: 5, alignItems: 'center', flex: 1 },
  navText: { color: '#666', fontSize: 10, textAlign: 'center', marginTop: 4 },
  activeNavText: { color: '#007AFF' },

  paracetamol: { color: '#FF6B6B' },
  ibuprofeno: { color: '#4ECDC4' },
  naproxeno: { color: '#FFD166' },
  tempra: { color: '#118AB2' },

  requestScrollContent: { flexGrow: 1, justifyContent: 'center', paddingVertical: 10 },
});