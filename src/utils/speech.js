import * as Speech from 'expo-speech';

export const speakIfEnabled = (accessibilitySettings, text) => {
  if (accessibilitySettings?.ttsEnabled && text) {
    Speech.stop();
    Speech.speak(text, { language: 'es-MX', rate: 1.0 });
  }
};