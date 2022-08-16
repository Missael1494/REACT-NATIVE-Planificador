

import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Pressable,
  Image,
  Modal
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ControlPresupuesto from './src/components/ControlPresupuesto';
import Filtro from './src/components/Filtro';
import FormularioGasto from './src/components/FormularioGasto';
import Header from './src/components/Header';
import ListadoGastos from './src/components/ListadoGastos';
import NuevoPresupuesto from './src/components/NuevoPresupuesto';
import { generarId } from './src/helpers';


const App = () => {

  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false)
  const [presupuesto, setPresupuesto] = useState(0)
  const [modal, setModal] = useState(false)
  const [gastos, setGastos] = useState([])
  const [gasto, setGasto] = useState({})
  const [filtro, setFiltro] = useState('')
  const [gastosFiltrados, setGastosFiltrados] = useState([])

  useEffect(() => {
    const obtenerPresupuestoStorage = async () => {
      try {
        const presupuestoStorage = await AsyncStorage.getItem.getItem('planificador_presupuesto') ?? 0

        if(presupuestoStorage > 0) {
          setPresupuesto(presupuestoStorage)
          setIsValidPresupuesto(true)
        }

        console.log(presupuestoStorage)
      } catch (error) {
        console.log(error)
      }
    }
    obtenerPresupuestoStorage()
  }, [])

  useEffect(() => {
    if(isValidPresupuesto) {
      const guardarPresupuesto = async () => {
        try {
          await AsyncStorage.setItem('planificador_presupuesto', presupuesto)
        } catch (error) {
          console.log(error)
        }
      }

      guardarPresupuesto()
    }
  
  }, [isValidPresupuesto])
  

  useEffect(() => {
    const almacenarAS = async () => {
      await AsyncStorage.setItem('prueba_as', nombre)

      console.log('almacenado')
    }
    almacenarAS()
    
  }, [])

  useEffect(() => {
    const obtenerGastosStorage = async () => {
      try {
        const gastoStorage = await AsyncStorage.getItem('planificador_gastos') ?? []
      } catch (error) {
        console.log(error)
      }
    }

    obtenerGastosStorage()
  
  }, [])

  useEffect(() => {
    const guardarGastosStorage = async () => {
      try {
        await AsyncStorage.setItem('planificador_gastos', JSON.stringify(gastos))

        setGastos( gastosStorage ? JSON.parse(gastosStorage) : [] )
      } catch (error) {
        console.log(error)
      }
    }
    guardarGastosStorage();
  }, [gastos])
  
  
  

  
  const handleNuevoPresupuesto = (presupuesto) => {
    if(Number(presupuesto) > 0) {
      setIsValidPresupuesto(true)
    } else {
      Alert.alert('Error', 'El presupuesto no puede ser 0 o menor', [{text: 'Ok'}])
    }
  }

  const handleGasto = gasto => {

    if([gasto.nombre, gasto.categoria, gasto.cantidad].includes('')) {
      Alert.alert(
        "Error",
        "Todos los campos son Obligatorios",
        [{test: 'OK'}]
      )
      return 
    }

    if(gasto.id) {
      //console.log('Edicion')
      const gastosActualizados = gastos.map( gastoState => gastoState.id === gasto.id ? gasto : gastoState)
      setGastos(gastosActualizados)
    } else {
      console.log('Nuevo registro')
      // Añadir el nuevo gasto al state
      gasto.id = generarId()
      gasto.fecha = Date.now()

      setGastos([...gastos, gasto])
    }
    setModal(!modal)
  }

  const eliminarGasto = id => {
    //console.log('eliminando', id)

    Alert.alert(
      'Deseas eliminar este gasto?',
      'Un gasto eliminando no se puede recuperar',
      [
        { text: 'No', style: 'cancel'},
        { text: 'Si, Eliminar', onPress: () => {

          const gastosActualizados = gastos.filter( gastoState => 
              gastoState.id !== id
            )
          setGastos(gastosActualizados)
          setModal(!modal)
          setGasto({})
        }}
      ]
    )
  }

  const resetearApp = () => {
    Alert.alert(
      'Deseas resetear la app?',
      'Esto eliminará presupuesto y gastos',
      [
        { text: 'no', style: 'cancel'},
        { text: 'Si, eliminar', onPress: async () => {
            try {
              await AsyncStorage.clear()

              setIsValidPresupuesto(false)
              setPresupuesto(0)
              setGastos([])
            } catch (error) {
              console.log(error)
            }
        }}
      ]
    )
  }
  console.log('Gastos', gastos)
  return (
    <View style={styles.contenedor}>
      <ScrollView>
        <View style={styles.header}>
          <Header />

          {isValidPresupuesto 
          ? (
            <ControlPresupuesto 
              presupuesto={presupuesto}
              gastos={gastos}
              resetearApp={resetearApp}
            />
          ) 
          : (
            <NuevoPresupuesto 
              presupuesto={presupuesto}
              setPresupuesto={setPresupuesto}
              handleNuevoPresupuesto={handleNuevoPresupuesto}
            />
            )
          }
        </View>

        {isValidPresupuesto
            && (
              <>
                <Filtro 
                  filtro={filtro}
                  setFiltro={setFiltro}
                  gastos={gastos}
                  setGastosFiltrados={setGastosFiltrados}
                />
                <ListadoGastos 
                  gastos={gastos}
                  setModal={setModal}
                  setGasto={setGasto}
                  filtro={filtro}
                  gastosFiltrados={gastosFiltrados}
                />
              </>
              
            )
          }
      </ScrollView>
      
        

      {modal && (
        <Modal 
          animationType='slide'
          visible={modal}
          onRequestClose={() => {
            setModal(!modal)
          }}
        >
          <FormularioGasto 
            setModal={setModal}
            handleGasto={handleGasto}
            setGasto={setGasto}
            gasto={gasto}
            eliminarGasto={eliminarGasto}
          />
        </Modal>
      )}

      {isValidPresupuesto && (
        <Pressable
        style={styles.pressable}
          onPress={ () => setModal(!modal) }
        >
          <Image 
            style={styles.imagen}
            source={require('./src/img/nuevo-gasto.png')}
          />
        </Pressable>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: '#F5F5F5',
        flex: 1
    },
    header: {
      backgroundColor: '#3B82F6',
      minHeight: 400,
    },
    pressable: {
      width: 60,
      height: 60,
      position: 'absolute',
      bottom: 40,
      right: 30,
    },
    imagen: {
      width: 60,
      height: 60,
      //position: 'absolute',
      //bottom: 20,
      //right: 20,
    }
});

export default App;
