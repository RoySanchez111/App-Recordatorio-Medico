import React from 'react';
import { ScrollView, Pressable, Text, View } from 'react-native';
import { formatDate, getFiveDayWindow } from '../../utils/dateUtils';
import { styles } from '../../styles/styles';

const weekDays = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

const getMedColorStyle = (nombre) => {
  if (!nombre) return null;
  const n = nombre.toLowerCase();
  if (n.includes('paracetamol')) return styles.paracetamol;
  if (n.includes('ibuprofeno')) return styles.ibuprofeno;
  if (n.includes('naproxeno')) return styles.naproxeno;
  if (n.includes('tempra')) return styles.tempra;
  return null;
};

export const CalendarStrip = ({ 
  currentDate, 
  selectedDate, 
  onSelectDate, 
  medications, 
  accessibilitySettings 
}) => {
  const getMedsForDate = (date) => {
    const d = formatDate(date);
    return medications.filter((med) => {
      if (!med.inicio || !med.fin) return false;
      const inicio = formatDate(new Date(med.inicio));
      const fin = formatDate(new Date(med.fin));
      return d >= inicio && d <= fin;
    });
  };

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
            <Text style={[
              styles.dayChipDow,
              accessibilitySettings.largeFont && { fontSize: 13 },
            ]}>
              {weekDays[dateObj.getDay()]}
            </Text>
            <Text style={[
              styles.dayChipNumber,
              accessibilitySettings.largeFont && { fontSize: 20 },
            ]}>
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
  );
};