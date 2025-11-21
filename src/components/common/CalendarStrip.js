import React, { useState, useContext, useEffect } from 'react'; // <--- Añadido useContext
import { View, Text, Pressable, ScrollView } from 'react-native';
import { getFiveDayWindow } from '../../utils/dateUtils';
import { styles } from '../../styles/styles';
// 1. IMPORTAR el Contexto de Prescripciones
import { PrescriptionsContext } from '../../contexts/AppContext'; 

const weekDays = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

export const CalendarStrip = ({ 
  currentDate, 
  selectedDate, 
  onSelectDate, 
  medications, 
  accessibilitySettings 
}) => {
    // 2. OBTENER el helper de color del Contexto
    const { getMedicationColor } = useContext(PrescriptionsContext); 
    
    // --- Lógica de la fecha: Se mantiene ---
    const formatDate = (date) => date.toISOString().slice(0, 10);
  
    const getMedsForDate = (date) => {
        const d = formatDate(date);
        return medications.filter((med) => {
            if (!med.inicio || !med.fin) return false;
            const inicio = formatDate(new Date(med.inicio));
            const fin = formatDate(new Date(med.fin));
            return d >= inicio && d <= fin;
        });
    };

    // --- FUNCIÓN getMedColorStyle ELIMINADA y reemplazada por getMedicationColor ---
    
    const windowDays = getFiveDayWindow(currentDate);

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.fiveDayStrip}>
            {windowDays.map((dateObj) => {
                const isSelected = formatDate(dateObj) === formatDate(selectedDate);
                const medsThatDay = getMedsForDate(dateObj);
                const hasMeds = medsThatDay.length > 0;

                return (
                    <Pressable
                        key={formatDate(dateObj)}
                        style={[styles.dayChip, isSelected && styles.dayChipSelected]}
                        onPress={() => onSelectDate(dateObj)}
                    >
                        <Text style={[styles.dayChipDow, accessibilitySettings.largeFont && { fontSize: 13 }]}>
                            {weekDays[dateObj.getDay()]}
                        </Text>
                        <Text style={[styles.dayChipNumber, accessibilitySettings.largeFont && { fontSize: 20 }]}>
                            {dateObj.getDate()}
                        </Text>

                        {hasMeds && (
                            <View style={styles.calendarDotRow}>
                                {medsThatDay.map((med) => {
                                    // 3. Obtener el código de color y aplicarlo inline
                                    const medColor = getMedicationColor(med.nombre); 
                                    
                                    // NOTA: Si necesitas usar 'med.nombre_medicamento', usa: 
                                    // getMedicationColor(med.nombre_medicamento || med.nombre)
                                    
                                    return (
                                        <Text
                                            key={med.id}
                                            style={[styles.calendarDot, { color: medColor }]} // <-- Aplicación del color dinámico
                                        >
                                            ●
                                        </Text>
                                    );
                                })}
                            </View>
                        )}
                    </Pressable>
                );
            })}
        </ScrollView>
    );
};