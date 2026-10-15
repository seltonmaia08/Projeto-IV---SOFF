import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';

import CustomText from '../Text/CustomText';
import AnotacoesPopUp from './AnotacoesPopUp';
import AddSceneList from '../Buttons/AddSceneList';
import LerAnotacao from './LerAnotacao';
import { useNotes } from '../../Hook/useNotes';
import { useProjectContext } from '../../Context/ProjectContext';
import { notesService } from '../../Services/api';

function Anotacoes() {

    const [anotacoesVisivel, setAnotacoesVisivel] = useState(false);
    const [anotacaoSelecionada, setAnotacaoSelecionada] = useState(null);

    const { idProject, projectName } = useProjectContext()
    const { notes, loading, refetch } = useNotes(idProject)

    const handleFechar = () => { setAnotacoesVisivel(false) }
    const handleSalvar = async (title, newNote) => {
        if(!title || !newNote) return
        try {
            await notesService.create({
                noteTitle: title,
                noteText: newNote,
                idProject: idProject
            })

            refetch()
            setAnotacoesVisivel(false)
        } catch (error) {
            console.error('Erro ao salvar anotações no banco: ', error);
        }
    }

    const handleApagarAnotacao = async () => {
        if(!anotacaoSelecionada?.idNotes) return
        
        try {
            await notesService.delete(anotacaoSelecionada.idNotes)

            refetch()
            setAnotacaoSelecionada(null);
        } catch (error) {
            console.error('Erro ao apagar anotação no banco: ', error)
        }
    }

    const atualizarNota = async (newTitle, newNote) => {
        if (!anotacaoSelecionada?.idNotes) return

        try {
            await notesService.update(anotacaoSelecionada.idNotes, {
                noteTitle: newTitle,
                noteText: newNote
            }, 'idNotes')

            refetch()
            setAnotacaoSelecionada(null);
        } catch (error) {
            console.error('Erro ao atualizar anotação no banco: ', error)
        }
    }

    return (
        <View style={styles.geral}>

            <CustomText style={styles.titulo}>Anotações Gerais</CustomText>

            <View style={styles.escopo}>

                <View style={styles.cards}>

                    {loading ? (
                        <View style={[styles.card, { justifyContent: 'center', alignItems: 'center', gap: 10 }]}>
                            <ActivityIndicator size={"large"} color={"#EF5625"} />
                            <CustomText>Carregando...</CustomText>
                        </View>
                    ) :

                        notes.length === 0 ?
                            (<CustomText style={{ textAlign: 'center', margin: 10}}>Ops! sem anotações, adicione uma agora mesmo</CustomText>)
                            :
                            notes.map((cada, index) => {
                                return (
                                    <TouchableOpacity onPress={() => setAnotacaoSelecionada(cada)} key={index} activeOpacity={0.8}>
                                        <View style={styles.card}>
                                            <View style={styles.conteudo}>
                                                <CustomText style={styles.subtitulos}>{cada.noteTitle}</CustomText>
                                                <CustomText style={styles.texto}>{cada.noteText}</CustomText>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                    }

                </View>
                <AddSceneList title={"ADICIONAR ANOTAÇÃO"} onPress={() => setAnotacoesVisivel(true)} />
            </View>
            <AnotacoesPopUp
                visivel={anotacoesVisivel}
                aoFechar={handleFechar}
                aoSalvar={handleSalvar}
            />
            <LerAnotacao
                visivel={anotacaoSelecionada != null}
                title={anotacaoSelecionada?.noteTitle}
                note={anotacaoSelecionada?.noteText}
                aoFechar={() => setAnotacaoSelecionada(null)}
                aoExcluir={handleApagarAnotacao}
                aoSalvar={atualizarNota}
            />

        </View>
    )
}

const styles = StyleSheet.create({
    geral: { flex: 1, gap: 10 },
    titulo: { fontSize: 18 },
    escopo: {
        width: '100%',
        borderRadius: 15,
        overflow: "hidden"
    },
    cards: { gap: 10, marginBottom: 30 },
    card: {
        backgroundColor: "#DAD0B7",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
    },
    conteudo: { height: 'auto', overflow: "hidden", gap: 5 },
    subtitulos: { fontSize: 16, color: "#313131" },
    texto: { fontSize: 12, color: "#313131", textAlign: "justify", letterSpacing: 1.15 }
});

export default Anotacoes;