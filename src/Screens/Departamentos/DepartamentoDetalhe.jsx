import { useState } from "react";
import {
  View,
  Modal,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Users, UserRoundPlus, Plus } from "lucide-react-native";

import Top from "../TopAba/Top";
import CustomText from "../../Components/Text/CustomText";
import ConfirmPopUp from "../../Components/ConfirmPopUp/ConfirmPopUp";
import CardTarefa from "../../Components/Departamentos/CardTarefa";
import PopUpTarefa from "../../Components/Departamentos/PopUpTarefa";
import AnotacoesDepartamento from "../../Components/Anotacoes/AnotacoesDepartamento";

const MEMBROS_FIXOS = ["Samuel Moreno", "Selton Maia", "Clenda"];

const DepartamentoDetalhe = ({ visivel, departamento, aoFechar }) => {
  const [tarefas, setTarefas] = useState([]);

  const [selecionadaId, setSelecionadaId] = useState(null);

  const [adicionando, setAdicionando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [excluindo, setExcluindo] = useState(null);
  const [membrosAberto, setMembrosAberto] = useState(false);

  const alternarSelecao = (id) => {
    setSelecionadaId(selecionadaId === id ? null : id);
  };

  const adicionarTarefa = (texto) => {
    const nova = { id: String(Date.now()), texto, status: "1" };
    setTarefas((atual) => [...atual, nova]);
    setAdicionando(false);
  };

  const editarTarefa = (texto) => {
    setTarefas((atual) =>
      atual.map((t) => (t.id === editando.id ? { ...t, texto } : t)),
    );
    setEditando(null);
    setSelecionadaId(null);
  };

  const mudarStatus = (id, novoStatus) => {
    setTarefas((atual) =>
      atual.map((t) => (t.id === id ? { ...t, status: novoStatus } : t)),
    );
  };

  const excluirTarefa = () => {
    setTarefas((atual) => atual.filter((t) => t.id !== excluindo.id));
    setExcluindo(null);
    setSelecionadaId(null);
  };

  const sair = () => {
    setSelecionadaId(null);
    setMembrosAberto(false);
    aoFechar();
  };

  return (
    <Modal visible={visivel} animationType="slide" onRequestClose={sair}>
      <View style={styles.tela}>
        <View>
          <Top abaName={departamento.nome} voltar={true} voltarOn={sair} />
          <TouchableOpacity
            style={styles.botaoMembros}
            activeOpacity={0.6}
            onPress={() => setMembrosAberto(!membrosAberto)}
            accessibilityLabel="Ver membros do departamento"
          >
            <Users size={24} color="#DAD0B7" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.conteudoScroll}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setSelecionadaId(null)}
          />

          <CustomText style={styles.rotulo}>Tarefas</CustomText>
          <View style={styles.cardTarefas} pointerEvents="box-none">
            {tarefas.length === 0 ? (
              <CustomText style={styles.semTarefas}>
                Sem tarefas no momento.
              </CustomText>
            ) : (
              tarefas.map((tarefa) => (
                <CardTarefa
                  key={tarefa.id}
                  tarefa={tarefa}
                  selecionada={selecionadaId === tarefa.id}
                  aoTocar={() => alternarSelecao(tarefa.id)}
                  aoMudarStatus={(novo) => mudarStatus(tarefa.id, novo)}
                  aoEditar={() => setEditando(tarefa)}
                  aoExcluir={() => setExcluindo(tarefa)}
                />
              ))
            )}

            <TouchableOpacity
              style={styles.botaoAdicionar}
              activeOpacity={0.8}
              onPress={() => setAdicionando(true)}
            >
              <Plus size={18} color="#242424" />
              <CustomText style={styles.textoAdicionar}>
                Adicionar tarefa
              </CustomText>
            </TouchableOpacity>
          </View>
          <AnotacoesDepartamento idDepartment={departamento.idDepartment} />
        </ScrollView>
        {membrosAberto && (
          <>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setMembrosAberto(false)}
            />

            <View style={styles.popUpMembros}>
              {MEMBROS_FIXOS.map((nome) => (
                <View key={nome} style={styles.itemMembro}>
                  <CustomText style={styles.nomeMembro}>{nome}</CustomText>
                </View>
              ))}

              <TouchableOpacity
                style={styles.botaoAddMembro}
                activeOpacity={0.7}
              >
                <UserRoundPlus size={18} color="#242424" />
                <CustomText style={styles.textoAddMembro}>
                  Adicionar membro
                </CustomText>
              </TouchableOpacity>
            </View>
          </>
        )}

        <PopUpTarefa
          visivel={adicionando}
          textoInicial=""
          textoBotao="Adicionar"
          aoCancelar={() => setAdicionando(false)}
          aoConfirmar={adicionarTarefa}
        />
        <PopUpTarefa
          visivel={editando !== null}
          textoInicial={editando ? editando.texto : ""}
          textoBotao="Concluir"
          aoCancelar={() => setEditando(null)}
          aoConfirmar={editarTarefa}
        />
        <ConfirmPopUp
          visivel={excluindo !== null}
          mensagem="Tem certeza que quer excluir esta tarefa?"
          aoConfirmar={excluirTarefa}
          aoCancelar={() => setExcluindo(null)}
        />
      </View>
    </Modal>
  );
};

export default DepartamentoDetalhe;

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#242424",
  },
  botaoMembros: {
    position: "absolute",
    right: 20,
    top: 78,
  },
  conteudoScroll: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 60,
  },
  rotulo: {
    fontSize: 18,
    color: "#DAD0B7",
    marginBottom: 10,
  },
  cardTarefas: {
    backgroundColor: "#313131",
    borderRadius: 20,
    padding: 14,
  },
  semTarefas: {
    textAlign: "center",
    color: "#DAD0B7",
    paddingVertical: 24,
  },
  botaoAdicionar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 54,
    backgroundColor: "#DAD0B7",
    borderRadius: 15,
  },
  textoAdicionar: {
    fontSize: 14,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
    color: "#242424",
  },
  popUpMembros: {
    position: "absolute",
    top: 126,
    right: 20,
    width: 250,
    backgroundColor: "#313131",
    borderRadius: 20,
    padding: 16,
    gap: 4,
    elevation: 10,
  },
  itemMembro: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#242424",
  },
  nomeMembro: {
    fontSize: 15,
    color: "#DAD0B7",
  },
  botaoAddMembro: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 44,
    backgroundColor: "#DAD0B7",
    borderRadius: 22,
    marginTop: 12,
  },
  textoAddMembro: {
    fontSize: 14,
    color: "#242424",
  },
});
