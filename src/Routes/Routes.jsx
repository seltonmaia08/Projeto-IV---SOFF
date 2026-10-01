import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../Screens/Home_screens/Home";
import Dashboard from "../Screens/Projects_dashboard/Dashboard";

const Stack = createNativeStackNavigator();

const Routes = () => {
    return (
        <Stack.Navigator initialRouteName="Dashboard" screenOptions={{headerShown: false, contentStyle: { backgroundColor: "#313131" }}}>
            <Stack.Screen name="Home" component={Home}/>
            <Stack.Screen name="Dashboard" component={Dashboard}/>
        </Stack.Navigator>
    )
}

export default Routes;