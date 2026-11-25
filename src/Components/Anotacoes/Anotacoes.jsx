import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';

import CustomText from '../Text/CustomText';
import AnotacoesPopUp from './AnotacoesPopUp';
import AddSceneList from '../Buttons/AddSceneList';
import LerAnotacao from './LerAnotacao';
import { useNotes } from '../../Hook/useNotes';
import { useProjectContext } from '../../Context/ProjectContext';
import { notesService } from '../../Services/api';
import AlertaGeral from '../Alerta/AlertaGeral';
import { supabase } from '../../Utils/Supabase';

function Anotacoes() {

    const [anotacoesVisivel, setAnotacoesVisivel] = useState(false);
    const [anotacaoSelecionada, setAnotacaoSelecionada] = useState(null);

    const { idProject, projectName } = useProjectContext()
    const { notes, loading, refetch } = useNotes(idProject)

    const handleFechar = () => { setAnotacoesVisivel(false) }
    const handleSalvar = async (title, newNote) => {
        if(!title?.trim() || !newNote?.trim()) {
            AlertaGeral.alert('Aviso', 'Preencha o título e o texto da anotação.');
            return;
        }

        if (!idProject) {
            AlertaGeral.alert('Erro', 'Identificador do projeto não encontrado.');
            return;
        }

        try {
            await notesService.create({
                noteTitle: title.trim(),
                noteText: newNote.trim(),
                idProject: idProject
            });

            refetch();
            setAnotacoesVisivel(false);
        } catch (error) {
            console.error('Erro ao salvar anotações no banco: ', error);

            // Fallback caso a tabela utilize colunas alternativas (title / text)
            if (error?.code === 'PGRST204') {
                try {
                    const { error: errAlt } = await supabase
                        .from('Notes')
                        .insert([{
                            title: title.trim(),
                            text: newNote.trim(),
                            idProject: idProject
                        }])
                        .select();

                    if (!errAlt) {
                        refetch();
                        setAnotacoesVisivel(false);
                        return;
                    }
                } catch (eAlt) {
                    console.warn('Fallback alternativo também falhou:', eAlt);
                }
            }

            const mensagemErro = error?.code === '42501'
                ? 'Erro de permissão no Supabase (RLS). Execute a query SQL para liberar permissões na tabela Notes.'
                : (error?.message || 'Não foi possível salvar a anotação.');

            AlertaGeral.alert('Erro ao salvar', mensagemErro);
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
            AlertaGeral.alert('Erro ao excluir', error?.message || 'Não foi possível excluir a anotação.');
        }
    }

    const atualizarNota = async (newTitle, newNote) => {
        // Captura o id antes de qualquer mudança de estado
        const idNota = anotacaoSelecionada?.idNotes ?? anotacaoSelecionada?.id;
        if (!idNota) return;

        try {
            // Tenta atualizar com a coluna idNotes (padrão do BaseServices)
            let atualizado = false;
            try {
                await notesService.update(idNota, {
                    noteTitle: newTitle.trim(),
                    noteText: newNote.trim()
                }, 'idNotes');
                atualizado = true;
            } catch (err) {
                // Se a coluna idNotes não existir, tenta com 'id'
                if (err?.code === 'PGRST204' || err?.code === '42703') {
                    await notesService.update(idNota, {
                        noteTitle: newTitle.trim(),
                        noteText: newNote.trim()
                    }, 'id');
                    atualizado = true;
                } else {
                    throw err;
                }
            }

            if (atualizado) {
                refetch();
                setAnotacaoSelecionada(null);
            }
        } catch (error) {
            console.error('Erro ao atualizar anotação no banco: ', error);
            AlertaGeral.alert('Erro ao atualizar', error?.message || 'Não foi possível atualizar a anotação.');
        }
    }

    return (
        <View style={styles.geral}>

            <CustomText style={styles.titulo}>Anotações Gerais</CustomText>

            <View style={styles.escopo}>

                <View style={styles.cards}>

                    {loading ? (
                        <View style={[styles.card, { justifyContent: 'center', alignItems: 'center', gap: 10 }]}>
                            <ActivityIndicator size={"large"} color={"#F68E49"} />
                            <CustomText>Carregando...</CustomText>
                        </View>
                    ) :

                        notes.length === 0 ?
                            (<CustomText style={{ textAlign: 'center', margin: 10}}>Sem anotações no momento.</CustomText>)
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
        overflow: "hidden",
        backgroundColor: "#313131",
        padding: 10
    },
    cards: { gap: 10, marginVertical: 10 },
    card: {
        backgroundColor: "#DAD0B7",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
    },
    conteudo: { maxHeight: 57, overflow: "hidden", gap: 5 },
    subtitulos: { fontSize: 16, color: "#242424" },
    texto: { fontSize: 12, color: "#313131", textAlign: "justify", letterSpacing: 1.15 }
});

export default Anotacoes;