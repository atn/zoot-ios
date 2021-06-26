import React from 'react'

import { View, Text, Modal, GestureResponderEvent, TextInput } from 'react-native'
import { v4 as uuidv4 } from 'uuid';

import { ZootManager, Movement } from '../utils/zootManager'
import { Button } from '../components/Button';


export function ZootView() {
  const [name, onChangeName] = React.useState('')
  const [showingModal, setModal] = React.useState(false)
  const [connection, setConnection] = React.useState('not connected')
  const [manager, setManager] = React.useState<ZootManager>(new ZootManager(uuidv4()))
  const [movements, setMovements] = React.useState<Movement[]>([])

  React.useEffect(() => {
    try {
      manager.on('movement', async (movement) => {
        if (movement.userId === manager.userId) return;
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
    if (!manager.name) return setModal(true)

    const movement: Movement = {
      userId: manager.userId,
      movementId: uuidv4(),
      name: manager.name,
      x: e.nativeEvent.locationX,
      y:e.nativeEvent.locationY
    }

    setMovements(movements => movements.filter(function(el) { return el.userId != movement.userId; }))
    setMovements(movements => [...movements, movement])

    setTimeout(() => {
      //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      setMovements(movements => movements.filter(function(el) { return el.movementId != movement.movementId; }))
    }, 100)

    console.log(`touch at ${e.nativeEvent.locationX}, ${e.nativeEvent.locationY}`)
    manager.move(e.nativeEvent.locationX, e.nativeEvent.locationY);
  }

  return (
    <>
      <Text style={{color: '#fff', marginLeft: 20, fontWeight: '700', fontSize: 30}}>zoot</Text>
      <Text style={{color: connection === 'connected' ? '#7cd992' : '#f7e463', marginLeft: 20,}}>{connection}</Text>
      <View style={{ flex: 1 }} onTouchMove={handleFinger} onTouchStart={handleFinger} >
        {
          movements.map((item) => (
            <Text key={item.userId} style={{ color: '#fff', position: 'absolute', left: item.x, top: item.y }}>{item.name}</Text>
          ))
        }
      </View>
        <Modal 
          visible={showingModal}
          animationType='slide'
          presentationStyle={'pageSheet'}
          >
            <View style={{backgroundColor: '#212121', flex: 1, padding: 30}}>
              <Text style={{color: '#fff', fontWeight: '700', fontSize: 40}}>Hey!</Text>
              <Text style={{color: '#fff', fontWeight: '500', fontSize: 20}}>Welcome to zoot.</Text>
              <TextInput
                style={{ borderRadius: 10, color: "#fff", backgroundColor: '#313131', padding: 7, marginVertical: 10, fontSize: 17, height: 35, width: 320 }} 
                placeholder='First Name'
                placeholderTextColor="#919191"
                autoFocus={true}
                onChangeText={text => onChangeName(text)}
                value={name}
              />
              <Button onPress={() => {manager.name = name; setModal(false);}} title='Continue' color='#A86FFF' disabled={!name} />
            </View>
        </Modal>
    </>
  )
}