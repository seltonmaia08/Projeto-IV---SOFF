import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { useState, useEffect, useCallback } from "react";

import CustomText from "../Text/CustomText";
import AnotacoesPopUp from "./AnotacoesPopUp";
import AddSceneList from "../Buttons/AddSceneList";
import LerAnotacao from "./LerAnotacao";

import { useProjectContext } from "../../Context/ProjectContext";
import { notesService } from "../../Services/api";

function AnotacoesDepartamento({ idDepartment }) {
  const [anotacoes, setAnotacoes] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState(false);

  const [anotacoesVisivel, setAnotacoesVisivel] = useState(false);
  const [anotacaoSelecionada, setAnotacaoSelecionada] = useState(null);

  const { idProject } = useProjectContext();

  // Busca somente as anotações deste departamento
  const carregarAnotacoes = useCallback(async () => {
    if (!idDepartment) {
      setAnotacoes([]);
      return;
    }

    try {
      setCarregando(true);
      setErroCarregamento(false);

      const dados = await notesService.getAllColumn(
        "idDepartment",
        idDepartment,
      );

      setAnotacoes(dados || []);
    } catch (error) {
      console.error("Erro ao carregar anotações do departamento:", error);
      setErroCarregamento(true);
    } finally {
      setCarregando(false);
    }
  }, [idDepartment]);

  useEffect(() => {
    carregarAnotacoes();
  }, [carregarAnotacoes]);

  // Criar uma anotação
  const handleSalvar = async (title, newNote) => {
    if (!title?.trim() || !newNote?.trim()) return;

    try {
      await notesService.create({
        noteTitle: title,
        noteText: newNote,
        idProject: idProject,
        idDepartment: idDepartment,
      });

      await carregarAnotacoes();
      setAnotacoesVisivel(false);
    } catch (error) {
      console.error("Erro ao salvar anotação:", error);
    }
  };

  // Excluir uma anotação
  const handleApagarAnotacao = async () => {
    if (!anotacaoSelecionada?.idNotes) return;

    try {
      await notesService.delete(anotacaoSelecionada.idNotes);

      await carregarAnotacoes();
      setAnotacaoSelecionada(null);
    } catch (error) {
      console.error("Erro ao excluir anotação:", error);
    }
  };

  // Editar uma anotação
  const atualizarAnotacao = async (newTitle, newNote) => {
    if (!anotacaoSelecionada?.idNotes) return;

    try {
      await notesService.update(
        anotacaoSelecionada.idNotes,
        {
          noteTitle: newTitle,
          noteText: newNote,
        },
        "idNotes",
      );

      await carregarAnotacoes();
      setAnotacaoSelecionada(null);
    } catch (error) {
      console.error("Erro ao atualizar anotação:", error);
    }
  };

  return (
    <View style={styles.geral}>
      <CustomText style={styles.titulo}>Anotações</CustomText>

      <View style={styles.escopo}>
        <View style={styles.cards}>
          {carregando ? (
            <View style={styles.cardCarregando}>
              <ActivityIndicator size="large" color="#EF5625" />
              <CustomText>Carregando...</CustomText>
            </View>
          ) : erroCarregamento ? (
            <CustomText style={styles.mensagem}>
              Não foi possível carregar as anotações.
            </CustomText>
          ) : anotacoes.length === 0 ? (
            <CustomText style={styles.mensagem}>
              Sem anotações no momento.
            </CustomText>
          ) : (
            anotacoes.map((cada) => (
              <TouchableOpacity
                key={cada.idNotes}
                onPress={() => setAnotacaoSelecionada(cada)}
                activeOpacity={0.8}
              >
                <View style={styles.card}>
                  <View style={styles.conteudo}>
                    <CustomText style={styles.subtitulos}>
                      {cada.noteTitle}
                    </CustomText>

                    <CustomText style={styles.texto}>
                      {cada.noteText}
                    </CustomText>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <AddSceneList
          title={"ADICIONAR ANOTAÇÃO"}
          onPress={() => setAnotacoesVisivel(true)}
        />
      </View>

      <AnotacoesPopUp
        visivel={anotacoesVisivel}
        aoFechar={() => setAnotacoesVisivel(false)}
        aoSalvar={handleSalvar}
      />

      <LerAnotacao
        visivel={anotacaoSelecionada !== null}
        title={anotacaoSelecionada?.noteTitle}
        note={anotacaoSelecionada?.noteText}
        aoFechar={() => setAnotacaoSelecionada(null)}
        aoExcluir={handleApagarAnotacao}
        aoSalvar={atualizarAnotacao}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  geral: {
    gap: 10,
  },

  titulo: {
    fontSize: 18,
  },

  escopo: {
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#313131",
    padding: 10,
  },

  cards: {
    gap: 10,
    marginVertical: 10,
  },

  card: {
    backgroundColor: "#DAD0B7",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },

  cardCarregando: {
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 15,
  },

  mensagem: {
    textAlign: "center",
    margin: 10,
  },

  conteudo: {
    maxHeight: 57,
    overflow: "hidden",
    gap: 5,
  },

  subtitulos: {
    fontSize: 16,
    color: "#242424",
  },

  texto: {
    fontSize: 12,
    color: "#313131",
    textAlign: "justify",
    letterSpacing: 1.15,
  },
});

export default AnotacoesDepartamento;
