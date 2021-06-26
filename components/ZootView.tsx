import React from 'react'

import { View, Text, TouchableOpacity, GestureResponderEvent } from 'react-native'
import { v4 as uuidv4 } from 'uuid';
import * as Haptics from 'expo-haptics';

import { ZootManager, Movement } from '../utils/zootManager'
import { Button } from '../components/Button';


export function ZootView() {
  const [connection, setConnection] = React.useState('not connected')
  const [manager, setManager] = React.useState<ZootManager>(new ZootManager(uuidv4()))
  const [movements, setMovements] = React.useState<Movement[]>([])

  React.useEffect(() => {
    try {
      manager.on('movement', async (movement) => {
        //if (movement.userId === manager.userId) return;
        setMovements(movements => movements.filter(function(el) { return el.userId != movement.userId; }))
        setMovements(movements => [...movements, movement])
        //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        setTimeout(() => {
          //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          setMovements(movements => movements.filter(function(el) { return el.movementId != movement.movementId; }))
        }, 100)
      })
  
      manager.on('state_change', (state) => setConnection(state))
  
      manager.listenForMovements();
    } catch (error) {
      alert('an error occurred')
    }
  }, [])

  function handleFinger(e: GestureResponderEvent) {
    console.log(`touch at ${e.nativeEvent.locationX}, ${e.nativeEvent.locationY}`)
    manager.move(e.nativeEvent.locationX, e.nativeEvent.locationY);
  }

  return (
    <>
    <Text style={{color: connection === 'connected' ? '#7cd992' : '#f7e463', marginLeft: 20,}}>{connection}</Text>
      <View style={{ flex: 1 }} onTouchMove={handleFinger} onTouchStart={handleFinger} >
        {
          movements.map((item) => (
            <Text key={item.userId} style={{ color: '#fff', position: 'absolute', left: item.x, top: item.y }}>id: {item.userId}</Text>
          ))
        }
      </View>
    </>
  )
}

// bc js bad
function removeItem<T>(arr: Array<T>, value: T): Array<T> { 
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}