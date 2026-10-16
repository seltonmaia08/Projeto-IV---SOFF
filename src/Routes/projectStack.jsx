import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ProjectContext } from "../Context/ProjectContext";
import { useRoute } from "@react-navigation/native";

import Home from "../Screens/Home/Home";
import EmBreve from "../Screens/EmBreve/EmBreve";
import MenuNavegacao from "../Components/MenuNavegacao/MenuNavegacao";

const Tab = createBottomTabNavigator();

const ProjectStack = () => {
  const { params } = useRoute();
  const { idProject, projectName } = params;

  return (
    <ProjectContext.Provider value={{ idProject, projectName }}>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={(props) => <MenuNavegacao {...props} />}
        backBehavior="initialRoute"
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen name="Detalhes" component={EmBreve} />
        <Tab.Screen name="Notificacoes" component={EmBreve} />
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Continuidade" component={EmBreve} />
        <Tab.Screen name="Departamentos" component={EmBreve} />
      </Tab.Navigator>
    </ProjectContext.Provider>
  );
};

export default ProjectStack;
