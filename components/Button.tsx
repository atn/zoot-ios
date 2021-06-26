import React from 'react'
import {TouchableOpacity, Text} from 'react-native'

type props = {
  onPress: () => void,
  title: string,
  color: string,
  disabled: boolean
}

export const Button = ({ onPress, title, color, disabled }: props) => (
  <TouchableOpacity activeOpacity={0.6} disabled={disabled} onPress={onPress} style={{backgroundColor: color, borderRadius: 15, paddingVertical: 16, paddingHorizontal: 12,}}>
    <Text style={{textAlign: 'center', color: "#121212", fontWeight: 'bold'}}>{title}</Text>
  </TouchableOpacity>
);