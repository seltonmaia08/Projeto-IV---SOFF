import { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { Whistle } from "lucide-react-native";
import { Dropdown } from "react-native-element-dropdown";

import CustomText from "../Text/CustomText";
import ConfirmPopUp from "../ConfirmPopUp/ConfirmPopUp";
import { useProjectContext } from "../../Context/ProjectContext";
import { useAuth } from "../../Context/AuthContext";
import { useMembers } from "../../Hook/useMembers";
import { supabase } from "../../Utils/Supabase";

const ChamarAlguem = () => {
  const { idProject } = useProjectContext();
  const { user } = useAuth();
  const { owner, members, loading } = useMembers(idProject);

  const [etapa, setEtapa] = useState("fechado"); // "fechado" | "escolhendo" | "confirmando"
  const [participante, setParticipante] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Unifica dono e participantes conforme a estrutura de useMembers
  const todosMembros = [
    ...(owner ? [{ idUser: owner.idUser, userName: owner.userName, cargo: owner.cargo }] : []),
    ...members.map((m) => ({
      idUser: m.idUser,
      userName: m.User?.userName || m.User?.name || "Sem nome",
      cargo: m.cargo || "Participante",
    })),
  ];

  // Filtra para não permitir chamar a si mesmo
  const listarParaChamar = todosMembros
    .filter((m) => m.idUser && m.idUser !== user?.id)
    .map((m) => ({
      label: m.userName,
      value: m.idUser,
      funcao: m.cargo,
    }));

  const fecharPopUp = () => {
    setParticipante(null);
    setMensagem("");
    setEtapa("fechado");
  };

  const aoTocarChamar = () => {
    if (!participante) return;
    setEtapa("confirmando");
  };

  const confirmarChamado = async () => {
    if (!participante?.value || !idProject || !user?.id) return;

    try {
      setEnviando(true);
      const remetenteNome =
        user?.user_metadata?.name ||
        user?.user_metadata?.userName ||
        user?.email?.split("@")[0] ||
        "Colega de equipe";

      // Salva no Supabase na tabela Call
      const { error } = await supabase.from("Call").insert([
        {
          idProject: idProject,
          idCaller: user.id,
          callerName: remetenteNome,
          idCalled: participante.value,
          message: mensagem.trim(),
          status: "pendente",
        },
      ]);

      if (error) throw error;

      Alert.alert("Sucesso!", `Chamado enviado para ${participante.label}.`);
      fecharPopUp();
    } catch (err) {
      console.error("Erro ao enviar chamado:", err);
      Alert.alert("Erro", "Não foi possível enviar o chamado.");
      setEtapa("escolhendo");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {/* Botão flutuante do Apito */}
      <TouchableOpacity
        style={styles.botaoFlutuante}
        activeOpacity={0.8}
        onPress={() => setEtapa("escolhendo")}
      >
        <Whistle size={32} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Modal para Escolher Participante */}
      <Modal
        visible={etapa === "escolhendo"}
        transparent={true}
        animationType="fade"
        onRequestClose={fecharPopUp}
      >
        <BlurView style={styles.overlay} intensity={40} tint="dark">
          <View style={styles.popUp}>
            <CustomText style={styles.tituloPopUp}>Chamar Alguém</CustomText>

            {loading ? (
              <ActivityIndicator color="#DA9304" />
            ) : (
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.textoDropdown}
                selectedTextStyle={styles.textoDropdown}
                data={listarParaChamar}
                labelField="label"
                valueField="value"
                placeholder="Escolher um participante"
                value={participante ? participante.value : null}
                onChange={(item) => setParticipante(item)}
                containerStyle={styles.listaDropdown}
                activeColor="#555555"
                iconColor="#F0EADE"
                renderItem={(item) => (
                  <View style={styles.itemLista}>
                    <CustomText style={styles.nomeItem}>{item.label}</CustomText>
                    <View style={styles.etiqueta}>
                      <CustomText style={styles.textoEtiqueta}>{item.funcao}</CustomText>
                    </View>
                  </View>
                )}
              />
            )}

            <TextInput
              style={styles.campoMensagem}
              placeholder="Escrever uma mensagem (opcional)..."
              placeholderTextColor="#F0EADE99"
              value={mensagem}
              onChangeText={setMensagem}
              multiline={true}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[
                styles.botaoChamar,
                (!participante || enviando) && styles.botaoDesativado,
              ]}
              activeOpacity={0.8}
              onPress={aoTocarChamar}
              disabled={!participante || enviando}
            >
              {enviando ? (
                <ActivityIndicator color="#F0EADE" />
              ) : (
                <>
                  <CustomText style={styles.textoChamar}>CHAMAR</CustomText>
                  <Whistle size={22} color="#F0EADE" />
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoCancelar} onPress={fecharPopUp}>
              <CustomText style={styles.textoCancelar}>Cancelar</CustomText>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      {/* Modal de Confirmação antes de disparar */}
      <ConfirmPopUp
        visivel={etapa === "confirmando"}
        mensagem={`Tem certeza que quer chamar ${participante?.label}?`}
        aoConfirmar={confirmarChamado}
        aoCancelar={() => setEtapa("escolhendo")}
      />
    </View>
  );
};

export default ChamarAlguem;

const styles = StyleSheet.create({
  botaoFlutuante: {
    position: "absolute",
    right: 10,
    bottom: 8,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#DA9304",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    zIndex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  popUp: {
    width: 330,
    backgroundColor: "#242424",
    borderRadius: 25,
    padding: 16,
    gap: 12,
  },
  tituloPopUp: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F0EADE",
    textAlign: "center",
    marginBottom: 4,
  },
  dropdown: {
    height: 50,
    backgroundColor: "#313131",
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  textoDropdown: {
    fontSize: 15,
    color: "#F0EADE",
  },
  listaDropdown: {
    backgroundColor: "#313131",
    borderRadius: 15,
    borderWidth: 0,
    overflow: "hidden",
  },
  itemLista: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  nomeItem: {
    fontSize: 15,
    color: "#F0EADE",
  },
  etiqueta: {
    backgroundColor: "#DA9304",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  textoEtiqueta: {
    fontSize: 11,
    color: "#F0EADE",
  },
  campoMensagem: {
    height: 90,
    backgroundColor: "#313131",
    borderRadius: 15,
    padding: 12,
    fontSize: 15,
    color: "#F0EADE",
  },
  botaoChamar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 50,
    backgroundColor: "#DA9304",
    borderRadius: 15,
  },
  botaoDesativado: {
    opacity: 0.4,
  },
  textoChamar: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F0EADE",
    letterSpacing: 2,
  },
  botaoCancelar: {
    alignItems: "center",
    paddingVertical: 6,
  },
  textoCancelar: {
    color: "#DAD0B7",
    fontSize: 13,
  },
});
