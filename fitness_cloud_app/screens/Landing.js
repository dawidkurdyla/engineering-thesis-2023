import React, { useContext, useEffect } from 'react'
import { View, Text } from 'react-native'

import { AuthContext } from '../context';
import { WideButton} from '../components/Button'

const Landing = ({ navigation }) => {
  const { authData, authFunctions } = useContext(AuthContext);

  useEffect(() => {
    authFunctions.refreshTokens()
    .then( (res) => {
    })
    .catch((err) => {
      navigation.navigate('LoginScreen');
    })
  })



  return (
    <View>
      <Text>Landing</Text>
      <WideButton handlePress={() => 
        authFunctions.refreshTokens()
        .then( (res) => {
        })
        .catch((err) => {
          navigation.navigate('LoginScreen');
        })
      }/>
    </View>
  )
}

export default Landing
