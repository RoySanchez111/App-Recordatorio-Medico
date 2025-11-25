import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { styles } from '../../styles/styles';
import { PrescriptionsContext } from '../../contexts/AppContext';

export const MedicationItem = ({ med, accessibilitySettings, showTimes = true }) => {
    // 2. Acceder al contexto para obtener el helper de color
    const { getMedicationColor } = useContext(PrescriptionsContext);
    
    // 3. Obtener el color dinámicamente
    const medColor = getMedicationColor(med.nombre_medicamento || med.nombre);
    
    // Definir el estilo para el color del TEXTO (Corrección: Añadimos 'textStyle')
    const textStyle = {
        color: medColor // Aplicamos el color al texto del nombre
    };

    // Definir el estilo para el círculo/barra de color (fondo)
    const colorStyle = {
        backgroundColor: medColor // Usamos el color como fondo
    };
    
    return (
        <View style={styles.medicationItem}>
            {/* INCLUIMOS EL INDICADOR DE COLOR (Barra lateral) */}
            <View style={[styles.medicationColorIndicator, colorStyle]} /> 
            
            <View style={styles.medicationTextContainer}>
                <Text style={[
                    styles.medicationName, 
                    textStyle, // 4. APLICAMOS EL COLOR AL TEXTO (Ya definido arriba)
                    accessibilitySettings.largeFont && { fontSize: 16 }
                ]}>
                    {med.nombre_medicamento || med.nombre}
                </Text>
                
                {showTimes && (
                    <Text style={[styles.medicationTime, accessibilitySettings.largeFont && { fontSize: 14, color: '#666' }]}>
                        {med.horarios?.join(' · ')}
                    </Text>
                )}
            </View>
        </View>
    );
};

export const MedicationItemPrescription = ({ med, accessibilitySettings }) => {
    const { getMedicationColor } = useContext(PrescriptionsContext);
    const medColor = getMedicationColor(med.nombre_medicamento || med.nombre);

    const colorIndicatorStyle = {
        backgroundColor: medColor,
    };
    
    // Estilo para el texto del nombre en Prescription (lo necesitamos para darle color)
    const nameTextStyle = {
        color: medColor, 
        fontWeight: "bold",
    };
    
    return (
        <View style={styles.medicationItemPrescription}>
            {/* Indicador de color para la vista de receta */}
            <View style={[styles.medicationColorIndicator, colorIndicatorStyle]} /> 
            
            <View style={styles.medicationTextContainer}>
                {/* Aplicamos el estilo del color al texto */}
                <Text style={[nameTextStyle, accessibilitySettings.largeFont && { fontSize: 16 }]}>
                    {med.nombre_medicamento || med.nombre}
                </Text>
                <Text style={[styles.medicationDosage, accessibilitySettings.largeFont && { fontSize: 14 }]}>
                    {med.dosis} - {med.frecuencia} - Duración: {med.duracion} días
                </Text>
            </View>
        </View>
    );
};