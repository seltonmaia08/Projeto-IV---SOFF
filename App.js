import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';

import Routes from './src/Routes/Routes'
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {

  const myDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#242424',
      text: "#DAD0B7"
    }
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={myDarkTheme}>
        <Routes />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}