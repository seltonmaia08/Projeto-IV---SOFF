import { useState, useCallback } from 'react';
import { ActivityIndicator, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Topo_tela from '../../Components/Projetos_dashboard/Topo_tela';
import Card_projeto from '../../Components/Projetos_dashboard/Card_projeto';
import CustomText from '../../Components/Text/CustomText';
import ConfirmacaoPopUp from '../../Components/ConfirmPopUp/ConfirmacaoPopUp';
import NewProjetoPopUp from '../../Components/Projetos_dashboard/NewProjetoPopUp';

//import's backend
import { useProject } from '../../Hook/useProjects';
import { projectMemberService, projectService } from '../../Services/api';
import { useAuth } from '../../Context/AuthContext';
import LogOut from '../../Components/Buttons/ButtonLogout';
import ButtonAdd from '../../Components/Buttons/ButtonAdd';
import JoinProjectPopUp from '../../Components/Projetos_dashboard/JoinProjectPopUp';
import { supabase } from '../../Utils/Supabase';
import AlertaGeral from '../../Components/Alerta/AlertaGeral';


const Dashboard = () => {
    const [modalVisivel, setModalVisivel] = useState(false);
    const [confirmacaoVisivel, setConfirmacaoVisivel] = useState(false);
    const [projetoParaExcluir, setProjetoParaExcluir] = useState(null);
    const [sairProjeto, setSairProjeto] = useState(null)
    const [isActive, setIsActive] = useState(false)
    const [inserirConvite, setInserirConvite] = useState(false)
    const { projects, loading, error, refetch } = useProject();
    const { user } = useAuth();
    
    const toggleModal = () => setIsActive((prev) => !prev);
    
    // Recarrega os projetos sempre que o Dashboard ganha foco
    useFocusEffect(
        useCallback(() => {
            refetch();
        }, [refetch])
    );
    
    const adicionarProjeto = (novoProjeto) => {
        refetch();
    };
    
    const prepararExclusao = (projeto) => {
        setProjetoParaExcluir(projeto);
        setSairProjeto(null);
        setConfirmacaoVisivel(true);
    };

    const prepararParaSair = (sair) => {
        setSairProjeto(sair);
        setProjetoParaExcluir(null);
        setConfirmacaoVisivel(true);
    };

    const executarSaida = async () => {
        if (!sairProjeto || !user?.id) return;

        try {
            const { error } = await supabase
                .from('ProjectMember')
                .delete()
                .eq('idProject', sairProjeto.idProject)
                .eq('idUser', user.id);

            if (error) throw error;

            AlertaGeral.alert("Sucesso", `Você saiu do projeto "${sairProjeto.projectName}".`);
            refetch();
        } catch (err) {
            console.error("Erro ao sair do projeto:", err);
            AlertaGeral.alert("Erro ao sair", err.message || "Não foi possível sair do projeto.");
        } finally {
            setConfirmacaoVisivel(false);
            setSairProjeto(null);
        }
    };

    const excluirProjeto = async () => {
        if (!projetoParaExcluir) return;

        try {
            await projectService.delete(projetoParaExcluir.idProject);
            refetch();
        } catch (err) {
            console.error("Erro ao excluir o projeto:", err);
            AlertaGeral.alert("Erro ao excluir", err.message || "Não foi possível excluir o projeto.");
        } finally {
            setConfirmacaoVisivel(false);
            setProjetoParaExcluir(null);
        }
    };

    const cancelarModal = () => {
        setConfirmacaoVisivel(false);
        setProjetoParaExcluir(null);
        setSairProjeto(null);
    };

    return (
        <View style={styles.escopoTela}>

            <Topo_tela username={user?.user_metadata?.userName || "Usuário"}/>
            <View style={styles.conteudo}>

                <CustomText style={styles.titulo}>MEUS PROJETOS</CustomText>

                {loading && <ActivityIndicator size="large" color="#EF5625" />}

                {error && <CustomText>Erro ao carregar projetos.</CustomText>}

                <View style={styles.projetos}>

                    {
                        (!Array.isArray(projects) || projects.length === 0)
                            ?
                            <CustomText>Comece criando um novo projeto!</CustomText>
                            :
                            projects.map(cada => <Card_projeto
                                key={cada.idProject}
                                idProject={cada.idProject}
                                projectName={cada.projectName}
                                producer={cada.producer}
                                created_at={cada.created_at}
                                onExcluir={prepararExclusao}
                                onSair={prepararParaSair}
                            />)
                    }
                </View>

                <ButtonAdd onPress={toggleModal} isActive={isActive} />

                {

                    isActive
                        ?
                        <View style={styles.menuUp}>
                            <TouchableOpacity
                                onPress={() => {
                                    setIsActive(false);
                                    setModalVisivel(true);
                                }}
                                style={styles.buttonAddNota}
                            >
                                <CustomText>Novo Projeto</CustomText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonJoin}
                                onPress={() => setInserirConvite(true)}
                            >
                                <CustomText>Código de Convite</CustomText>
                            </TouchableOpacity>
                        </View>
                        :
                        <></>


                }

                {/* <TouchableOpacity style={styles.botao_plus} activeOpacity={0.5} onPress={() => setModalVisivel(true)}>
                    <CirclePlus style={{ marginBottom: 30, marginRight: 20 }} size={50} color={'#F0EADE'} />
                    </TouchableOpacity> */}

                <JoinProjectPopUp
                    visivel={inserirConvite}
                    aoFechar={() => setInserirConvite(false)}
                    aoEntrarComSucesso={adicionarProjeto}
                />

                <NewProjetoPopUp
                    visivel={modalVisivel}
                    aoFechar={() => setModalVisivel(false)}
                    aoCriarProjeto={adicionarProjeto}
                />

                <ConfirmacaoPopUp
                    visivel={confirmacaoVisivel}
                    aoCancelar={cancelarModal}
                    aoExecutar={projetoParaExcluir ? excluirProjeto : executarSaida}
                    mensagem={
                        projetoParaExcluir
                            ? `o projeto "${projetoParaExcluir?.projectName}"`
                            : `sair do projeto "${sairProjeto?.projectName}"`
                    }
                />

            </View>
        </View>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    escopoTela: { flex: 1 },
    titulo: { color: "#DAD0B7", fontSize: 14, fontWeight: "bold", marginBottom: 30 },
    conteudo: { flex: 1, alignItems: "center", paddingTop: 40, position: "relative" },
    projetos: { gap: 10 },
    botao_plus: { position: "absolute", bottom: 25, right: 0, color: "#DAD0B7" },
    menuUp: {
        backgroundColor: "#313131",
        padding: 10,
        borderRadius: 20,
        gap: 10,
        position: "absolute",
        bottom: 100,
        right: 50,
    },
    buttonAddNota: {
        height: 58,
        width: 180,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
        borderColor: "#DAD0B7",
        borderRadius: 15,
        borderWidth: 1
    },
    buttonJoin: {
        height: 58,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#DAD0B7',
    }
});