import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Pencil } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ProjectContext } from '../../Context/ProjectContext';

import CustomText from '../../Components/Text/CustomText';
import ConfirmacaoPopUp from '../../Components/ConfirmPopUp/ConfirmacaoPopUp';
import Membros from './Membros';
import Top from '../TopAba/Top';
import EditNamePopUp from './EditNamePopUp';
import LinksPopUp from './LinksPopUp';
import { projectService } from '../../Services/api';
import { useProject } from '../../Hook/useProjects';

function Details() {

    const navigation = useNavigation();
    const { idProject, projectName, producer, setProjectName, setProducer } = useContext(ProjectContext) || {};

    const [editVisivel, setEditVisivel] = useState(false);
    const [membrosVisivel, setMembrosVisivel] = useState(false);
    const [nomeProjeto, setNomeProjeto] = useState(projectName || "");
    const [nomeProdutora, setNomeProdutora] = useState(producer || "");
    const [excluirPopUp, setExcluirPopUp] = useState(false);
    const [links, setLinks] = useState(false);
    const { projects, loading, error, refetch } = useProject();

    useEffect(() => {
        if (projectName) setNomeProjeto(projectName);
    }, [projectName]);

    useEffect(() => {
        if (producer) setNomeProdutora(producer);
    }, [producer]);

    const excluirProjeto = async () => {
        try {
            await projectService.delete(idProject);
            setExcluirPopUp(false);
            navigation.navigate('Dashboard');
        } catch (err) {
            console.error("Erro ao excluir o projeto:", err);
            Alert.alert("Erro ao excluir", err.message || "Não foi possível excluir o projeto.");
        }
    };

    return (
        <View style={styles.escopo}>

            <Top abaName="Detalhes do Projeto" voltar={false} />

            <View style={styles.conteudoTela}>
                <View style={styles.campoProjeto}>

                    <View style={styles.campoProjetoItens}>

                        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                            <CustomText style={styles.nomeProjeto}>Nome do Projeto</CustomText>

                            <TouchableOpacity activeOpacity={0.7} onPress={() => setEditVisivel(true)}>
                                <Pencil style={{ color: "#DAD0B7", size: 5 }} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.campoTexto}>
                            <CustomText style={styles.nomeProjetoTexto}>{nomeProjeto}</CustomText>
                        </View>
                    </View>

                    <View style={styles.campoProjetoItens}>
                        <CustomText style={styles.nomeProjeto}>Produtora</CustomText>
                        <View style={styles.campoTexto}>
                            <CustomText style={styles.nomeProjetoTexto}>{nomeProdutora}</CustomText>
                        </View>
                    </View>

                </View>

                <View style={styles.outrosCampos}>

                    <TouchableOpacity style={styles.campoMembros} activeOpacity={0.7} onPress={() => setLinks(true)}>
                        <View>
                            <CustomText style={styles.tituloMembros}>Acessar Links</CustomText>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.campoMembros} activeOpacity={0.7} onPress={() => setMembrosVisivel(true)}>
                        <View>
                            <CustomText style={styles.tituloMembros}>Acessar Membros</CustomText>
                        </View>
                    </TouchableOpacity>

                </View>

                <View style={styles.areaBotoes}>

                    <TouchableOpacity style={styles.botaoVoltar} activeOpacity={0.5} onPress={() => navigation.getParent()?.goBack() || navigation.navigate("Dashboard")}>
                        <CustomText style={styles.textoBotao}>Voltar ao Dashboard</CustomText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botaoExcluir} activeOpacity={0.5} onPress={() => setExcluirPopUp(true)}>
                        <CustomText style={styles.textoBotao}>Excluir Projeto</CustomText>
                    </TouchableOpacity>

                </View>

                <ConfirmacaoPopUp
                    visivel={excluirPopUp}
                    aoCancelar={() => setExcluirPopUp(false)}
                    aoExecutar={excluirProjeto}
                    mensagem={`o projeto "${nomeProjeto}"`}
                />
                <EditNamePopUp
                    visivel={editVisivel}
                    idProject={idProject}
                    nome={nomeProjeto}
                    produt={nomeProdutora}
                    aoFechar={() => setEditVisivel(false)}
                    aoSalvar={(novoNome, novaProdutora) => {
                        setNomeProjeto(novoNome);
                        setNomeProdutora(novaProdutora);
                        if (setProjectName) setProjectName(novoNome);
                        if (setProducer) setProducer(novaProdutora);
                        refetch();
                    }}
                />
                <LinksPopUp
                    visivel = {links}
                    aoFechar = {() => setLinks(false)}
                />
                <Membros
                    visivel={membrosVisivel}
                    aoFechar={() => setMembrosVisivel(false)}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    escopo: { backgroundColor: "#242424", flex: 1},
    conteudoTela: { padding: 20, gap: 30, width: "100%", height: "100%", alignItems: 'center'},
    campoProjeto: {
        backgroundColor: "#313131",
        padding: 20,
        borderRadius: 15,
        gap: 10,
        width: '100%'
    },
    campoProjetoItens: { gap: 10 },
    nomeProjeto: { fontSize: 14 },
    campoTexto: { borderBottomColor: "#EF5625", borderBottomWidth: 2 },
    nomeProjetoTexto: { fontSize: 16, marginLeft: 10, marginBottom: 10 },
    outrosCampos: { gap: 10, width: '100%' },
    campoMembros: { backgroundColor: "#313131", padding: 20, borderRadius: 15 },
    tituloMembros: { fontSize: 16 },
    textoMembros: { fontSize: 14 },
    areaBotoes: { position: "absolute", bottom: 120, width: "89%", alignItems: "center", gap: 10, },
    botaoVoltar: { width: "100%", padding: 15, backgroundColor: "#313131", borderRadius: 15 },
    textoBotao: { fontSize: 16, fontWeight: "bold", textAlign: "center" },
    botaoExcluir: { width: "100%", padding: 15, backgroundColor: "#EF5625", borderRadius: 15 }
});

export default Details;
