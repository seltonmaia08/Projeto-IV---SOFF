import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import CustomText from "../Text/CustomText";
import PopUpTarefa from "./PopUpTarefa";
import AddSceneList from "../Buttons/AddSceneList";

import { useProjectContext } from "../../Context/ProjectContext";
import { useTasks } from "../../Hook/useToDo";
import CardTarefa from "./CardTarefa";
import { toDoListService } from "../../Services/api";

const ToDoList = ({ idDepartment }) => {
  console.log(idDepartment)
  const [isActive, setIsActive] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState(null);

  const { idProject, projectName } = useProjectContext();
  const { tasks, loading, refetch } = useTasks(idDepartment)



  const semTasks = tasks.length === 0;
  const verifyStateActive = () => {
    setIsActive(!isActive);
  };

  console.log(idProject)

  // Renderiza um popup de confirmação de deleção
  const handleDelete = (id) => {
    setSceneToDelete(id);
    setIsModalVisible(true);
  };

  const confirmarDelecao = async () => {
    if (!sceneToDelete) return;

    try {
      await toDoListService.delete(sceneToDelete, 'idTask');
      refetch();
    } catch (err) {
      console.log("Erro ao deletar cena:", err);
    } finally {
      setIsModalVisible(false);
      setSceneToDelete(null);
    }
  };

  const cancelarDelecao = () => {
    setIsModalVisible(false);
    setSceneToDelete(null);
  };

  useEffect(() => {
    refetch();
  }, [idDepartment]);

  return (
    <View style={styles.container}>
       <CustomText style={styles.label}>Tarefas</CustomText>
       {/* <BackgroundGradient> */}
       <View style={styles.card}>
         {loading ? (
           <View style={[styles.card, {justifyContent: 'center', alignItems: 'center', gap: 10}]}>
             <ActivityIndicator size={"large"} color={"#EF5625"} />
             <CustomText>Carregando...</CustomText>
           </View>
         ) : 

         semTasks ?
         (<CustomText style={{ textAlign: 'center', margin: 10}}>Sem tarefas no momento.</CustomText>)
         :
         (
           <FlatList
             style={{ width: '100%', maxHeight: 400, minHeight: 60, borderRadius: 15 }}
             data={tasks}
             renderItem={({ item }) => <CardTarefa item={item} deleteScene={() => handleDelete(item.idTask)} />}
             keyExtractor={(item) => item.idTask}
             scrollEnabled={true}
             showsVerticalScrollIndicator={true}
             persistentScrollbar={true}
             nestedScrollEnabled={true}
           />
         )
         }

         <AddSceneList title={"ADICIONAR TAREFA"} onPress={verifyStateActive} onChange={setIsActive} />
       </View>
      {
       isActive && (
         <PopUpTarefa
           setIsActive={setIsActive}
           refetch={refetch}
           idProject={idProject}
           idDepartment={idDepartment}
         />
       )}

       {

         isModalVisible && <ConfirmacaoPopUp
           visivel={true}
           aoCancelar={cancelarDelecao}
           aoExecutar={confirmarDelecao}
           mensagem={'esta cena?'}
         />

       }
       {/* </BackgroundGradient> */}
     </View>
   );
 };

 export default ToDoList;

 const styles = StyleSheet.create({
   container: {
     flex: 1,
     marginBottom: 10,
   },
   card: {
     width: "100%",
     maxHeight: 450,
     backgroundColor: "#313131",
     borderRadius: 15,
     padding: 10,
   },
   label: {
     marginBottom: 10,
     fontSize: 18,
   },
   list: {
     width: "100%",
   },
 });
