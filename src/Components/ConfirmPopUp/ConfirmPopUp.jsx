import { View, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

import CustomText from "../Text/CustomText";

const ConfirmPopUp = ({ visivel, mensagem, aoConfirmar, aoCancelar }) => {
  return (
    <Modal
      visible={visivel}
      transparent={true}
      animationType="fade"
      onRequestClose={aoCancelar}
    >
      <BlurView style={styles.overlay} intensity={40} tint="dark">
        <View style={styles.popUp}>
          <View style={styles.faixa} />

          <View style={styles.conteudo}>
            <CustomText style={styles.pergunta}>{mensagem}</CustomText>

            <View style={styles.botoes}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={aoCancelar}
                style={[styles.botao, styles.botaoNao]}
              >
                <CustomText style={styles.textoBotao}>NÃO</CustomText>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={aoConfirmar}
                style={[styles.botao, styles.botaoSim]}
              >
                <CustomText style={styles.textoBotao}>SIM</CustomText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default ConfirmPopUp;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  popUp: {
    width: 312,
    backgroundColor: "#F0EADE",
    borderRadius: 25,
    overflow: "hidden",
  },
  faixa: {
    height: 36,
    backgroundColor: "#EF5625",
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 28,
    gap: 32,
  },
  pergunta: {
    fontSize: 18,
    color: "#313131",
    textAlign: "center",
  },
  botoes: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  botao: {
    width: 120,
    height: 48,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  botaoNao: {
    backgroundColor: "#5F5F5F",
  },
  botaoSim: {
    backgroundColor: "#EF5625",
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#F0EADE",
    letterSpacing: 2,
  },
});
