import React, { useContext } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';

import { SideMenuContent } from '../components';
import { 
  Home, 
  TrainingDetails, 
  LoginScreen, 
  RegisterScreen, 
  Landing,
  Contacts,
  TrainingCreator,
  TrainingEditor,
  ExerciseDetails,
  UserTrainings, 
} from '../screens';
import { AuthContext } from '../context';
import { COLORS, SIZES, SHADOWS, assets } from "../constants";


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const theme = {...DefaultTheme, colors: { ...DefaultTheme.colors, background: 'transparent'}}

const Navigator = () => {

  const { authData, authFunctions } = useContext(AuthContext)

  return (
    <NavigationContainer theme={theme}>
      {authData.isSignedIn ? <AppNavigator/> : <AuthNavigator/> }
    </NavigationContainer>
  )
}

const AppNavigator = () => {

  const { authData, authFunctions } = useContext(AuthContext)

  return (
    <Drawer.Navigator
      screenOptions={{ 
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.cyan,
        drawerActiveTintColor: COLORS.white,
        drawerInactiveTintColor: COLORS.primary,
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
          // fontFamily: 'Roboto-Medium',
        },
      }}
      backBehavior='history'
      drawerContent={(props) => (
        <SideMenuContent 
          onPressLogout={() => authFunctions.logoutUser()} 
          {...props}
        />
      )}
    >
      <Drawer.Screen
        name="Home" 
        component={Home} 
        options={{
          drawerIcon: ({color}) => (
            <Ionicons name="home-outline" size={22} color={color} />
          ),
        }} 
      />
      <Drawer.Screen 
        name="Contacts" 
        component={Contacts} 
        options={{
          drawerIcon: ({ color }) => (
              <Ionicons name="people-outline" size={22} color={color} />
            ),
          }}
      />
      <Drawer.Screen
        name="Create Training"
        component={TrainingCreator}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="barbell-outline" size={22} color={color} />
          ),
        }}
      />

      {/* ----- Routes Hidden from side menu ----- */}

      <Drawer.Screen 
        name="TrainingDetails" 
        component={TrainingDetails}
        options={{
          drawerItemStyle: { height: 0 }
        }} 
      />
      <Drawer.Screen 
        name="TrainingEditor" 
        component={TrainingEditor}
        options={{
          drawerItemStyle: { height: 0 }
        }} 
      />
      <Drawer.Screen 
        name="ExerciseDetails" 
        component={ExerciseDetails}
        options={{
          drawerItemStyle: { height: 0 }
        }} 
      />
      <Drawer.Screen 
        name="UserTrainings" 
        component={UserTrainings}
        options={{
          drawerItemStyle: { height: 0 }
        }} 
      />
    </Drawer.Navigator>
  )
}

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      {/* <Stack.Screen name="LandingScreen" component={Landing} /> */}
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    </Stack.Navigator>
  )
}

export default Navigator
