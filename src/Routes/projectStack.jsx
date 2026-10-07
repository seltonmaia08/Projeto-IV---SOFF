import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProjectContext } from "../Context/ProjectContext";
import { useRoute } from '@react-navigation/native'

import Home from "../Screens/Home/Home";

const Stack = createNativeStackNavigator();

const ProjectStack = () => {

    const { params } = useRoute()
    const { idProject, projectName } = params

    return (
        <ProjectContext.Provider value={{ idProject, projectName }}>
            <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={Home} />
            </Stack.Navigator>
        </ProjectContext.Provider>
    )
}

export default ProjectStack;