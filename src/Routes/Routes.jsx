import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen'

import Dashboard from "../Screens/Projects_dashboard/Dashboard";
import ProjectStack from "./projectStack";
import Login from "../Screens/Login/Login";
import { useAuth } from "../Context/AuthContext";
import { ActivityIndicator, View } from "react-native";
import Register from "../Screens/Register/Register";
import RedefinirSenha from "../Screens/RedefinirSenha/RedefinirSenha";

SplashScreen.preventAutoHideAsync() // Previne o que a SplashScreen suma antes do carregamento das fontes
const Stack = createNativeStackNavigator();

const Routes = () => {
    const { user, loading } = useAuth()

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

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} color="#EF5625" />
            </View>
        )
    }

    return (
        <Stack.Navigator screenOptions={{
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontFamily: 'Alexandria-Bold',
                fontSize: 18
            },
            headerShown: false
        }}>
            {
                user ?
                    <>
                        <Stack.Screen name="Dashboard" component={Dashboard} />
                        <Stack.Screen name="ProjectStack" component={ProjectStack} />
                    </>
                    :
                    <>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Register" component={Register} />
                        <Stack.Screen name="RedefinirSenha" component={RedefinirSenha} />
                    </>

            }

        </Stack.Navigator>
    )
}

export default Routes;