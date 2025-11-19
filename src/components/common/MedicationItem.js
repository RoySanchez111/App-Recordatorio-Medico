import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/styles';

const getMedColorStyle = (nombre) => {
  if (!nombre) return null;
  const n = nombre.toLowerCase();
  if (n.includes('paracetamol')) return styles.paracetamol;
  if (n.includes('ibuprofeno')) return styles.ibuprofeno;
  if (n.includes('naproxeno')) return styles.naproxeno;
  if (n.includes('tempra')) return styles.tempra;
  return null;
};

export const MedicationItem = ({ med, accessibilitySettings, showTimes = true }) => (
  <View style={styles.medicationItem}>
    <Text style={[
      styles.medicationName, 
      getMedColorStyle(med.nombre),
      accessibilitySettings.largeFont && { fontSize: 16 }
    ]}>
      {med.nombre}
    </Text>
    {showTimes && (
      <Text style={[styles.medicationTime, accessibilitySettings.largeFont && { fontSize: 16 }]}>
        {med.horarios?.join(' · ')}
      </Text>
    )}
  </View>
);

export const MedicationItemPrescription = ({ med, accessibilitySettings }) => (
  <View style={styles.medicationItemPrescription}>
    <Text style={[styles.medicationName, accessibilitySettings.largeFont && { fontSize: 16 }]}>
      {med.nombre}
    </Text>
    <Text style={[styles.medicationDosage, accessibilitySettings.largeFont && { fontSize: 14 }]}>
      {med.dosis} - {med.frecuencia} - Duración: {med.duracion} días
    </Text>
  </View>
);