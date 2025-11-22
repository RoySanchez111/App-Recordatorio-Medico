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
    width: "100%",
    padding: 10,
  },
  passwordContainer: {
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
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
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonPressed: {
    backgroundColor: "#0056CC",
    transform: [{ scale: 0.95 }],
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  navButton: {
    backgroundColor: "#007AFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    maxWidth: 300,
  },
  navButtonPressed: {
    backgroundColor: "#0056CC",
    transform: [{ scale: 0.95 }],
  },
  navButtonActive: {
    backgroundColor: "#004499",
  },

  // ===================== MAIN APP SCREEN =====================
  alertBox: {
    backgroundColor: "#FFF4E5",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FFC107",
  },
  alertTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#E65100",
  },
  alertText: {
    fontSize: 13,
    color: "#5D4037",
  },

  // Calendario
  fiveDayStrip: {
    marginTop: 10,
    alignSelf: "center",
  },
  dayChip: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginRight: 8,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    minWidth: 80,
    maxWidth: 80,
  },
  dayChipSelected: {
    backgroundColor: "#C3E6FF",
    borderWidth: 2,
    borderColor: "#004C99",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  dayChipDow: {
    fontSize: 16,
    color: "#555",
  },
  dayChipNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
  },
  calendarDotRow: {
    flexDirection: "row",
    marginTop: 2,
  },
  calendarDot: {
    fontSize: 25,
    color: "#007AFF",
    marginRight: 0,
  },

  // Medicamentos
  todayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  todayBullet: {
    color: "#007AFF",
    fontSize: 16,
    marginRight: 8,
  },
  todayTitle: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  todaySubtitle: {
    color: "#666",
    fontSize: 14,
    marginBottom: 15,
  },
  medicationList: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
  },
  medicationColorIndicator: {
    width: 8,
    height: "100%",
    borderRadius: 4,
    marginRight: 10,
  },
  medicationItem: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  medicationName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  medicationTime: {
    color: "#000",
    fontSize: 14,
  },

  // ===================== PRESCRIPTION SCREEN =====================
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
    borderLeftWidth: 4,
    borderLeftColor: "#007AFF",
  },
  cardTitle: {
    color: "#007AFF",
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
  changePasswordButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
  },
  changePasswordText: {
    color: "#007AFF",
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
    backgroundColor: "#007AFF",
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
    paddingVertical: 10, // antes 5
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
    color: "#007AFF",
  },
  // ===================== COLORS FOR MEDICATIONS =====================
  paracetamol: { color: "#FF6B6B" },
  ibuprofeno: { color: "#4ECDC4" },
  naproxeno: { color: "#FFD166" },
  tempra: { color: "#118AB2" },

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
});
