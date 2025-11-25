import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { getFiveDayWindow } from '../../utils/dateUtils';
import { styles } from '../../styles/styles';
import { PrescriptionsContext } from '../../contexts/AppContext';

const weekDays = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

export const CalendarStrip = ({ 
  currentDate, 
  selectedDate, 
  onSelectDate, 
  medications, 
  accessibilitySettings 
}) => {
    const { getMedicationColor } = useContext(PrescriptionsContext);
    
    const formatDate = (date) => date.toISOString().slice(0, 10);
  
    const getMedsForDate = (date) => {
        const targetDate = new Date(date).setHours(0, 0, 0, 0);
        
        return medications.filter((med) => {
            if (!med.inicio || !med.fin) return false;
            
            const inicio = new Date(med.inicio).setHours(0, 0, 0, 0);
            const fin = new Date(med.fin).setHours(0, 0, 0, 0);
            
            return targetDate >= inicio && targetDate <= fin;
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
                        <Text style={[styles.dayChipDow, accessibilitySettings.largeFont && { fontSize: 13 }]}>
                            {weekDays[dateObj.getDay()]}
                        </Text>
                        <Text style={[styles.dayChipNumber, accessibilitySettings.largeFont && { fontSize: 20 }]}>
                            {dateObj.getDate()}
                        </Text>

                        {hasMeds && (
                            <View style={styles.calendarDotRow}>
                                {medsThatDay.map((med) => {
                                    const medColor = getMedicationColor(med.nombre);
                                    
                                    return (
                                        <Text
                                            key={med.id}
                                            style={[styles.calendarDot, { color: medColor }]}
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