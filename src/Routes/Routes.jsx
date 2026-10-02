import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen'

import Home from "../Screens/Home/Home";

import Home from "../Screens/Home/Home";
import Home from "../Screens/Home_screens/Home";
import Dashboard from "../Screens/Projects_dashboard/Dashboard";

const Stack = createNativeStackNavigator();

const Routes = () => {

    return (
            <Stack.Navigator initialRouteName="Home" screenOptions={{
                headerTitleAlign: 'center',
                headerTitleStyle: {
                    fontFamily: 'Alexandria-Bold',
                    fontSize: 18
                }
            }}>
                <Stack.Screen name="Home" component={Home} />
            </Stack.Navigator>
        <Stack.Navigator initialRouteName="Dashboard" screenOptions={{headerShown: false, contentStyle: { backgroundColor: "#313131" }}}>
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="Dashboard" component={Dashboard}/>
        </Stack.Navigator>
    )
}

export default Routes;