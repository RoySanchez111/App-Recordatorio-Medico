import React, { useState, useContext } from 'react';
import { View, Text, Pressable, TextInput, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { PrescriptionsContext } from '../contexts/AppContext';
import { useDualPress } from '../hooks/useDualPress';
import { ScreenTitle } from '../components/ScreenTitle';
import { BottomNav } from '../components/BottomNav';
import { PickerField } from '../components/PickerField';
import { apiRequest } from '../utils/api';
import { calculateAge } from '../utils/dateUtils';
import { styles } from '../styles/styles';

export const RequestAppointmentScreen = ({ navigation }) => {
  const [fechaConsulta, setFechaConsulta] = useState(new Date());
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [sintomas, setSintomas] = useState('');
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

    const doctorData = {
        id: "2",
        nombre: "Doctor"
    };

    const edadCalculada = calculateAge(user.fechaNacimiento) || 25;

    const payload = {
      id_paciente: user.id,
      pacienteNombre: user.nombreCompleto,
      edad: edadCalculada, 
      telefono: user.telefono || 'N/A',
      id_doctor: doctorData.id,
      doctorNombre: doctorData.nombre,
      especialidad: "General",
      fecha: fechaConsulta.toISOString(),
      motivo: motivoConsulta,
      sintomas: sintomas,
      status: "pendiente",
      prioridad: prioridad
    };

    try {
      await apiRequest("createConsulta", payload);
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
      () => console.log('Long press submit')
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

              <Text style={[styles.label, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                Fecha de la consulta
              </Text>
              <Pressable
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
                disabled={loading}
              >
                <Text style={[styles.dateInputText, accessibilitySettings.largeFont && { fontSize: 18 }]}>
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

              <Text style={[styles.label, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                Motivo de la Consulta
              </Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput, accessibilitySettings.largeFont && { fontSize: 18 }]}
                placeholder="Describe el motivo de tu consulta"
                placeholderTextColor="#666"
                value={motivoConsulta}
                onChangeText={setMotivoConsulta}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!loading}
              />

              <Text style={[styles.label, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                Síntomas (opcional)
              </Text>
              <TextInput
                style={[styles.textInput, styles.multilineInput, accessibilitySettings.largeFont && { fontSize: 18 }]}
                placeholder="Describe tus síntomas"
                placeholderTextColor="#666"
                value={sintomas}
                onChangeText={setSintomas}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                editable={!loading}
              />
              
              <Text style={[styles.label, accessibilitySettings.largeFont && { fontSize: 16 }]}>
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

              <Text style={[styles.label, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                Nombre del Doctor Encargado
              </Text>
              <PickerField
                value={doctor}
                onChange={setDoctor}
                accessibilitySettings={accessibilitySettings}
                items={[
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
                <Text style={[styles.buttonText, accessibilitySettings.largeFont && { fontSize: 18 }]}>
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
};