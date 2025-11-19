import { useState, useRef } from 'react';
import { Vibration } from 'react-native';

export const useDualPress = (onQuickPress, onLongPress, longPressDuration = 3000) => {
  const [isPressing, setIsPressing] = useState(false);
  const pressTimer = useRef(null);

  const handlePressIn = () => {
    setIsPressing(true);
    pressTimer.current = setTimeout(() => {
      setIsPressing(false);
      onLongPress && onLongPress();
      pressTimer.current = null;
    }, longPressDuration);
  };

  const handlePressOut = () => {
    setIsPressing(false);
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
      onQuickPress && onQuickPress();
    }
  };

  return { isPressing, handlePressIn, handlePressOut };
};