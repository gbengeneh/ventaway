import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { theme } from '@/constants/theme'

const Loading = ({size='large', color="blue"}) => {
  return (
    <View style={{ justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator  size={size} color={color} />
    </View>
  ) 
}

export default Loading