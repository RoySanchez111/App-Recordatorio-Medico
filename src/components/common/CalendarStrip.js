import React, { useContext } from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';
import { formatDate, getFiveDayWindow } from '../../utils/dateUtils';
import { styles } from '../../styles/styles';
import { PrescriptionsContext } from '../../contexts/AppContext';

// 1. DEFINICIÓN DE LA FUNCIÓN chunkArray (Faltaba esto)
const chunkArray = (array, size) => {
  const chunked_arr = [];
  for (let i = 0; i < array.length; i += size) {
    chunked_arr.push(array.slice(i, i + size));
  }
  return chunked_arr;
};

const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export const CalendarStrip = ({ 
  currentDate, 
  selectedDate, 
  onSelectDate, 
  medications, 
  accessibilitySettings 
}) => {
  const { getMedicationColor } = useContext(PrescriptionsContext);

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

          // Dividimos los medicamentos en grupos de 3
          const medChunks = chunkArray(medsThatDay, 3);

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
                // 2. CONTENEDOR VERTICAL
                <View style={{ flexDirection: 'column', alignItems: 'center', marginTop: 4 }}>
                  {/* 3. Renderizamos cada FILA de 3 bolitas */}
                  {medChunks.map((chunk, rowIndex) => (
                    <View key={rowIndex} style={styles.calendarDotRow}>
                      {chunk.map((med, index) => {
                        const medName = med.nombre_medicamento || med.nombre || med.medicationName;
                        // Key única para evitar warnings
                        const uniqueKey = med.id || `row-${rowIndex}-${index}`;
                        
                        return (
                          <Text
                            key={uniqueKey}
                            style={[
                              styles.calendarDot,
                              { color: getMedicationColor(medName) } 
                            ]}
                          >
                            ●
                          </Text>
                        );
                      })}
                    </View>
                  ))}
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};