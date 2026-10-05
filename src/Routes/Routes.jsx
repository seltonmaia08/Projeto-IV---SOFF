import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen'

import Dashboard from "../Screens/Projects_dashboard/Dashboard";
import Home from "../Screens/Home/Home";

SplashScreen.preventAutoHideAsync() // Previne o que a SplashScreen suma antes do carregamento das fontes
const Stack = createNativeStackNavigator();

const Routes = () => {

    // Carrega os arquivos da font
    const [loaded, error] = useFonts({
        'Alexandria-Bold': require('../../assets/fonts/Alexandria-Bold.ttf'),
        'Alexandria-Light': require('../../assets/fonts/Alexandria-Light.ttf'),
        'Alexandria-Medium': require('../../assets/fonts/Alexandria-Medium.ttf'),
        'Alexandria-Regular': require('../../assets/fonts/Alexandria-Regular.ttf'),
        'Alexandria-SemiBold': require('../../assets/fonts/Alexandria-SemiBold.ttf'),
    })

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync()
        }
    }, [loaded, error])

    if (!loaded && !error) return null

    return (
            <Stack.Navigator initialRouteName="Dashboard" screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontFamily: 'Alexandria-Bold',
                    fontSize: 18
                },
                headerShown: false
            }}>
                <Stack.Screen name="Dashboard" component={Dashboard}/>
                <Stack.Screen name="Home" component={Home} />
            </Stack.Navigator>
    )
}

export default Routes;