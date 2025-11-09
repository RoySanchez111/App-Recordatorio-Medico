import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, ScrollView, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const Stack = createStackNavigator();

// Pantalla de Inicio - CON MARCO
function HomeScreen({ navigation }) {
    return (
        <View style={styles.screenContainer}>
            <View style={styles.contentFrame}>
                <View style={styles.homeContainer}>
                    <Text style={styles.homeTitle}>Bienvenido a la App Médica</Text>
                    
                    <Pressable 
                        style={styles.navButton}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={styles.buttonText}>Iniciar</Text>
                    </Pressable>
                    
                    <StatusBar style="light" />
                </View>
            </View>
        </View>
    );
}

// Pantalla de Login - CON MARCO
function LoginScreen({ navigation }) {
    const [claveUnica, setClaveUnica] = useState('');
    const [contrasena, setContrasena] = useState('');

    const handleLogin = () => {
        if (claveUnica && contrasena) {
            alert(`Ingreso exitoso\nClave: ${claveUnica}`);
            navigation.navigate('MainApp');
        } else {
            alert('Por favor ingresa tu clave única y contraseña');
        }
    };

    return (
        <View style={styles.screenContainer}>
            <View style={styles.contentFrame}>
                <View style={styles.loginContainer}>
                    {/* Logo Section */}
                    <View style={styles.logoSection}>
                        <Text style={styles.logo}># [LOGO]</Text>
                    </View>

                    {/* Login Section */}
                    <View style={styles.loginForm}>
                        <Text style={styles.sectionTitle}>Ingresar</Text>
                        
                        <Text style={styles.label}>Clave Unica</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ingresa tu clave única"
                            placeholderTextColor="#888"
                            value={claveUnica}
                            onChangeText={setClaveUnica}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        
                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Ingresa tu contraseña"
                            placeholderTextColor="#888"
                            value={contrasena}
                            onChangeText={setContrasena}
                            secureTextEntry={true}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        
                        <Pressable style={styles.button} onPress={handleLogin}>
                            <Text style={styles.buttonText}>Ingresar</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

// Pantalla Principal después del Login - CON MARCO
function MainAppScreen({ navigation }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const weekDays = ['DOM', 'LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB'];

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const changeMonth = (increment) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + increment);
        setCurrentDate(newDate);
    };

    const changeYear = (increment) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(newDate.getFullYear() + increment);
        setCurrentDate(newDate);
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];
        
        // Días vacíos al inicio
        for (let i = 0; i < firstDay; i++) {
            days.push(<View key={`empty-${i}`} style={styles.emptyDay} />);
        }
        
        // Días del mes
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = new Date().getDate() === i && 
                           new Date().getMonth() === currentDate.getMonth() && 
                           new Date().getFullYear() === currentDate.getFullYear();
            
            days.push(
                <View key={i} style={[styles.calendarDay, isToday && styles.todayDay]}>
                    <Text style={[styles.dayText, isToday && styles.todayText]}>{i}</Text>
                </View>
            );
        }
        
        return days;
    };

    return (
        <View style={styles.screenContainer}>
            <View style={styles.contentFrame}>
                <View style={styles.container}>
                    <ScrollView style={styles.scrollContent}>
                        
                        {/* Calendario Médico Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Calendario Medico</Text>
                            
                            {/* Controles del calendario */}
                            <View style={styles.calendarControls}>
                                <Pressable onPress={() => changeYear(-1)} style={styles.controlButton}>
                                    <Ionicons name="chevron-back" size={20} color="#fff" />
                                </Pressable>
                                
                                <Pressable onPress={() => changeMonth(-1)} style={styles.controlButton}>
                                    <Ionicons name="chevron-back" size={16} color="#fff" />
                                </Pressable>
                                
                                <Text style={styles.monthYear}>
                                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                                </Text>
                                
                                <Pressable onPress={() => changeMonth(1)} style={styles.controlButton}>
                                    <Ionicons name="chevron-forward" size={16} color="#fff" />
                                </Pressable>
                                
                                <Pressable onPress={() => changeYear(1)} style={styles.controlButton}>
                                    <Ionicons name="chevron-forward" size={20} color="#fff" />
                                </Pressable>
                            </View>
                            
                            {/* Calendar Grid - PERFECTAMENTE ALINEADO */}
                            <View style={styles.calendarWrapper}>
                                {/* Días de la semana */}
                                <View style={styles.weekDaysRow}>
                                    {weekDays.map((day, index) => (
                                        <View key={day} style={styles.weekDayContainer}>
                                            <Text style={styles.weekDay}>{day}</Text>
                                        </View>
                                    ))}
                                </View>
                                
                                {/* Días del mes - PERFECTAMENTE ALINEADOS */}
                                <View style={styles.calendarGrid}>
                                    {renderCalendar()}
                                </View>
                            </View>
                        </View>

                        <View style={styles.divider} />

                        {/* Hoy Section - CON MARCO */}
                        <View style={styles.section}>
                            <View style={styles.todayHeader}>
                                <Text style={styles.todayBullet}>●</Text>
                                <Text style={styles.todayTitle}>Hoy</Text>
                            </View>
                            
                            <Text style={styles.todaySubtitle}>Que medicamento y a que hora tomarlo</Text>
                            
                            <View style={styles.medicationList}>
                                <View style={styles.medicationItem}>
                                    <Text style={[styles.medicationName, styles.paracetamol]}>Paracetamol</Text>
                                    <Text style={styles.medicationTime}>8:00</Text>
                                </View>
                                
                                <View style={styles.medicationItem}>
                                    <Text style={[styles.medicationName, styles.ibuprofeno]}>Ibuprofeno</Text>
                                    <Text style={styles.medicationTime}>12:00</Text>
                                </View>
                                
                                <View style={styles.medicationItem}>
                                    <Text style={[styles.medicationName, styles.naproxeno]}>Naproxeno</Text>
                                    <Text style={styles.medicationTime}>15:00</Text>
                                </View>
                                
                                <View style={styles.medicationItem}>
                                    <Text style={[styles.medicationName, styles.tempra]}>Tempra</Text>
                                    <Text style={styles.medicationTime}>20:00</Text>
                                </View>
                            </View>
                        </View>

                    </ScrollView>

                    {/* Navegación inferior */}
                    <View style={styles.bottomNavigation}>
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('MainApp')}
                        >
                            <Ionicons name="calendar" size={24} color="#007AFF" />
                            <Text style={[styles.navText, styles.activeNavText]}>Calendario{"\n"}Medico</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('RequestAppointment')}
                        >
                            <Ionicons name="add-circle" size={24} color="#fff" />
                            <Text style={styles.navText}>Solicitar{"\n"}Consulta</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('Prescription')}
                        >
                            <Ionicons name="document-text" size={24} color="#fff" />
                            <Text style={styles.navText}>Receta</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Ionicons name="person" size={24} color="#fff" />
                            <Text style={styles.navText}>Perfil</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

// Pantalla de Solicitar Consulta - CON MARCO
function RequestAppointmentScreen({ navigation }) {
    const [fechaConsulta, setFechaConsulta] = useState(new Date());
    const [motivoConsulta, setMotivoConsulta] = useState('');
    const [nombreDoctor, setNombreDoctor] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSolicitar = () => {
        if (motivoConsulta && nombreDoctor) {
            alert('Consulta solicitada exitosamente');
            navigation.navigate('MainApp');
        } else {
            alert('Por favor completa todos los campos');
        }
    };

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFechaConsulta(selectedDate);
        }
    };

    const formatDate = (date) => {
        return date.toISOString().split('T')[0].replace(/-/g, '/');
    };

    return (
        <View style={styles.screenContainer}>
            <View style={styles.contentFrame}>
                <View style={styles.requestContainer}>
                    <ScrollView contentContainerStyle={styles.requestScrollContent}>
                        
                        {/* Solicitar Consulta Section - CON MARCO */}
                        <View style={styles.requestForm}>
                            <Text style={styles.sectionTitle}>Solicitar Consulta</Text>
                            
                            <Text style={styles.label}>Fecha de la consulta</Text>
                            <Pressable 
                                style={styles.dateInput}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateInputText}>
                                    {formatDate(fechaConsulta)}
                                </Text>
                                <Ionicons name="calendar" size={20} color="#888" />
                            </Pressable>
                            
                            {showDatePicker && (
                                <DateTimePicker
                                    value={fechaConsulta}
                                    mode="date"
                                    display="default"
                                    onChange={onDateChange}
                                />
                            )}
                            
                            <Text style={styles.label}>Motivo de la Consulta</Text>
                            <TextInput
                                style={[styles.textInput, styles.multilineInput]}
                                placeholder="Describe el motivo de tu consulta"
                                placeholderTextColor="#888"
                                value={motivoConsulta}
                                onChangeText={setMotivoConsulta}
                                multiline={true}
                                numberOfLines={3}
                                textAlignVertical="top"
                            />
                            
                            <Text style={styles.label}>Nombre del Doctor Encargado</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Ingresa el nombre del doctor"
                                placeholderTextColor="#888"
                                value={nombreDoctor}
                                onChangeText={setNombreDoctor}
                            />
                            
                            <Pressable style={styles.button} onPress={handleSolicitar}>
                                <Text style={styles.buttonText}>Solicitar</Text>
                            </Pressable>
                        </View>

                    </ScrollView>

                    {/* Navegación inferior */}
                    <View style={styles.bottomNavigation}>
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('MainApp')}
                        >
                            <Ionicons name="calendar" size={24} color="#fff" />
                            <Text style={styles.navText}>Calendario{"\n"}Medico</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('RequestAppointment')}
                        >
                            <Ionicons name="add-circle" size={24} color="#007AFF" />
                            <Text style={[styles.navText, styles.activeNavText]}>Solicitar{"\n"}Consulta</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('Prescription')}
                        >
                            <Ionicons name="document-text" size={24} color="#fff" />
                            <Text style={styles.navText}>Receta</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Ionicons name="person" size={24} color="#fff" />
                            <Text style={styles.navText}>Perfil</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

// Pantalla de Receta - CON MARCO
function PrescriptionScreen({ navigation }) {
    return (
        <View style={styles.screenContainer}>
            <View style={styles.contentFrame}>
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.prescriptionScrollContent}>
                        
                        {/* Receta Section - CON MARCO */}
                        <View style={styles.prescriptionContainer}>
                            <Text style={styles.sectionTitle}>Receta</Text>
                            
                            {/* Recuadro de Fecha de Emisión */}
                            <View style={styles.infoCard}>
                                <Text style={styles.cardTitle}>Fecha de Emisión</Text>
                                <Text style={styles.cardContent}>29/10/2025</Text>
                            </View>
                            
                            {/* Recuadro de Diagnóstico */}
                            <View style={styles.infoCard}>
                                <Text style={styles.cardTitle}>Diagnóstico</Text>
                                <Text style={styles.cardContent}>Infección respiratoria superior</Text>
                            </View>
                            
                            {/* Recuadro de Observación */}
                            <View style={styles.infoCard}>
                                <Text style={styles.cardTitle}>Observación</Text>
                                <Text style={styles.cardContent}>
                                    Paciente con fiebre y tos persistente, se recomienda reposo y aumento de líquidos.
                                </Text>
                            </View>
                            
                            {/* Recuadro de Medicamentos */}
                            <View style={styles.infoCard}>
                                <Text style={styles.cardTitle}>Medicamentos</Text>
                                
                                <View style={styles.medicationItemPrescription}>
                                    <Text style={[styles.medicationName, styles.paracetamol]}>Paracetamol 500mg</Text>
                                    <Text style={styles.medicationDosage}>1 cápsula cada 8 horas - Duración: 7 días</Text>
                                </View>
                                
                                <View style={styles.medicationItemPrescription}>
                                    <Text style={[styles.medicationName, styles.ibuprofeno]}>Ibuprofeno 500mg</Text>
                                    <Text style={styles.medicationDosage}>1 cápsula cada 24 horas - Duración: 10 días</Text>
                                </View>
                                
                                <View style={styles.medicationItemPrescription}>
                                    <Text style={[styles.medicationName, styles.naproxeno]}>Naproxeno 500mg</Text>
                                    <Text style={styles.medicationDosage}>1 cápsula cada 12 horas - Duración: 3 días</Text>
                                </View>
                                
                                <View style={styles.medicationItemPrescription}>
                                    <Text style={[styles.medicationName, styles.tempra]}>Tempra 250mg</Text>
                                    <Text style={styles.medicationDosage}>1 cápsula cada 12 horas - Duración: 2 días</Text>
                                </View>
                            </View>
                        </View>

                    </ScrollView>

                    {/* Navegación inferior */}
                    <View style={styles.bottomNavigation}>
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('MainApp')}
                        >
                            <Ionicons name="calendar" size={24} color="#fff" />
                            <Text style={styles.navText}>Calendario{"\n"}Medico</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('RequestAppointment')}
                        >
                            <Ionicons name="add-circle" size={24} color="#fff" />
                            <Text style={styles.navText}>Solicitar{"\n"}Consulta</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('Prescription')}
                        >
                            <Ionicons name="document-text" size={24} color="#007AFF" />
                            <Text style={[styles.navText, styles.activeNavText]}>Receta</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Ionicons name="person" size={24} color="#fff" />
                            <Text style={styles.navText}>Perfil</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

// Pantalla de Perfil - CON MARCO
function ProfileScreen({ navigation }) {
    return (
        <View style={styles.screenContainer}>
            <View style={styles.contentFrame}>
                <View style={styles.container}>
                    {/* Header con botón de cambiar contraseña */}
                    <View style={styles.profileHeader}>
                        <Pressable 
                            style={styles.changePasswordButton}
                            onPress={() => navigation.navigate('ChangePassword')}
                        >
                            <Ionicons name="key" size={20} color="#007AFF" />
                            <Text style={styles.changePasswordText}>Cambiar Contraseña</Text>
                        </Pressable>
                    </View>

                    <ScrollView contentContainerStyle={styles.profileScrollContent}>
                        
                        {/* Perfil Section - CON MARCO */}
                        <View style={styles.profileContainer}>
                            <Text style={styles.sectionTitle}>Perfil</Text>
                            
                            {/* Foto de Perfil */}
                            <View style={styles.profilePhotoContainer}>
                                <View style={styles.profilePhoto}>
                                    <Ionicons name="person" size={60} color="#fff" />
                                </View>
                                <Text style={styles.profileName}>Rafael Flores Lopez</Text>
                                <Text style={styles.profileEmail}>rafael.flores@email.com</Text>
                            </View>
                            
                            {/* Información Personal */}
                            <View style={styles.infoCard}>
                                <Text style={styles.cardTitle}>Información Personal</Text>
                                
                                <View style={styles.profileGrid}>
                                    <View style={styles.profileField}>
                                        <Text style={styles.fieldLabel}>Nombre(s)</Text>
                                        <Text style={styles.fieldValue}>Rafael</Text>
                                    </View>
                                    
                                    <View style={styles.profileField}>
                                        <Text style={styles.fieldLabel}>Apellidos</Text>
                                        <Text style={styles.fieldValue}>Flores Lopez</Text>
                                    </View>
                                    
                                    <View style={styles.profileField}>
                                        <Text style={styles.fieldLabel}>Sexo</Text>
                                        <Text style={styles.fieldValue}>Hombre</Text>
                                    </View>
                                    
                                    <View style={styles.profileField}>
                                        <Text style={styles.fieldLabel}>Número Telefónico</Text>
                                        <Text style={styles.fieldValue}>222 402 9740</Text>
                                    </View>
                                    
                                    <View style={styles.profileField}>
                                        <Text style={styles.fieldLabel}>Dirección</Text>
                                        <Text style={styles.fieldValue}>AAAAAAA</Text>
                                    </View>
                                    
                                    <View style={styles.profileField}>
                                        <Text style={styles.fieldLabel}>Fecha de Nacimiento</Text>
                                        <Text style={styles.fieldValue}>12/09/2006</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Información Médica */}
                            <View style={styles.infoCard}>
                                <Text style={styles.cardTitle}>Información Médica</Text>
                                
                                <View style={styles.profileField}>
                                    <Text style={styles.fieldLabel}>Enfermedades Crónicas</Text>
                                    <Text style={styles.fieldValue}>Diabetes Tipo 45</Text>
                                </View>
                                
                                <View style={styles.profileField}>
                                    <Text style={styles.fieldLabel}>Tipo de Sangre</Text>
                                    <Text style={styles.fieldValue}>O+</Text>
                                </View>
                                
                                <View style={styles.profileField}>
                                    <Text style={styles.fieldLabel}>Alergias</Text>
                                    <Text style={styles.fieldValue}>Ninguna</Text>
                                </View>
                            </View>
                        </View>

                    </ScrollView>

                    {/* Navegación inferior */}
                    <View style={styles.bottomNavigation}>
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('MainApp')}
                        >
                            <Ionicons name="calendar" size={24} color="#fff" />
                            <Text style={styles.navText}>Calendario{"\n"}Medico</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('RequestAppointment')}
                        >
                            <Ionicons name="add-circle" size={24} color="#fff" />
                            <Text style={styles.navText}>Solicitar{"\n"}Consulta</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('Prescription')}
                        >
                            <Ionicons name="document-text" size={24} color="#fff" />
                            <Text style={styles.navText}>Receta</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Ionicons name="person" size={24} color="#007AFF" />
                            <Text style={[styles.navText, styles.activeNavText]}>Perfil</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

// Pantalla de Cambiar Contraseña - CON MARCO
function ChangePasswordScreen({ navigation }) {
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');

    const handleActualizar = () => {
        if (nuevaContrasena && confirmarContrasena) {
            if (nuevaContrasena === confirmarContrasena) {
                alert('Contraseña actualizada exitosamente');
                navigation.navigate('Profile');
            } else {
                alert('Las contraseñas no coinciden');
            }
        } else {
            alert('Por favor completa ambos campos');
        }
    };

    return (
        <View style={styles.screenContainer}>
            <View style={styles.contentFrame}>
                <View style={styles.container}>
                    <ScrollView contentContainerStyle={styles.passwordScrollContent}>
                        
                        {/* Cambiar Contraseña Section - CON MARCO */}
                        <View style={styles.passwordContainer}>
                            <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
                            
                            <View style={styles.infoCard}>
                                <Text style={styles.label}>Nueva Contraseña</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Ingresa nueva contraseña"
                                    placeholderTextColor="#888"
                                    value={nuevaContrasena}
                                    onChangeText={setNuevaContrasena}
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                
                                <Text style={styles.label}>Confirmar Contraseña</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Confirma tu contraseña"
                                    placeholderTextColor="#888"
                                    value={confirmarContrasena}
                                    onChangeText={setConfirmarContrasena}
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                
                                <Pressable style={styles.button} onPress={handleActualizar}>
                                    <Text style={styles.buttonText}>Actualizar Contraseña</Text>
                                </Pressable>
                            </View>
                        </View>

                    </ScrollView>

                    {/* Navegación inferior */}
                    <View style={styles.bottomNavigation}>
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('MainApp')}
                        >
                            <Ionicons name="calendar" size={24} color="#fff" />
                            <Text style={styles.navText}>Calendario{"\n"}Medico</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('RequestAppointment')}
                        >
                            <Ionicons name="add-circle" size={24} color="#fff" />
                            <Text style={styles.navText}>Solicitar{"\n"}Consulta</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('Prescription')}
                        >
                            <Ionicons name="document-text" size={24} color="#fff" />
                            <Text style={styles.navText}>Receta</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={styles.navItem}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Ionicons name="person" size={24} color="#007AFF" />
                            <Text style={[styles.navText, styles.activeNavText]}>Perfil</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
}

// Componente principal con navegación
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#1a1a1a',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen}
                    options={{ title: 'Inicio', headerShown: false }}
                />
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen}
                    options={{ title: 'Ingresar', headerShown: false }}
                />
                <Stack.Screen 
                    name="MainApp" 
                    component={MainAppScreen}
                    options={{ title: 'App Médica', headerShown: false }}
                />
                <Stack.Screen 
                    name="RequestAppointment" 
                    component={RequestAppointmentScreen}
                    options={{ title: 'Solicitar Consulta', headerShown: false }}
                />
                <Stack.Screen 
                    name="Prescription" 
                    component={PrescriptionScreen}
                    options={{ title: 'Receta', headerShown: false }}
                />
                <Stack.Screen 
                    name="Profile" 
                    component={ProfileScreen}
                    options={{ title: 'Perfil', headerShown: false }}
                />
                <Stack.Screen 
                    name="ChangePassword" 
                    component={ChangePasswordScreen}
                    options={{ title: 'Cambiar Contraseña', headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    // NUEVOS ESTILOS PARA EL MARCO
    screenContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    contentFrame: {
        flex: 1,
        margin: 10,
        backgroundColor: '#000',
        borderRadius: 12,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
    },
    
    // Contenedores centrados para Home y Login
    homeContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loginContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    requestContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    homeTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 40,
    },
    loginForm: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#1a1a1a',
        padding: 20,
        borderRadius: 10,
    },
    requestForm: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
    },
    requestScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    
    // Estilos para Receta - CON MARCO
    prescriptionScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 10,
    },
    prescriptionContainer: {
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
        padding: 5,
    },
    
    // ESTILOS PARA PERFIL Y CAMBIAR CONTRASEÑA - CON MARCO
    profileScrollContent: {
        flexGrow: 1,
        padding: 10,
    },
    profileContainer: {
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
        padding: 5,
    },
    passwordScrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 10,
    },
    passwordContainer: {
        maxWidth: 400,
        alignSelf: 'center',
        width: '100%',
        padding: 5,
    },
    
    // ESTILOS PARA EL PERFIL MEJORADO
    profileHeader: {
        padding: 15,
        paddingTop: 50,
        backgroundColor: '#1a1a1a',
    },
    changePasswordButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        padding: 10,
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
    },
    changePasswordText: {
        color: '#007AFF',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    profilePhotoContainer: {
        alignItems: 'center',
        marginBottom: 25,
        padding: 20,
    },
    profilePhoto: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 3,
        borderColor: '#007AFF',
    },
    profileName: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 5,
    },
    profileEmail: {
        color: '#888',
        fontSize: 16,
        textAlign: 'center',
    },
    profileGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    profileField: {
        width: '48%',
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    fieldLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 5,
        fontWeight: '500',
    },
    fieldValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    secondaryButton: {
        backgroundColor: '#333',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#555',
    },
    secondaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    
    // Estilos existentes
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollContent: {
        flex: 1,
    },
    navButton: {
        backgroundColor: '#007AFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '80%',
        maxWidth: 300,
    },
    logoSection: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        marginBottom: 20,
        borderRadius: 10,
        width: '100%',
        maxWidth: 400,
    },
    logo: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    section: {
        padding: 15,
        backgroundColor: '#1a1a1a',
        margin: 10,
        borderRadius: 10,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    calendarControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    controlButton: {
        padding: 8,
        backgroundColor: '#333',
        borderRadius: 20,
    },
    monthYear: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        marginHorizontal: 10,
    },
    calendarWrapper: {
        marginBottom: 10,
    },
    weekDaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        paddingHorizontal: 0,
    },
    weekDayContainer: {
        width: '14.28%', // Exactamente 1/7 del ancho
        alignItems: 'center',
        justifyContent: 'center',
    },
    weekDay: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingHorizontal: 0,
    },
    calendarDay: {
        width: '14.28%', // Exactamente 1/7 del ancho - Mismo que weekDayContainer
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333',
        borderRadius: 8,
        marginVertical: 2,
    },
    todayDay: {
        backgroundColor: '#007AFF',
    },
    emptyDay: {
        width: '14.28%', // Exactamente 1/7 del ancho - Mismo que weekDayContainer
        height: 40,
        marginVertical: 2,
    },
    dayText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    todayText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    todayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    todayBullet: {
        color: '#007AFF',
        fontSize: 16,
        marginRight: 8,
    },
    todayTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    todaySubtitle: {
        color: '#ccc',
        fontSize: 14,
        marginBottom: 15,
    },
    medicationList: {
        backgroundColor: '#2a2a2a',
        borderRadius: 8,
        padding: 10,
    },
    medicationItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    medicationName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    medicationTime: {
        color: '#fff',
        fontSize: 14,
    },
    // Estilos para medicamentos en Receta
    medicationItemPrescription: {
        marginBottom: 12,
        paddingLeft: 5,
        borderLeftWidth: 2,
        borderLeftColor: '#333',
        paddingLeft: 10,
    },
    medicationDosage: {
        color: '#ccc',
        fontSize: 12,
        marginTop: 2,
        lineHeight: 16,
    },
    // Colores para los medicamentos
    paracetamol: {
        color: '#FF6B6B',
    },
    ibuprofeno: {
        color: '#4ECDC4',
    },
    naproxeno: {
        color: '#FFD166',
    },
    tempra: {
        color: '#118AB2',
    },
    label: {
        color: '#fff',
        fontSize: 14,
        marginBottom: 5,
        marginTop: 10,
    },
    textInput: {
        backgroundColor: '#333',
        padding: 12,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#555',
        marginBottom: 10,
        color: '#fff',
        fontSize: 16,
    },
    multilineInput: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    dateInput: {
        backgroundColor: '#333',
        padding: 12,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#555',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateInputText: {
        color: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 10,
    },
    bottomNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#1a1a1a',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    navItem: {
        padding: 5,
        alignItems: 'center',
        flex: 1,
    },
    navText: {
        color: '#fff',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 4,
    },
    activeNavText: {
        color: '#007AFF',
    },
    infoCard: {
        backgroundColor: '#2a2a2a',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    cardTitle: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardContent: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
    },
});
