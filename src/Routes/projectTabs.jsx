import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Screens/Home/Home";
import EmBreve from "../Screens/EmBreve/EmBreve";
import Continuidade from "../Screens/Continuidade/Continuidade";
import MenuNavegacao from "../Components/MenuNavegacao/MenuNavegacao";

const Tab = createBottomTabNavigator();

const ProjectTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <MenuNavegacao {...props} />}
      backBehavior="initialRoute"
      screenOptions={{ 
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#313131'
        }
       }}
    >
      <Tab.Screen name="Detalhes" component={EmBreve} />
      <Tab.Screen name="Notificacoes" component={EmBreve} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Continuidade" component={Continuidade} />
      <Tab.Screen name="Departamentos" component={EmBreve} />
    </Tab.Navigator>
  );
};
export default ProjectTabs;