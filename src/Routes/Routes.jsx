import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "../Screens/Home/Home";

const Stack = createNativeStackNavigator()

const Routes = () => {

    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    )
}

export default Routes