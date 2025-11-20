import React from "react";
import { View, Text, ScrollView } from "react-native";
import { ScreenTitle } from "../components/ScreenTitle";
import { BottomNav } from "../components/BottomNav";
import { styles } from "../styles/styles";

export default function PrescriptionDetailScreen({ route, navigation }) {
  const { receta, accessibilitySettings } = route.params;

  return (
    <View style={styles.screenContainer}>
      <View style={styles.contentFrame}>
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.prescriptionScrollContent}>

            <ScreenTitle accessibilitySettings={accessibilitySettings}>
              Receta del {new Date(receta.fechaEmision).toLocaleDateString("es-MX")}
            </ScreenTitle>

            <Text style={{textAlign:"center", marginBottom:20}}>
              Dr. {receta.doctorNombre}
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
                <View key={i} style={{marginBottom:12}}>
                  <Text style={{fontWeight:"bold"}}>• {m.nombre_medicamento || m.nombre}</Text>
                  <Text>Dosis: {m.dosis}</Text>
                  <Text>Frecuencia: {m.frecuencia}</Text>
                  <Text>Duración: {m.duracion}</Text>
                </View>
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
