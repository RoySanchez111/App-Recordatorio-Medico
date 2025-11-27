import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // ===================== GENERALES / LAYOUT =====================
  screenContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingTop: 25,
    paddingHorizontal: 10,
  },
  contentFrame: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  invisiblePadding: {
    height: 25,
  },
  extraBottomPadding: {
    height: 40,
  },
  section: {
    padding: 18,
    backgroundColor: "#f8f9fa",
    margin: 12,
    borderRadius: 10,
  },

  // ===================== PANTALLAS ESPECÍFICAS =====================
  homeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  requestContainer: {
    flex: 1,
  },
  prescriptionContainer: {
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
    padding: 10,
  },
  profileContainer: {
    maxWidth: 400,
    alignSelf: "center",
    width: "%100",
    padding: 10,
  },
  passwordContainer: {
    maxWidth: 400,
    alignSelf: "center",
    width: "%100",
    padding: 10,
  },

  // ===================== SCROLL CONTENT =====================
  prescriptionScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 15,
  },
  profileScrollContent: {
    flexGrow: 1,
    padding: 15,
  },
  passwordScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 15,
  },
  requestScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 10,
  },

  // ===================== TÍTULOS Y TEXTOS =====================
  sectionTitle: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  sectionTitleLarge: {
    fontSize: 24,
  },
  label: {
    color: "#000",
    fontSize: 14,
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "500",
  },
  instructionText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
    fontStyle: "italic",
  },
  emptyText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 8,
  },

  // ===================== HOME SCREEN =====================
  homeLogoSection: {
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  homeLogoImage: {
    width: 150,
    height: 150,
  },
  homeTitle: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  // ===================== LOGIN SCREEN =====================
  logoSection: {
    padding: 30,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    marginBottom: 25,
    borderRadius: 10,
    width: "100%",
    maxWidth: 400,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  loginForm: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#f8f9fa",
    padding: 25,
    borderRadius: 10,
  },
  requestForm: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },

  // ===================== INPUTS / FORMULARIOS =====================
  textInput: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    color: "#000",
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  dateInput: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateInputText: {
    color: "#000",
    fontSize: 16,
  },

  // ===================== PICKER =====================
  pickerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 10,
    marginBottom: 10,
    height: 54,
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  picker: {
    height: 54,
    fontSize: 16,
  },

  // ===================== BOTONES =====================
  button: {
    backgroundColor: "#6a8dff",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonPressed: {
    backgroundColor: "#5a7ddf",
    transform: [{ scale: 0.95 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  navButton: {
    backgroundColor: "#6a8dff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    maxWidth: 300,
  },
  navButtonPressed: {
    backgroundColor: "#5a7ddf",
    transform: [{ scale: 0.95 }],
  },
  navButtonActive: {
    backgroundColor: "#4a6dcf",
  },

  // ===================== MAIN APP SCREEN MEJORADO =====================
  medicationDetailCardEnhanced: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
<<<<<<< HEAD
    borderLeftColor: '#007AFF',
=======
    borderLeftColor: '#6a8dff',
>>>>>>> 1c61584d976e407df22d7af64241c83caeb849df
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailRowEnhanced: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  detailLabelEnhanced: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    width: '35%',
  },
  detailValueEnhanced: {
    fontSize: 14,
    color: '#34495e',
    width: '62%',
    flex: 1,
    lineHeight: 20,
  },
  horariosContainerEnhanced: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '62%',
    gap: 8,
    marginTop: 4,
  },
  horarioTagEnhanced: {
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  horarioPrincipalEnhanced: {
<<<<<<< HEAD
    backgroundColor: '#1976d2',
=======
    backgroundColor: '#6a8dff',
>>>>>>> 1c61584d976e407df22d7af64241c83caeb849df
    color: '#ffffff',
  },
  instruccionesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1'
  },

  // ===================== PRESCRIPTION SCREEN =====================
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
    borderLeftWidth: 4,
    borderLeftColor: "#6a8dff",
  },
  cardTitle: {
    color: "#6a8dff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  cardContent: {
    color: "#000",
    fontSize: 14,
    lineHeight: 20,
  },
  medicationItemPrescription: {
    marginBottom: 15,
    borderLeftWidth: 2,
    borderLeftColor: "#e0e0e0",
    paddingLeft: 12,
  },
  medicationDosage: {
    color: "#666",
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },

  // ===================== PROFILE SCREEN =====================
  profileHeader: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#f8f9fa",
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  medicationName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  changePasswordButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
  },
  changePasswordText: {
    color: "#6a8dff",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  logoutText: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  profilePhotoContainer: {
    alignItems: "center",
    marginBottom: 30,
    padding: 25,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#6a8dff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  profileName: {
    color: "#000",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  profileEmail: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
  profileGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  profileField: {
    width: "48%",
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  fieldLabel: {
    color: "#666",
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "500",
  },
  fieldValue: {
    color: "#000",
    fontSize: 16,
    fontWeight: "500",
  },
  accessRow: {
    paddingVertical: 8,
  },

  // ===================== BOTTOM NAVIGATION =====================
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#ffffff",
    padding: 12,
  },
  navItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: "center",
    flex: 1,
  },
  navText: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },
  activeNavText: {
    color: "#6a8dff",
  },

  // ===================== COLORS FOR MEDICATIONS =====================
<<<<<<< HEAD
  paracetamol: { color: '#FF6B6B' },
  ibuprofeno: { color: '#4ECDC4' },
  naproxeno: { color: '#FFD166' },
  tempra: { color: '#118AB2' },

  // HEADER MEJORADO
  homeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  timeContainer: {
    alignItems: 'flex-start',
  },

  currentTime: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3748',
  },

  currentDate: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },

  // BOTÓN DE NOTIFICACIONES
  notificationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  bellIcon: {
    fontSize: 20,
  },

  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#e53e3e',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // TEXTO DE BIENVENIDA
  welcomeText: {
    fontSize: 14,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
  },

  // MODAL DE NOTIFICACIONES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  notificationsModal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    minHeight: '40%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
  },

  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f7fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeIcon: {
    fontSize: 16,
    color: '#4a5568',
    fontWeight: 'bold',
  },

  modalContent: {
    padding: 20,
  },

  medicationModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7fafc',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  medicationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ebf8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  pillIcon: {
    fontSize: 18,
  },

  medicationDetails: {
    flex: 1,
  },

  medicationModalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 4,
  },

  medicationModalTime: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 2,
  },

  medicationModalInstructions: {
    fontSize: 13,
    color: '#a0aec0',
    fontStyle: 'italic',
  },

  emptyModal: {
    alignItems: 'center',
    padding: 40,
  },

  emptyModalIcon: {
    fontSize: 40,
    marginBottom: 15,
  },

  emptyModalText: {
    fontSize: 16,
    color: '#718096',
    textAlign: 'center',
    marginBottom: 8,
  },

  emptyModalSubtext: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
  },
=======
  paracetamol: { color: "#FF6B6B" },
  ibuprofeno: { color: "#4ECDC4" },
  naproxeno: { color: "#FFD166" },
  tempra: { color: "#118AB2" },
>>>>>>> 1c61584d976e407df22d7af64241c83caeb849df

  // ===================== STATUS SCREEN =====================
  screenContainerStatus: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentFrameStatus: {
    flex: 1,
    padding: 20,
  },
  containerStatus: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  // ===================== MEDICATION DETAIL STYLES =====================
  medicationDetailCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6a8dff',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    width: '30%',
  },
  detailValue: {
    fontSize: 14,
    color: '#666',
    width: '68%',
    flex: 1,
  },
  horariosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '68%',
    gap: 6,
  },
  horarioTag: {
    backgroundColor: '#6a8dff20',
    color: '#5a7ddf',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '500',
  },
  horarioCalculado: {
    backgroundColor: '#28a74520',
    color: '#155724',
  },

  // ===================== PRESCRIPTION DETAIL SCREEN =====================
  doctorInfoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center'
  },
  doctorInfoText: {
    fontSize: 16,
    color: '#1565c0',
    textAlign: 'center'
  },
  doctorName: {
    fontWeight: 'bold',
    color: '#0d47a1'
  },
  medicationInfoContainer: {
    marginBottom: 15,
  },
  detailSection: {
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  horariosSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1'
  },
  horarioTagContainer: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 5
  },
  horarioPrincipal: {
    backgroundColor: '#6a8dff'
  },
  horarioPrincipalText: {
    color: '#ffffff'
  },
  instruccionesSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1'
  },
  instruccionesText: {
    fontSize: 14,
    lineHeight: 20
  },
  noMedicamentosContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8
  },
  noMedicamentosText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center'
  },
<<<<<<< HEAD

=======
>>>>>>> 1c61584d976e407df22d7af64241c83caeb849df
  // ===================== CALENDAR STYLES MEJORADOS =====================
  calendarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  calendarContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '100%',
  },
  calendarScrollContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  dayChip: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dayChipSelected: {
<<<<<<< HEAD
    backgroundColor: '#007AFF',
    borderColor: '#0056CC',
    shadowColor: '#007AFF',
=======
    backgroundColor: '#6a8dff',
    borderColor: '#5a7ddf',
    shadowColor: '#6a8dff',
>>>>>>> 1c61584d976e407df22d7af64241c83caeb849df
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  dayChipToday: {
<<<<<<< HEAD
    borderColor: '#007AFF',
=======
    borderColor: '#6a8dff',
>>>>>>> 1c61584d976e407df22d7af64241c83caeb849df
    backgroundColor: '#E3F2FD',
  },
  dayChipDow: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  dayChipNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  dayChipSelectedText: {
    color: '#ffffff',
  },
  dayChipTodayText: {
<<<<<<< HEAD
    color: '#007AFF',
=======
    color: '#6a8dff',
>>>>>>> 1c61584d976e407df22d7af64241c83caeb849df
  },
  calendarDotRow: {
    flexDirection: 'row',
    marginTop: 6,
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  calendarDot: {
    fontSize: 16,
    marginHorizontal: 1,
    fontWeight: 'bold',
  },
  moreDots: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
    marginLeft: 2,
  },
<<<<<<< HEAD

  // ===================== PATIENT SECTION STYLES =====================
  patientSection: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },
  patientTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },

  // ===================== TODAY HEADER STYLES =====================
  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  todayBullet: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 8,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  todaySubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },

  // ===================== MEDICATION LIST STYLES =====================
  medicationList: {
    width: '100%',
  },
  medicationTime: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },

  // ===================== ALERT BOX STYLES =====================
  alertBox: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 8,
  },
  alertText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 4,
  }
});
=======
});
>>>>>>> 1c61584d976e407df22d7af64241c83caeb849df
