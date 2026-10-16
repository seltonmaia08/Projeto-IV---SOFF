import { createStackNavigator } from "@react-navigation/stack";
import { ProjectContext } from "../Context/ProjectContext";
import { useRoute } from "@react-navigation/native";

import Home from "../Screens/Home/Home";
import ProjectTabs from "./projectTabs";

const Stack = createStackNavigator()

const ProjectStack = () => {
  const { params } = useRoute();
  const { idProject, projectName } = params;

    return (
        <ProjectContext.Provider value={{ idProject, projectName }}>
            <Stack.Navigator initialRouteName="ProjectTabs" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="ProjectTabs" component={ProjectTabs}/>
            </Stack.Navigator>
        </ProjectContext.Provider>
    )
}

export default ProjectStack;