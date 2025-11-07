import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

const icon = require('./assets/icon.png');
export default function App() {
  return (
    <View style={styles.container}>
      <Image source={icon} style={{
        width: 500, 
        height: 500,
        resizeMode: 'center'}}/>
      <Text>Inicio de la aplicacion</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
