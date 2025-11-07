import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, TouchableHighlight } from 'react-native';

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
      {/*<Button title="Pulsa aqui" onPress={() => alert('Hola')} /> {/* Prueba de boton netivo */}
      <TouchableHighlight
        underlayColor={"#09f"}
        onPress={() => alert('Hola')}
        style={{width:200, height: 200, backgroundColor: 'red', borderRadius: 70,
        justifyContent: 'center', alignItems: 'center'
        }}
      >
        <Text style={{color: 'white'}}>Pulsa aqui</Text>
      </TouchableHighlight>  
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
