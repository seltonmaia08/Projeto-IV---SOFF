import { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Whistle } from "lucide-react-native";

import CustomText from "../Text/CustomText";
import { useProjectContext } from "../../Context/ProjectContext";
import { useAuth } from "../../Context/AuthContext";
import { supabase } from "../../Utils/Supabase";

const ItemCalled = ({ item, userId, onRefresh }) => {
  const [isActive, setIsActive] = useState(false);
  const euFuiChamado = item.idCalled === userId;
  const isPendente = item.status === "pendente";

  const alternarExpandir = async () => {
    setIsActive((prev) => !prev);

    // Se o usuário foi chamado e o status ainda é pendente, marca como atendido
    if (euFuiChamado && isPendente) {
      try {
        await supabase
          .from("Call")
          .update({ status: "atendido" })
          .eq("idCall", item.idCall);

        if (onRefresh) onRefresh();
      } catch (err) {
        console.warn("Erro ao atualizar chamado:", err);
      }
    }
  };

  const corFundo = isPendente ? "#DAD0B7" : "#5F5F5F";
  const corTexto = isPendente ? "#1E1E1E" : "#DAD0B7";
  const corSubtexto = isPendente ? "#313131" : "#DAD0B7";
  const corIcone = isPendente ? "#1E1E1E" : "#DAD0B7";

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: corFundo }]}
      activeOpacity={0.7}
      onPress={alternarExpandir}
    >
      <View style={styles.iconeContainer}>
        <Whistle size={26} color={corIcone} />
      </View>

      <View style={styles.conteudo}>
        <CustomText style={[styles.titulo, { color: corTexto }]}>
          {euFuiChamado ? (
            <>
              <CustomText style={[styles.titulo, styles.nomeDestaque, { color: corTexto }]}>
                {item.nomeQuemChamou}
              </CustomText>
              {" está te chamando!"}
            </>
          ) : (
            <>
              {"Você chamou "}
              <CustomText style={[styles.titulo, styles.nomeDestaque, { color: corTexto }]}>
                {item.nomeQuemFoiChamado}
              </CustomText>
              {"!"}
            </>
          )}
        </CustomText>

        <CustomText
          style={[styles.mensagem, { color: corSubtexto }]}
          numberOfLines={isActive ? undefined : 1}
        >
          {item.message || "Sem mensagem"}
        </CustomText>

        {isActive && (
          <CustomText style={[styles.hora, { color: corSubtexto }]}>
            {new Date(item.created_at).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            • {new Date(item.created_at).toLocaleDateString("pt-BR")}
          </CustomText>
        )}
      </View>

      {isPendente && <View style={styles.bolinhaPendente} />}
    </TouchableOpacity>
  );
};

const ViewCalled = () => {
  const { idProject } = useProjectContext();
  const { user } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);

  const buscarChamados = useCallback(async () => {
    if (!idProject || !user?.id) return;

    try {
      setLoading(true);
      // 1. Busca os chamados do projeto onde o usuário participou
      const { data, error } = await supabase
        .from("Call")
        .select("*")
        .eq("idProject", idProject)
        .or(`idCalled.eq.${user.id},idCaller.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      const listaChamados = data || [];

      // 2. Coleta os IDs de todos os usuários para buscar os nomes na tabela Profiles
      const userIds = new Set();
      listaChamados.forEach((c) => {
        if (c.idCaller) userIds.add(c.idCaller);
        if (c.idCalled) userIds.add(c.idCalled);
      });

      let mapaNomes = {};
      if (userIds.size > 0) {
        const { data: perfis, error: errPerfis } = await supabase
          .from("Profiles")
          .select("id, name")
          .in("id", Array.from(userIds));

        if (!errPerfis && perfis) {
          perfis.forEach((p) => {
            if (p.id) mapaNomes[p.id] = p.name;
          });
        }
      }

      // 3. Monta a lista formatada com os nomes corretos
      const formatados = listaChamados.map((c) => ({
        ...c,
        nomeQuemChamou: c.callerName || mapaNomes[c.idCaller] || "Alguém",
        nomeQuemFoiChamado: mapaNomes[c.idCalled] || "alguém",
      }));

      setChamados(formatados);
    } catch (err) {
      console.warn("Erro ao buscar histórico de chamados:", err);
    } finally {
      setLoading(false);
    }
  }, [idProject, user?.id]);

  useEffect(() => {
    buscarChamados();
  }, [buscarChamados]);

  if (loading) {
    return <ActivityIndicator size="large" color="#DA9304" style={{ marginTop: 30 }} />;
  }

  if (chamados.length === 0) {
    return (
      <View style={styles.vazio}>
        <CustomText style={{ color: "#DAD0B7", textAlign: "center", marginTop: 20 }}>
          Sem chamados no momento.
        </CustomText>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.lista}
      contentContainerStyle={styles.listaContent}
      data={chamados}
      keyExtractor={(item) => item.idCall.toString()}
      renderItem={({ item }) => (
        <ItemCalled
          item={item}
          userId={user?.id}
          onRefresh={buscarChamados}
        />
      )}
    />
  );
};

export default ViewCalled;

const styles = StyleSheet.create({
  lista: {
    width: "100%",
    padding: 20
  },
  listaContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  vazio: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  card: {
    width: "100%",
    minHeight: 65,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 14,
    marginBottom: 10,
  },
  iconeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  conteudo: {
    flex: 1,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 15,
    color: "#1E1E1E",
  },
  nomeDestaque: {
    fontWeight: "bold",
  },
  mensagem: {
    fontSize: 13,
    marginTop: 2,
  },
  hora: {
    fontSize: 11,
    marginTop: 6,
    opacity: 0.8,
  },
  bolinhaPendente: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    backgroundColor: "#DA9304",
    marginLeft: 6,
  },
});