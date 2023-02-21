import 'expo-dev-client';

import { StyleSheet, Text, View } from 'react-native';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';

import { AuthProvider} from './context';
import Navigator from './utils/Navigator';



const App = () => {
  return (
    <AuthProvider>
      <Navigator />
    </AuthProvider>
  );
}

export default App;