import React from 'react'
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
  } from 'react-native';

const Header = () => {
  return (
    <SafeAreaView > 
        <Text style={styles.texto}>
          Planificador de <Text>Gastos</Text>
        </Text>
        
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    
    texto: {
        textAlign: 'center',
        fontSize: 30,
        color: '#FFF',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        paddingTop: 20
    }
})

export default Header