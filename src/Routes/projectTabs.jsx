import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Screens/Home/Home";
import EmBreve from "../Screens/EmBreve/EmBreve";

import Continuidade from "../Screens/Continuidade/Continuidade";
import Details from "../Screens/Details/Details";
import MenuNavegacao from "../Components/MenuNavegacao/MenuNavegacao";
import Membros from "../Screens/Details/Membros";

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
        },
        headerShown: false
       }}
    >
      <Tab.Screen name="Detalhes" component={Details} />
      <Tab.Screen name="Notificacoes" component={EmBreve} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Continuidade" component={Continuidade} />
      <Tab.Screen name="Departamentos" component={EmBreve} />
    </Tab.Navigator>
  );
};
export default ProjectTabs;