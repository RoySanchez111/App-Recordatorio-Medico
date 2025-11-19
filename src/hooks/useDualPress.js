import { useState, useRef } from 'react';
import { Vibration } from 'react-native';

export const useDualPress = (onQuickPress, onLongPress, longPressDuration = 5000, vibrationDuration = 500) => {
  const [isPressing, setIsPressing] = useState(false);
  const pressTimer = useRef(null);
  const hasCalledLongPress = useRef(false); // Nuevo: rastrea si la acción larga se ejecutó

  const handlePressIn = () => {
    setIsPressing(true);
    hasCalledLongPress.current = false; // Reinicia el flag
    
    pressTimer.current = setTimeout(() => {
      // 1. Accion Larga se ejecuta
      Vibration.vibrate(vibrationDuration);
      setIsPressing(false);
      onLongPress && onLongPress();
      hasCalledLongPress.current = true; // Setea el flag a true
      pressTimer.current = null;
    }, longPressDuration);
  };

  const handlePressOut = () => {
    setIsPressing(false);

    // 1. Si el timer todavía está activo, significa que fue un toque RÁPIDO.
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
      
      // SOLO llama a la acción rápida si el toque largo NO se ejecutó.
      if (!hasCalledLongPress.current) {
          onQuickPress && onQuickPress();
      }
    }
    // 2. Si el timer no está activo, ya se ejecutó el toque largo (y el timer ya se limpió en el setTimeout).
  };

  // NOTA: Con la lógica anterior, ya NO necesitas handleQuickPress.
  // Tu Pressable ahora SOLO necesita onPressIn y onPressOut.

  return { isPressing, handlePressIn, handlePressOut, handleQuickPress: () => {} };
};