import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import { useEffect, useState } from "react";

import BackgroundGradient from "../BackgroundGradient/BackgroundGradient";
import ListComponent from "./ListComponent";
import CustomText from "../Text/CustomText";
import AddSceneList from "../Buttons/AddSceneList";
import GerarPDF from "../Buttons/GerarPDF";
import CreateItemList from "./CreateItemScene";

import { useProjectContext } from "../../Context/ProjectContext";
import { useScenes } from "../../Hook/useScenes";
import { gerarPdfCenas } from "../../Utils/gerarPdfCenas";
import { scenesListService } from "../../Services/api";
import ConfirmacaoPopUp from "../ConfirmPopUp/ConfirmacaoPopUp";

const ScenesList = () => {
  const [isActive, setIsActive] = useState(false);
  const [gerandoPdf, setGerandoPdf] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sceneToDelete, setSceneToDelete] = useState(null);

  const { idProject, projectName } = useProjectContext();
  const { scenes, loading, refetch } = useScenes(idProject);



  const semCenas = scenes.length === 0;
  const verifyStateActive = () => {
    setIsActive(!isActive);
  };

  const aoTocarGerarPdf = async () => {
    if (semCenas) {
      Alert.alert(
        "Nenhuma cena cadastrada",
        "Adicione pelo menos uma cena para gerar o PDF.",
      );
      return;
    }

    if (gerandoPdf) return;

    try {
      setGerandoPdf(true);
      await gerarPdfCenas(idProject, projectName);
    } finally {
      setGerandoPdf(false);
    }
  };

  // Renderiza um popup de confirmação de deleção
  const handleDelete = (id) => {
    setSceneToDelete(id);
    setIsModalVisible(true);
  };

  const confirmarDelecao = async () => {
    if (!sceneToDelete) return;

    try {
      await scenesListService.delete(sceneToDelete, 'idScenes');
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
  }, [idProject]);

  return (
    <View style={styles.container}>
      <CustomText style={styles.label}>Lista de Cenas</CustomText>
      {/* <BackgroundGradient> */}
      <View style={styles.card}>
        {loading ? (
          <View style={[styles.card, {justifyContent: 'center', alignItems: 'center', gap: 10}]}>
            <ActivityIndicator size={"large"} color={"#EF5625"} />
            <CustomText>Carregando...</CustomText>
          </View>
        ) : 

        semCenas ?
        (<CustomText style={{ textAlign: 'center', margin: 10}}>Sem cenas no momento.</CustomText>)
        :
      //   scenes.map((item) => <ListComponent
      //                           key={item.idScenes}
      //                           item={item}
      //                           deleteScene={() => handleDelete(item.idScenes)}
      //                           />
      // )
        (
          <FlatList
            style={{ width: '100%', maxHeight: 400, borderRadius: 15 }}
            data={scenes}
            renderItem={({ item }) => <ListComponent item={item} deleteScene={() => handleDelete(item.idScenes)} />}
            keyExtractor={(item) => item.idScenes}
            scrollEnabled={true}
            showsVerticalScrollIndicator={true}
            persistentScrollbar={true}
            nestedScrollEnabled={true}
          />
        )
        }

      </View>
        <AddSceneList title={"ADICIONAR CENA"} onPress={verifyStateActive} onChange={setIsActive} />
        <GerarPDF
          onPress={aoTocarGerarPdf}
          desativado={semCenas}
          carregando={gerandoPdf}
        />
      {isActive && (
        <CreateItemList
          setIsActive={setIsActive}
          refetch={refetch}
          idProject={idProject}
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

export default ScenesList;

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
