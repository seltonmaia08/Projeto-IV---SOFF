import {
  ActivityIndicator,
  Alert,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { BlurView } from "expo-blur";
import { Whistle } from "lucide-react-native";

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
import ChamadoRecebido from "../../Components/ChamadoRecebido/ChamadoRecebido";
import { useAuth } from "../../Context/AuthContext";
import { supabase } from "../../Utils/Supabase";

const Continuidade = () => {
  const [isActive, setIsActive] = useState(false);
  const [createNote, setCreateNote] = useState(false);
  const [continuityToDelete, setContinuityToDelete] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [gerandoPdf, setGerandoPdf] = useState(false);

  // Estados para os chamados recebidos pelo usuário
  const [chamadoAtivo, setChamadoAtivo] = useState(null); // chamado aberto em tela cheia
  const [chamadosPendentes, setChamadosPendentes] = useState([]);

  const closeNote = () => setCreateNote(false);
  const toggleModal = () => setIsActive((prev) => !prev);

  const { idProject, projectName } = useProjectContext();
  const { user } = useAuth();
  const { continuity, loading, refetch } = useContinuity(idProject);
  const SemNotas = continuity.length === 0;

  // 1. Busca os chamados pendentes recebidos pelo usuário atual
  const carregarChamados = useCallback(async () => {
    if (!idProject || !user?.id) return;

    try {
      const { data, error } = await supabase
        .from("Call")
        .select("*")
        .eq("idProject", idProject)
        .eq("idCalled", user.id)
        .eq("status", "pendente")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setChamadosPendentes(data || []);
    } catch (err) {
      console.warn("Erro ao carregar chamados recebidos:", err);
    }
  }, [idProject, user?.id]);

  // 2. Escuta novos chamados em tempo real na tela de Continuidade
  useEffect(() => {
    carregarChamados();

    if (!idProject || !user?.id) return;

    const canalChamados = supabase
      .channel(`chamados-continuidade-${idProject}-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Call",
          filter: `idCalled=eq.${user.id}`,
        },
        (payload) => {
          if (payload.new && payload.new.status === "pendente") {
            // Dispara o chamado imediatamente em tela cheia
            setChamadoAtivo(payload.new);
            setChamadosPendentes((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canalChamados);
    };
  }, [idProject, user?.id, carregarChamados]);

  // 3. Ao fechar o chamado, atualiza o status para "atendido" no Supabase
  const fecharChamado = async () => {
    if (!chamadoAtivo) return;

    try {
      await supabase
        .from("Call")
        .update({ status: "atendido" })
        .eq("idCall", chamadoAtivo.idCall);

      setChamadosPendentes((prev) =>
        prev.filter((c) => c.idCall !== chamadoAtivo.idCall)
      );
    } catch (err) {
      console.warn("Erro ao atualizar status do chamado:", err);
    } finally {
      setChamadoAtivo(null);
    }
  };

  const aoTocarGerarPdf = async () => {
    if (SemNotas) {
      Alert.alert(
        "Nenhuma nota de continuidade cadastrada",
        "Adicione pelo menos uma nota para gerar o PDF."
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

  const fecharModal = () => {
    setCreateNote(false);
    setSelectedNote(null);
  };

  useEffect(() => {
    refetch();
  }, [idProject]);

  return (
    <View style={styles.container}>
      <Top abaName={"Continuidade"} voltar={false} />
      <View style={{ padding: 20, flex: 1 }}>

        {/* Banner de Chamado Pendente caso exista algum */}
        {chamadosPendentes.length > 0 && (
          <TouchableOpacity
            style={styles.bannerChamado}
            activeOpacity={0.8}
            onPress={() => setChamadoAtivo(chamadosPendentes[0])}
          >
            <Whistle size={24} color="#DA9304" />
            <View style={{ flex: 1 }}>
              <CustomText style={styles.bannerTitulo}>
                Você foi chamado por {chamadosPendentes[0].callerName}!
              </CustomText>
              {chamadosPendentes[0].message ? (
                <CustomText style={styles.bannerMensagem} numberOfLines={1}>
                  "{chamadosPendentes[0].message}"
                </CustomText>
              ) : null}
            </View>
            <CustomText style={styles.bannerToque}>Toque para ver</CustomText>
          </TouchableOpacity>
        )}

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
            keyExtractor={(item) => item.idContinuity.toString()}
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
        ) : null}

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
        ) : null}

        {isModalVisible && (
          <ConfirmacaoPopUp
            visivel={true}
            aoCancelar={cancelarDelecao}
            aoExecutar={confirmarDelecao}
            mensagem={"esta nota de continuidade?"}
          />
        )}

        {/* Modal de Tela Cheia com Vibração ao Receber Chamado */}
        <ChamadoRecebido
          visivel={chamadoAtivo !== null}
          remetente={chamadoAtivo?.callerName || "Alguém"}
          mensagem={chamadoAtivo?.message || ""}
          aoFechar={fecharChamado}
        />

        <ButtonAdd isActive={isActive} onPress={toggleModal} />
      </View>
    </View>
  );
};

export default Continuidade;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },
  bannerChamado: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#313131",
    borderColor: "#DA9304",
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    marginBottom: 15,
  },
  bannerTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F0EADE",
  },
  bannerMensagem: {
    fontSize: 12,
    color: "#DAD0B7",
  },
  bannerToque: {
    fontSize: 11,
    color: "#DA9304",
    fontWeight: "bold",
  },
  menuUp: {
    backgroundColor: "#313131",
    padding: 10,
    borderRadius: 20,
    gap: 10,
    position: "absolute",
    bottom: 100,
    right: 50,
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
  card: {
    backgroundColor: "#313131",
    borderRadius: 15,
    padding: 20,
  },
});
