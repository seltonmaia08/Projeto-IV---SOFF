import { useState, useEffect } from "react";
import {
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { BlurView } from "expo-blur";

import CustomText from "../Text/CustomText";
import ButtonCancel from "../Buttons/ButtonCancel";

const PopUpTarefa = ({
  visivel,
  textoInicial = "",
  textoBotao,
  aoCancelar,
  aoConfirmar,
}) => {
  const [texto, setTexto] = useState("");

  useEffect(() => {
    if (visivel) setTexto(textoInicial);
  }, [visivel]);

  const vazio = texto.trim() === "";

  const confirmar = () => {
    if (vazio) return;
    aoConfirmar(texto.trim());
  };

  return (
    <Modal
      visible={visivel}
      transparent={true}
      animationType="fade"
      onRequestClose={aoCancelar}
    >
      <BlurView style={styles.overlay} intensity={40} tint="dark">
        <View style={styles.popUp}>
          <TextInput
            style={styles.campo}
            placeholder="Adicione uma tarefa..."
            placeholderTextColor="#5F5F5F"
            value={texto}
            onChangeText={setTexto}
            multiline={true}
            textAlignVertical="top"
          />

          <View style={styles.botoes}>
            <ButtonCancel onPress={aoCancelar} />

            <TouchableOpacity
              style={[styles.botaoPrincipal, vazio && styles.botaoDesativado]}
              activeOpacity={0.8}
              onPress={confirmar}
            >
              <CustomText style={styles.textoBotao}>{textoBotao}</CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default PopUpTarefa;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  popUp: {
    width: 330,
    backgroundColor: "#313131",
    borderRadius: 20,
    padding: 20,
    gap: 20,
  },
  campo: {
    height: 200,
    backgroundColor: "#DAD0B7",
    borderRadius: 15,
    padding: 15,
    fontSize: 15,
    color: "#242424",
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  botaoPrincipal: {
    width: "48.5%",
    height: 54,
    borderRadius: 15,
    backgroundColor: "#DAD0B7",
    justifyContent: "center",
    alignItems: "center",
  },
  botaoDesativado: {
    opacity: 0.5,
  },
  textoBotao: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#242424",
  },
});
