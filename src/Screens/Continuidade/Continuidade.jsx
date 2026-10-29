import {
  ActivityIndicator,
  Alert,
  View,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import { BlurView } from "expo-blur";

import CustomText from "../../Components/Text/CustomText";
import ButtonAdd from "../../Components/Buttons/ButtonAdd";
import CardAddNote from "../../Components/Continuity/CardAddNote";
import { useContinuity } from "../../Hook/useContinuity";
import RenderItemContinuity from "../../Components/Continuity/RenderItemContinuity";
import { useProjectContext } from "../../Context/ProjectContext";
import ConfirmacaoPopUp from "../../Components/ConfirmPopUp/ConfirmacaoPopUp";
import { continuityService } from "../../Services/api";
import { gerarPdfContinuidade } from "../../Utils/gerarPdfContinuidade";
import GerarPDF from "../../Components/Buttons/GerarPDF";
import Top from "../TopAba/Top";

const Continuidade = () => {
  const [isActive, setIsActive] = useState(false);
  const [createNote, setCreateNote] = useState(false);
  const [continuityToDelete, setContinuityToDelete] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);

  const closeNote = () => setCreateNote(false);
  const toggleModal = () => setIsActive((prev) => !prev);

  const { idProject, projectName } = useProjectContext();
  const { continuity, loading, refetch } = useContinuity(idProject);
  const SemNotas = continuity.length === 0;

  const aoTocarGerarPdf = async () => {
    if (SemNotas) {
      Alert.alert(
        "Nenhuma nota de continuidade cadastrada",
        "Adicione pelo menos uma nota para gerar o PDF.",
      );
      return;
    }

    if (gerandoPdf) return;

    try {
      setGerandoPdf(true);
      await gerarPdfContinuidade(idProject, projectName);
    } finally {
      setGerandoPdf(false);
    }
  };

  const handleDelete = (id) => {
    setContinuityToDelete(id);
    setIsModalVisible(true);
  };

  const confirmarDelecao = async () => {
    if (!continuityToDelete) return;

    try {
      await continuityService.delete(continuityToDelete, "idContinuity");
      refetch();
    } catch (err) {
      console.log("Erro ao deletar cena:", err);
    } finally {
      setIsModalVisible(false);
      setContinuityToDelete(null);
    }
  };

  const cancelarDelecao = () => {
    setIsModalVisible(false);
    setContinuityToDelete(null);
  };

  // Função para fechar qualquer modal aberto
  const fecharModal = () => {
    setCreateNote(false);
    setSelectedNote(null);
  };

  useEffect(() => {
    refetch();
  }, [idProject]);

  return (
    <View style={styles.container}>
      <Top abaName={'Continuidade'} voltar={false} />
      <View style={{padding: 20, flex: 1}}>

        {loading ? (
          <View
            style={[
              styles.card,
              { justifyContent: "center", alignItems: "center", gap: 10 },
            ]}
          >
            <ActivityIndicator size={"large"} color={"#EF5625"} />
            <CustomText>Carregando...</CustomText>
          </View>
        ) : SemNotas ? (
          <CustomText style={{ textAlign: "center", margin: 10 }}>
            Sem cenas no momento.
          </CustomText>
        ) : (
          <FlatList
            style={{ width: "100%", minHeight: 40, borderRadius: 15 }}
            data={continuity}
            renderItem={({ item }) => (
              <RenderItemContinuity
                item={item}
                onPress={() => setSelectedNote(item)}
                deleteContinuity={() => handleDelete(item.idContinuity)}
              />
            )}
            keyExtractor={(item) => item.idContinuity}
            scrollEnabled={false}
          />
        )}
        {isActive ? (
          <View style={styles.menuUp}>
            <TouchableOpacity
              onPress={() => {
                setIsActive(false);
                setCreateNote(true);
              }}
              style={styles.buttonAddNota}
            >
              <CustomText style={{ color: "#242424" }}>Add nota</CustomText>
            </TouchableOpacity>
            <GerarPDF
              onPress={aoTocarGerarPdf}
              desativado={SemNotas}
              carregando={gerandoPdf}
            />
          </View>
        ) : (
          <></>
        )}

        {createNote || selectedNote !== null ? (
          <Modal
            visible={createNote || selectedNote !== null}
            transparent={true}
            animationType="fade"
            onRequestClose={fecharModal}
          >
            <BlurView style={styles.overlay} intensity={40} tint="dark">
              <CardAddNote
                closeNote={fecharModal}
                refetch={refetch}
                idProject={idProject}
                idContinuity={selectedNote?.idContinuity}
                titleContinuity={selectedNote ? selectedNote.continuityTitle : ""}
                textContinuity={selectedNote ? selectedNote.continuityText : ""}
                continuityImages={selectedNote?.continuityImages || []}
              />
            </BlurView>
          </Modal>
        ) : (
          <></>
        )}
        {isModalVisible && (
          <ConfirmacaoPopUp
            visivel={true}
            aoCancelar={cancelarDelecao}
            aoExecutar={confirmarDelecao}
            mensagem={"esta nota de continuidade?"}
          />
        )}
        <ButtonAdd isActive={isActive} onPress={toggleModal} />
      </View>
    </View>
  );
};

export default Continuidade;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menuUp: {
    backgroundColor: "#313131",
    padding: 10,
    borderRadius: 10,
    gap: 10,
    position: "absolute",
    bottom: 100,
    right: 50,
    borderColor: "#EF5625",
    borderWidth: 2,
  },
  buttonAddNota: {
    height: 58,
    width: "100%",
    backgroundColor: "#DAD0B7",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
