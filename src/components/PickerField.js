import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../styles/styles';

export const PickerField = ({ 
  value, 
  onChange, 
  items, 
  accessibilitySettings,
  style,
  enabled = true 
}) => (
  <View style={styles.pickerContainer}>
    <Picker
      selectedValue={value}
      onValueChange={onChange}
      style={[
        styles.picker, 
        accessibilitySettings.largeFont && { fontSize: 18 },
        style
      ]}
      itemStyle={accessibilitySettings.largeFont ? { fontSize: 18 } : {}}
      enabled={enabled}
    >
      {items.map((item) => (
        <Picker.Item 
          key={item.value} 
          label={item.label} 
          value={item.value} 
        />
      ))}
    </Picker>
  </View>
);