import React, { createContext, useState } from 'react';

export const PrescriptionsContext = createContext();

export const AppProvider = ({ children }) => {
  // ELIMINAMOS los medicamentos hardcodeados del contexto
  // Ya que ahora los obtenemos de la API en cada pantalla
  const [prescriptions, setPrescriptions] = useState([]);

  const [accessibilitySettings, setAccessibilitySettings] = useState({
    largeFont: false,
    ttsEnabled: false,
  });
  
  const [user, setUser] = useState(null);

  return (
    <PrescriptionsContext.Provider
      value={{
        prescriptions,
        setPrescriptions,
        accessibilitySettings,
        setAccessibilitySettings,
        user,
        setUser
      }}
    >
      {children}
    </PrescriptionsContext.Provider>
  );
};