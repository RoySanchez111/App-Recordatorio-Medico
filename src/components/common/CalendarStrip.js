import React from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';
import { formatDate, getFiveDayWindow } from '../../utils/dateUtils';
import { styles } from '../../styles/styles';

const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

const getMedColorStyle = (nombre) => {
  if (!nombre) return { color: '#007AFF' }; // Color por defecto azul
  const n = nombre.toLowerCase();
  if (n.includes('paracetamol')) return { color: '#FF6B6B' }; // Rojo
  if (n.includes('ibuprofeno')) return { color: '#4ECDC4' }; // Verde azulado
  if (n.includes('naproxeno')) return { color: '#FFD166' }; // Amarillo
  if (n.includes('tempra')) return { color: '#118AB2' }; // Azul oscuro
  if (n.includes('amoxicilina')) return { color: '#06D6A0' }; // Verde
  if (n.includes('omeprazol')) return { color: '#7209B7' }; // Morado
  return { color: '#007AFF' }; // Color por defecto azul
};

export const CalendarStrip = ({ 
  currentDate, 
  selectedDate, 
  onSelectDate, 
  medications, 
  accessibilitySettings 
}) => {
  // Función CORREGIDA para filtrar medicamentos por fecha
  const getMedsForDate = (date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return medications.filter((med) => {
      if (!med.inicio || !med.fin) return false;
      
      const inicio = new Date(med.inicio);
      inicio.setHours(0, 0, 0, 0);
      
      const fin = new Date(med.fin);
      fin.setHours(0, 0, 0, 0);
      
      return targetDate >= inicio && targetDate <= fin;
    });
  };

  const windowDays = getFiveDayWindow(currentDate);

  return (
    <View style={styles.calendarContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.calendarScrollContent}
      >
        {windowDays.map((dateObj) => {
          const isSelected = formatDate(dateObj) === formatDate(selectedDate);
          const medsThatDay = getMedsForDate(dateObj);
          const hasMeds = medsThatDay.length > 0;
          const isToday = formatDate(dateObj) === formatDate(new Date());

          return (
            <Pressable
              key={formatDate(dateObj)}
              style={[
                styles.dayChip,
                isSelected && styles.dayChipSelected,
                isToday && !isSelected && styles.dayChipToday
              ]}
              onPress={() => onSelectDate(dateObj)}
            >
              <Text style={[
                styles.dayChipDow,
                isSelected && styles.dayChipSelectedText,
                isToday && !isSelected && styles.dayChipTodayText
              ]}>
                {weekDays[dateObj.getDay()]}
              </Text>
              
              <Text style={[
                styles.dayChipNumber,
                isSelected && styles.dayChipSelectedText,
                isToday && !isSelected && styles.dayChipTodayText
              ]}>
                {dateObj.getDate()}
              </Text>

              {hasMeds && (
                <View style={styles.calendarDotRow}>
                  {medsThatDay.slice(0, 3).map((med, index) => (
                    <Text
                      key={med.id}
                      style={[
                        styles.calendarDot,
                        getMedColorStyle(med.nombre)
                      ]}
                    >
                      ●
                    </Text>
                  ))}
                  {medsThatDay.length > 3 && (
                    <Text style={styles.moreDots}>+{medsThatDay.length - 3}</Text>
                  )}
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};