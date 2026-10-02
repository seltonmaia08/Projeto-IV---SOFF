import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen'

import Home from "../Screens/Home_screens/Home";
import Dashboard from "../Screens/Projects_dashboard/Dashboard";

const Stack = createNativeStackNavigator();

const Routes = () => {

    return (
    <Stack.Navigator initialRouteName="Dashboard" screenOptions={{
            headerTitleAlign: 'center',
            headerTitleStyle: {
                fontFamily: 'Alexandria-Bold',
                fontSize: 18
            },
            headerShown: false
    }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Dashboard" component={Dashboard}/>
        </Stack.Navigator>
    )
}

export default Routes;