import { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronDown,
  ChevronUp,
  Radio,
  CircleCheck,
  Pause,
} from "lucide-react-native";

import CustomText from "../Text/CustomText";
import ConfirmPopUp from "../ConfirmPopUp/ConfirmPopUp";
import { useProjectContext } from "../../Context/ProjectContext";
import { projectService } from "../../Services/api";
import { supabase } from "../../Utils/Supabase";

const LISTA_STATUS = [
  {
    id: "gravando",
    nome: "Gravando",
    frase: "Silêncio no set",
    cores: ["#DA9304", "#723F04"],
    Icone: Radio,
  },
  {
    id: "intervalo",
    nome: "Intervalo",
    frase: "Atenção",
    cores: ["#6B675F", "#313131"],
    Icone: Pause,
  },
  {
    id: "liberado",
    nome: "Liberado",
    frase: "Set em preparo",
    cores: ["#1B8F65", "#1B4D3A"],
    Icone: CircleCheck,
  },
];

const StatusFilmagem = () => {
  const [statusId, setStatusId] = useState("liberado");
  const [menuAberto, setMenuAberto] = useState(false);

  const [statusPendente, setStatusPendente] = useState(null);

  const statusAtual =
    LISTA_STATUS.find((item) => item.id === statusId) || LISTA_STATUS[2];

  const Icone = statusAtual.Icone;
  const alternarMenu = () => setMenuAberto(!menuAberto);

  const { idProject } = useProjectContext();

  useEffect(() => {
    const carregarDados = async () => {
      if (!idProject) return;

      try {
        const dados = await projectService.getAllColumn("idProject", idProject);
        if (dados && dados[0]?.status) {
          setStatusId(dados[0].status);
        }
      } catch (err) {
        console.log("Erro ao buscar status do set: ", err);
      }
    };
    carregarDados();

    const canal = supabase
      .channel(`status-projeto-${idProject}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "Project",
          filter: `idProject=eq.${idProject}`,
        },
        (playload) => {
          if (playload.new && playload.new.status) {
            setStatusId(playload.new.status);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [idProject]);

  const escolherStatus = (itemEscolhido) => {
    setMenuAberto(false);
    if (itemEscolhido.id === statusId) return;

    setStatusPendente(itemEscolhido);
  };

  const confirmarMudanca = async () => {
    const novoStatus = statusPendente.id;

    setStatusId(statusPendente.id);
    setStatusPendente(null);

    try {
      await projectService.update(idProject, { status: novoStatus });
    } catch (error) {
      console.log("Erro ao salvar status no banco: ", error);
    }
  };

  const cancelarMudanca = () => setStatusPendente(null);

  return (
    <View style={styles.card}>
      <TouchableOpacity activeOpacity={0.8} onPress={alternarMenu}>
        <LinearGradient
          colors={statusAtual.cores}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.topo}
        >
          <View>
            <View style={styles.linhaTitulo}>
              <CustomText style={styles.titulo}>{statusAtual.nome}</CustomText>
              {menuAberto ? (
                <ChevronUp size={22} color="#F0EADE" />
              ) : (
                <ChevronDown size={22} color="#F0EADE" />
              )}
            </View>

            <CustomText style={styles.frase}>{statusAtual.frase}</CustomText>
          </View>

          <Icone size={48} color="#F0EADE" strokeWidth={2} />
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
    marginBottom: 15,
  },
  topo: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 15,
    overflow: "hidden",
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
    marginTop: 6,
    borderRadius: 15,
    overflow: "hidden",
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
