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

const ScenesList = () => {
  const [isActive, setIsActive] = useState(false);
  const [gerandoPdf, setGerandoPdf] = useState(false);

  const { idProject, projectName } = useProjectContext();
  const { scenes, loading, refetch } = useScenes(idProject);
  console.log(idProject);

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

  useEffect(() => {
    refetch();
  }, [idProject]);

  return (
    <View style={styles.container}>
      <CustomText style={styles.label}>Lista de Cenas</CustomText>
      {/* <BackgroundGradient> */}
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size={"large"} color={"#EF5625"} />
        ) : (
          <FlatList
            style={{ width: "100%" }}
            data={scenes}
            renderItem={({ item }) => <ListComponent item={item} />}
            keyExtractor={(item) => item.idScene}
          />
        )}

        <AddSceneList onPress={verifyStateActive} onChange={setIsActive} />
        <GerarPDF
          onPress={aoTocarGerarPdf}
          desativado={semCenas}
          carregando={gerandoPdf}
        />
      </View>
      {isActive && (
        <CreateItemList
          setIsActive={setIsActive}
          refetch={refetch}
          idProject={idProject}
        />
      )}
      {/* </BackgroundGradient> */}
    </View>
  );
};

export default ScenesList;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    marginBottom: 10,
  },
  card: {
    width: "100%",
    backgroundColor: "#313131",
    borderColor: "#EF5625",
    borderWidth: 2,
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
