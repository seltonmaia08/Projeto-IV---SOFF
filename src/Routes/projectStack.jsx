import { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ProjectContext } from "../Context/ProjectContext";
import { useRoute } from "@react-navigation/native";
import { ChamadosProvider } from "../Context/ChamadosContext";

import Home from "../Screens/Home/Home";
import ProjectTabs from "./projectTabs";

import NotificationWatcher from "../Components/Alerta/Alerta";

const Stack = createNativeStackNavigator();

const ProjectStack = () => {
  const { params = {} } = useRoute();
  const idProject = params?.idProject;
  const [projectName, setProjectName] = useState(params?.projectName);
  const [producer, setProducer] = useState(params?.producer);

  useEffect(() => {
    if (params?.projectName) setProjectName(params.projectName);
  }, [params?.projectName]);

  useEffect(() => {
    if (params?.producer) setProducer(params.producer);
  }, [params?.producer]);

  return (
    <>
      <NotificationWatcher idProject={idProject} />

      <ProjectContext.Provider
        value={{
          idProject,
          projectName,
          producer,
          setProjectName,
          setProducer,
        }}
      >
        <ChamadosProvider>
          <Stack.Navigator
            initialRouteName="ProjectTabs"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="ProjectTabs" component={ProjectTabs} />
          </Stack.Navigator>
        </ChamadosProvider>
      </ProjectContext.Provider>
    </>
  );
};

export default ProjectStack;
