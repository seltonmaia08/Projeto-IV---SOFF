import { useState } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Pressable,
  TextInput,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";
import { Whistle } from "lucide-react-native";
import { Dropdown } from "react-native-element-dropdown";

import CustomText from "../Text/CustomText";
import ConfirmPopUp from "../ConfirmPopUp/ConfirmPopUp";
import ChamadoRecebido from "../ChamadoRecebido/ChamadoRecebido";

const PARTICIPANTES = [
  { label: "Clenda Uchôa", value: "1", funcao: "Diretora de arte" },
  { label: "Selton Maia", value: "2", funcao: "Diretor de fotografia" },
  { label: "Samuel Moreno", value: "3", funcao: "Diretor de áudio" },
];

const NOME_USUARIO = "John";

const ChamarAlguem = () => {
  const [etapa, setEtapa] = useState("fechado");

  const [participante, setParticipante] = useState(null);

  const [mensagem, setMensagem] = useState("");

  const fecharPopUp = () => setEtapa("fechado");

  const aoTocarChamar = () => {
    if (participante === null) return;
    setEtapa("confirmando");
  };
  const cancelarChamado = () => setEtapa("escolhendo");
  const confirmarChamado = () => setEtapa("recebido");
  const fecharChamadoRecebido = () => {
    setParticipante(null);
    setMensagem("");
    setEtapa("fechado");
  };

  return (
    <>
      <TouchableOpacity
        style={styles.botaoFlutuante}
        activeOpacity={0.8}
        onPress={() => setEtapa("escolhendo")}
      >
        <Whistle size={32} color="#FFFFFF" />
      </TouchableOpacity>
      <Modal
        visible={etapa === "escolhendo"}
        transparent={true}
        animationType="fade"
        onRequestClose={fecharPopUp}
      >
        <BlurView style={styles.overlay} intensity={40} tint="dark">
          <Pressable style={StyleSheet.absoluteFill} onPress={fecharPopUp} />

          <View style={styles.popUp}>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.textoDropdown}
              selectedTextStyle={styles.textoDropdown}
              data={PARTICIPANTES}
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
                    <CustomText style={styles.textoEtiqueta}>
                      {item.funcao}
                    </CustomText>
                  </View>
                </View>
              )}
            />

            <TextInput
              style={styles.campoMensagem}
              placeholder="Escrever uma mensagem..."
              placeholderTextColor="#F0EADE99"
              value={mensagem}
              onChangeText={setMensagem}
              multiline={true}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={[
                styles.botaoChamar,
                participante === null && styles.botaoDesativado,
              ]}
              activeOpacity={0.8}
              onPress={aoTocarChamar}
            >
              <CustomText style={styles.textoChamar}>CHAMAR</CustomText>
              <Whistle size={22} color="#F0EADE" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      <ConfirmPopUp
        visivel={etapa === "confirmando"}
        mensagem={`Tem certeza que quer chamar ${participante?.label}?`}
        aoConfirmar={confirmarChamado}
        aoCancelar={cancelarChamado}
      />

      <ChamadoRecebido
        visivel={etapa === "recebido"}
        remetente={NOME_USUARIO}
        mensagem={mensagem}
        aoFechar={fecharChamadoRecebido}
      />
    </>
  );
};

export default ChamarAlguem;

const styles = StyleSheet.create({
  botaoFlutuante: {
    position: "absolute",
    right: 0,
    bottom: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EF5625",
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
    backgroundColor: "#F0EADE",
    borderRadius: 25,
    padding: 14,
    gap: 12,
  },
  dropdown: {
    height: 50,
    backgroundColor: "#313131",
    borderRadius: 15,
    paddingHorizontal: 15,
  },
  textoDropdown: {
    fontSize: 16,
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
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  nomeItem: {
    fontSize: 15,
    color: "#F0EADE",
  },
  etiqueta: {
    backgroundColor: "#F58A4B",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  textoEtiqueta: {
    fontSize: 11,
    color: "#F0EADE",
  },
  campoMensagem: {
    height: 100,
    backgroundColor: "#313131",
    borderRadius: 15,
    padding: 15,
    fontSize: 16,
    color: "#F0EADE",
  },
  botaoChamar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 54,
    backgroundColor: "#EF5625",
    borderRadius: 15,
    zIndex: 10
  },
  botaoDesativado: {
    opacity: 0.5,
  },
  textoChamar: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F0EADE",
    letterSpacing: 2,
  },
});
