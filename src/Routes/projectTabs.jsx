import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../Screens/Home/Home";

import Continuidade from "../Screens/Continuidade/Continuidade";
import Details from "../Screens/Details/Details";
import MenuNavegacao from "../Components/MenuNavegacao/MenuNavegacao";
import Notificacao from "../Screens/Notificacoes/Notificacoes";
import Departamentos from "../Screens/Departamentos/Departamentos";

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
      <Tab.Screen name="Notificacoes" component={Notificacao} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Continuidade" component={Continuidade} />
      <Tab.Screen name="Departamentos" component={Departamentos} />
    </Tab.Navigator>
  );
};
export default ProjectTabs;