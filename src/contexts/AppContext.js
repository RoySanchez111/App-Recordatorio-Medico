import React, { createContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api'; 

export const PrescriptionsContext = createContext();
const VIBRANT_COLOR_PALETTE = [
    '#FF8C00', // 1. Naranja Brillante
    '#1E90FF', // 2. Azul Dodger Brillante
    '#32CD32', // 3. Verde Lima Brillante
    '#FF1493', // 4. Rosa Profundo Brillante
    '#9932CC', // 5. Morado Oscuro Brillante
    '#FFD700', // 6. Dorado Brillante
    '#6A5ACD', // 7. Azul Pizarra Oscuro
    '#00CED1', // 8. Turquesa Oscuro
];

export const AppProvider = ({ children }) => {
    // --- ESTADOS ---
    const [prescriptions, setPrescriptions] = useState([]);
    const [accessibilitySettings, setAccessibilitySettings] = useState({
        largeFont: false,
        ttsEnabled: false,
    });
    const [user, setUser] = useState(null);
    const [medicationColorsMap, setMedicationColorsMap] = useState({}); 
    const [isLoading, setIsLoading] = useState(true); // Estado de carga para evitar renderizado vacío

    // --- FUNCIÓN DE ASIGNACIÓN CÍCLICA DE COLOR (Front-end) ---
    // Esta función asigna un color único y cíclico a cada nombre de medicamento.
    const generateColorMap = (recetas) => {
        const colorMap = {};
        let colorIndex = 0;
        
        recetas.forEach(receta => {
            // Aseguramos que solo procesamos si hay medicamentos
            (receta.medicamentos || []).forEach(med => {
                // Tu Lambda usa 'nombre_medicamento'
                const medName = med.nombre_medicamento; 

                if (medName && !colorMap[medName]) {
                    const color = VIBRANT_COLOR_PALETTE[colorIndex % VIBRANT_COLOR_PALETTE.length];
                    colorMap[medName] = color;
                    colorIndex++; 
                }
            });
        });
        setMedicationColorsMap(colorMap);
    };
    
    // --- Lógica para cargar las recetas y asignar los colores ---
    useEffect(() => {
        const loadData = async () => {
            // Utilizamos el estado isLoading para gestionar si el usuario aún no se ha cargado.
            if (!user || !user.id) {
                setIsLoading(false);
                return; 
            }
            
            setIsLoading(true);
            try {
                // 1. Llamada usando la acción 'getRecipesByPatient' de tu Lambda
                const fetchedRecetas = await apiRequest('getRecipesByPatient', {
                    pacienteId: user.id 
                }); 
                
                // 2. Actualizar estados
                setPrescriptions(fetchedRecetas); 
                generateColorMap(fetchedRecetas);
                
            } catch (error) {
                console.error("Error al cargar recetas o asignar colores:", error);
                // Si la carga falla, asegurémonos de que al menos prescriptions no esté en un estado roto.
                setPrescriptions([]); 
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [user]); // Se ejecuta cuando el 'user' cambia (ej: después del login)

    // Helper para obtener el color
    const getMedicationColor = (name) => {
        return medicationColorsMap[name] || '#CCCCCC'; 
    };

    // Devolvemos 'null' o un componente de carga si la aplicación está inicializando
    // antes de que el usuario haya sido autenticado o cargado.
    if (isLoading && !user) {
        return null; 
    }

    return (
        <PrescriptionsContext.Provider
            value={{
                prescriptions,
                setPrescriptions,
                accessibilitySettings,
                setAccessibilitySettings,
                user,
                setUser,
                isLoading, // Útil para que los componentes muestren un spinner
                getMedicationColor // Función clave
            }}
        >
            {children}
        </PrescriptionsContext.Provider>
    );
};