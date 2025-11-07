import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button } from 'react-native';

const icon = require('./assets/icon.png');
export default function App() {
  return (
    <View style={styles.container}>

      <Image source={{uri: "https://wiki.leagueoflegends.com/en-us/images/Chibi_Gwen_Base_Tier_1.png?fc9c7"}} /* Imagen cargada de internet */
        style={{
        width: 512, 
        height: 512,
        resizeMode: 'center'}}/>

      <Text style={{color: 'white'}}>{'Inicio de la aplicacion'}</Text> {/* Texto */}
      <StatusBar style="light" /> {/* Color de la barra superior */}
      <Button title="Pulsa aqui" onPress={() => alert('Hola')} /> {/* Prueba de boton */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
