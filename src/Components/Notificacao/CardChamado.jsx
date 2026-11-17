import { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Whistle, ChevronDown, ChevronUp } from "lucide-react-native";

import CustomText from "../Text/CustomText";

const LIMITE_MENSAGEM_CURTA = 28;

const CardChamado = ({ chamado, aoLer }) => {
  const [aberto, setAberto] = useState(false);
  const temMensagem = Boolean(chamado.mensagem && chamado.mensagem.trim());

  const mensagemLonga =
    temMensagem &&
    (chamado.mensagem.trim().length > LIMITE_MENSAGEM_CURTA ||
      chamado.mensagem.includes("\n"));

  const aoTocar = () => {
    if (!chamado.lido) aoLer();

    if (mensagemLonga) setAberto(!aberto);
  };

  return (
    <TouchableOpacity
      style={[styles.card, mensagemLonga && styles.cardLongo]}
      activeOpacity={0.8}
      onPress={aoTocar}
    >
      <Whistle size={30} color="#242424" style={styles.icone} />

      <View style={styles.textos}>
        <CustomText style={styles.titulo}>
          <CustomText style={styles.nome}>{chamado.remetente}</CustomText> está
          te chamando!
        </CustomText>

        {temMensagem && (
          <CustomText
            style={styles.mensagem}
            numberOfLines={aberto ? undefined : 1}
          >
            {chamado.mensagem.trim()}
          </CustomText>
        )}
      </View>

      {!chamado.lido && <View style={styles.bolinha} />}

      {mensagemLonga && (
        <View style={styles.setinha}>
          {aberto ? (
            <ChevronUp size={20} color="#242424" />
          ) : (
            <ChevronDown size={20} color="#242424" />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CardChamado;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#DAD0B7",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 12,
  },
  cardLongo: {
    paddingBottom: 34,
  },
  icone: {
    marginTop: 2,
  },
  textos: {
    flex: 1,
  },
  titulo: {
    fontSize: 16,
    color: "#242424",
  },
  nome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#242424",
  },
  mensagem: {
    fontSize: 13,
    color: "#242424",
    marginTop: 2,
  },
  setinha: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bolinha: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#DA9304",
    marginTop: 4,
  },
});
