import { useEffect } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Vibration,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { X, Whistle } from "lucide-react-native";

import CustomText from "../Text/CustomText";

// fator: qquants vezes a largura da tela o círculo tem.
const ANEIS = [
  { fator: 2.6, cor: "#2E2623" },
  { fator: 2.1, cor: "#5C2C1B" },
  { fator: 1.65, cor: "#8F3D1F" },
  { fator: 1.25, cor: "#C14A22" },
  { fator: 0.95, cor: "#EF5625" },
];

const ChamadoRecebido = ({ visivel, remetente, mensagem, aoFechar }) => {
  // responsividade  tela de aparelhos diferentes
  const { width } = useWindowDimensions();

  // vibração
  useEffect(() => {
    if (visivel) {
      Vibration.vibrate(500);
    }
  }, [visivel]);

  return (
    <Modal
      visible={visivel}
      transparent={false}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={aoFechar}
    >
      <View style={styles.fundo}>
        {ANEIS.map((anel) => {
          const tamanho = width * anel.fator;
          return (
            <View
              key={anel.fator}
              style={{
                position: "absolute",
                width: tamanho,
                height: tamanho,
                borderRadius: tamanho / 2,
                backgroundColor: anel.cor,
              }}
            />
          );
        })}

        <TouchableOpacity
          style={styles.botaoX}
          onPress={aoFechar}
          activeOpacity={0.6}
        >
          <X size={28} color="#F0EADE" />
        </TouchableOpacity>

        <View style={styles.conteudo}>
          <View style={styles.linhaTitulo}>
            <Whistle size={30} color="#F0EADE" />
            <CustomText style={styles.titulo}>CHAMADO!</CustomText>
          </View>

          <CustomText style={styles.subtitulo}>
            {remetente} está te chamando.
          </CustomText>

          {mensagem ? (
            <View style={styles.caixaMensagem}>
              <CustomText style={styles.textoMensagem}>{mensagem}</CustomText>
            </View>
          ) : null}

          <TouchableOpacity
            style={styles.botaoOk}
            onPress={aoFechar}
            activeOpacity={0.7}
          >
            <CustomText style={styles.textoOk}>Ok!</CustomText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ChamadoRecebido;

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    overflow: "hidden",
  },
  botaoX: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  conteudo: {
    width: "80%",
    alignItems: "center",
    gap: 12,
  },
  linhaTitulo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F0EADE",
  },
  subtitulo: {
    fontSize: 16,
    color: "#F0EADE",
  },
  caixaMensagem: {
    width: "100%",
    backgroundColor: "#F0EADE",
    borderRadius: 15,
    padding: 15,
  },
  textoMensagem: {
    fontSize: 14,
    color: "#313131",
    textAlign: "center",
  },
  botaoOk: {
    width: "100%",
    height: 44,
    backgroundColor: "#F0EADE",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  textoOk: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#313131",
  },
});
