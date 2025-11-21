import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ScreenTitle } from "../components/ScreenTitle";
import { BottomNav } from "../components/BottomNav";
import { styles } from "../styles/styles";
import { MedicationItem } from "../components/common/MedicationItem"; 

export default function PrescriptionDetailScreen({ route, navigation }) {
  const { receta, accessibilitySettings } = route.params;
  const doctorDisplay = receta.doctorNombre || 'Información No Disponible'; 

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.prescriptionScrollContent}>

            <ScreenTitle accessibilitySettings={accessibilitySettings}>
              Receta del {new Date(receta.fechaEmision).toLocaleDateString("es-MX")}
            </ScreenTitle>

            {/* MOSTRAR EL NOMBRE DEL DOCTOR DE FORMA CLARA */}
            <Text style={{textAlign:"center", marginBottom:20, fontSize: 16}}>
              Emitida por: Dr. <Text style={{fontWeight: "bold"}}>{doctorDisplay}</Text>
            </Text>

            {/* Diagnóstico */}
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Diagnóstico</Text>
              <Text style={styles.cardContent}>{receta.diagnostico}</Text>
            </View>

            {/* Observaciones */}
            {receta.observaciones && (
              <View style={styles.infoCard}>
                <Text style={styles.cardTitle}>Observaciones</Text>
                <Text style={styles.cardContent}>{receta.observaciones}</Text>
              </View>
            )}

            {/* Medicamentos */}
            <View style={[styles.infoCard, { backgroundColor:"#eef7ff" }]}>
              <Text style={styles.cardTitle}>Medicamentos</Text>

              {receta.medicamentos.map((m, i) => (
                <MedicationItem
                  key={i}
                  med={m}
                  accessibilitySettings={accessibilitySettings}
                    showDetails={true} // Forzar mostrar dosis y duración en la receta
                    showTimes={true} // Forzar mostrar instrucciones/frecuencia
                />
              ))}
            </View>

            <View style={{height:60}} />
          </ScrollView>

          <BottomNav 
            navigation={navigation} 
            accessibilitySettings={accessibilitySettings}
            active="prescription"
          />
        </View>
      </View>
    </View>
  );
}