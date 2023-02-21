import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

import { 
  DrawerContentScrollView,
  DrawerItemList
} from '@react-navigation/drawer'
import Ionicons from '@expo/vector-icons/Ionicons';


import { CircleButton, TextButton } from './Button.js'
import { COLORS, SIZES, SHADOWS, assets } from '../constants'
import { AvatarLogo, LineDivider } from "./utils";

const {width, height} = Dimensions.get('screen');

const SideMenuContent = (props) => {
  return (
    <View style={{ flex:1 }} >
      <DrawerContentScrollView {...props}>
        <View style={styles.darkBackground}/>
        <View style={styles.whiteBackground}>
            <AvatarLogo
              image={assets.person01}
              style={styles.avatarLogo}
            />
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      
      <View style={{padding: 10, borderTopWidth:StyleSheet.hairlineWidth, borderTopColor:COLORS.gray}}>
        <TouchableOpacity
          onPress={() => props.onPressLogout()}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name='exit-outline' size={22} />
            <Text style={styles.textButton} >{"Logout"}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  darkBackground: {
    width: '100%',
    height: 100,
    backgroundColor: COLORS.primary,
    marginTop: -5,
  },
  whiteBackground: {
    width: '100%',
    height: 60,
    backgroundColor: COLORS.white,
  },
  avatarLogo: {
    width: 100,
    height: 100,
    position: 'absolute',
    left: width / 2 - 110,
    top: -50,
    elevation: 1,
  },
  textButton: {
    color: COLORS.primary,
    fontSize: 16,
    marginLeft: 5
  },
})

export default SideMenuContent