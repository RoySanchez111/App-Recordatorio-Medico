import React, { createContext, useState } from 'react';

export const PrescriptionsContext = createContext();

export const AppProvider = ({ children }) => {
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