import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // ===================== GENERALES / LAYOUT =====================
  screenContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Fondo general más claro
  },
  contentFrame: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    position: 'relative', // Para contener el BottomNav
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollContent: {
    paddingBottom: 80, // Espacio para el BottomNav
  },
  invisiblePadding: {
    height: 25,
  },
  extraBottomPadding: {
    height: 100, // Más espacio al final de formularios/scrolls
  },
  section: {
    marginBottom: 25,
  },

  // ===================== TÍTULOS Y TEXTOS =====================
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  sectionTitleLarge: {
    fontSize: 28, // Estilo para fuente grande
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },

  // ===================== INPUTS / FORMULARIOS =====================
  textInput: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  multilineInput: {
    height: 100,
    paddingTop: 12,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  dateInputText: {
    fontSize: 16,
    color: '#333',
  },

  // ===================== BOTONES =====================
  button: {
    backgroundColor: '#007AFF', // Azul primario
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  buttonPressed: {
    backgroundColor: '#005bb5', // Azul más oscuro al presionar
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  navButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
    width: '100%',
  },
  navButtonPressed: {
    backgroundColor: '#005bb5',
  },
  navButtonActive: {
    // Estilo para indicar toque largo / carga
    backgroundColor: '#FF9500', // Naranja
  },

  // ===================== PANTALLA DE HOME =====================
  homeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  homeLogoSection: {
    marginBottom: 40,
  },
  homeLogoImage: {
    width: 150,
    height: 150,
  },
  homeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 10,
  },

  // ===================== PANTALLA DE LOGIN =====================
  loginContainer: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSection: {
    marginBottom: 30,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  loginForm: {
    width: '100%',
    maxWidth: 350,
  },

  // ===================== PANTALLA PRINCIPAL (MAIN APP) =====================
  // Alerta de Stock
  alertBox: {
    backgroundColor: '#FFFBEA', // Amarillo claro
    borderColor: '#FFD700', // Amarillo oscuro
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 25,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9500',
    marginBottom: 5,
  },
  alertText: {
    fontSize: 12,
    color: '#333',
  },

  // Calendario
  fiveDayStrip: {
    flexDirection: 'row',
    marginVertical: 10,
    paddingVertical: 5,
  },
  dayChip: {
    width: 60,
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 4,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  dayChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  dayChipDow: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#666',
  },
  dayChipNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  calendarDotRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  calendarDot: {
    fontSize: 10,
    marginHorizontal: 1,
  },

  // Colores de medicamentos (para el punto en el calendario)
  paracetamol: { color: '#FF4500' }, // Rojo/Naranja
  ibuprofeno: { color: '#00CED1' }, // Cian Oscuro
  naproxeno: { color: '#8A2BE2' }, // Azul Violeta
  tempra: { color: '#3CB371' }, // Verde Marino

  // Lista de Medicamentos
  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  todayBullet: {
    fontSize: 20,
    color: '#007AFF',
    marginRight: 5,
  },
  todayTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  todaySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    marginLeft: 20,
  },
  medicationList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  medicationItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  }
})