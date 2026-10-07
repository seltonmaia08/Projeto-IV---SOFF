import { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronDown, ChevronUp } from "lucide-react-native";

import CustomText from "../Text/CustomText";
import ConfirmPopUp from "../ConfirmPopUp/ConfirmPopUp";

const LISTA_STATUS = [
  {
    id: "gravando",
    nome: "Gravando",
    frase: "Silêncio no set",
    cores: ["#EF5625", "#893115"],
    corBorda: "#EF5625",
  },
  {
    id: "intervalo",
    nome: "Intervalo",
    frase: "Atenção",
    cores: ["#6B675F", "#313131"],
    corBorda: "#F0EADE",
  },
  {
    id: "liberado",
    nome: "Liberado",
    frase: "Set em preparo",
    cores: ["#1B8F65", "#1B4D3A"],
    corBorda: "#28D593",
  },
];

const StatusFilmagem = () => {
  const [statusId, setStatusId] = useState("liberado");
  const [menuAberto, setMenuAberto] = useState(false);

  const [statusPendente, setStatusPendente] = useState(null);

  const statusAtual = LISTA_STATUS.find((item) => item.id === statusId);

  const alternarMenu = () => setMenuAberto(!menuAberto);

  const escolherStatus = (itemEscolhido) => {
    setMenuAberto(false);
    if (itemEscolhido.id === statusId) return;

    setStatusPendente(itemEscolhido);
  };

  const confirmarMudanca = () => {
    setStatusId(statusPendente.id);
    setStatusPendente(null);
  };

  const cancelarMudanca = () => setStatusPendente(null);

  return (
    <View style={[styles.card, { borderColor: statusAtual.corBorda }]}>
      <TouchableOpacity activeOpacity={0.8} onPress={alternarMenu}>
        <LinearGradient
          colors={statusAtual.cores}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.topo}
        >
          <View style={styles.linhaTitulo}>
            <CustomText style={styles.titulo}>{statusAtual.nome}</CustomText>
            {menuAberto ? (
              <ChevronUp size={22} color="#F0EADE" />
            ) : (
              <ChevronDown size={22} color="#F0EADE" />
            )}
          </View>

          <CustomText style={styles.frase}>{statusAtual.frase}</CustomText>
        </LinearGradient>
      </TouchableOpacity>

      {menuAberto && (
        <View style={styles.menu}>
          {LISTA_STATUS.map((item, indice) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.6}
              onPress={() => escolherStatus(item)}
              style={[styles.opcao, indice > 0 && styles.divisor]}
            >
              <CustomText style={styles.textoOpcao}>{item.nome}</CustomText>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ConfirmPopUp
        visivel={statusPendente !== null}
        titulo="Tem certeza?"
        mensagem={`Mudar o status do set para "${statusPendente?.nome}"?`}
        aoConfirmar={confirmarMudanca}
        aoCancelar={cancelarMudanca}
      />
    </View>
  );
};

export default StatusFilmagem;

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderWidth: 1.5,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
    backgroundColor: "#313131",
  },
  topo: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  linhaTitulo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F0EADE",
  },
  frase: {
    fontSize: 14,
    color: "#F0EADE",
  },
  menu: {
    backgroundColor: "#313131",
    paddingHorizontal: 20,
  },
  opcao: {
    paddingVertical: 12,
  },

  divisor: {
    borderTopWidth: 1,
    borderTopColor: "#5F5F5F",
  },
  textoOpcao: {
    fontSize: 15,
    color: "#F0EADE",
  },
});
