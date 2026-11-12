import { CirclePlus } from 'lucide-react-native';
import { useState, useCallback } from 'react';
import { ActivityIndicator, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Topo_tela from '../../Components/Projetos_dashboard/Topo_tela';
import Card_projeto from '../../Components/Projetos_dashboard/Card_projeto';
import CustomText from '../../Components/Text/CustomText';
import ConfirmacaoPopUp from '../../Components/ConfirmPopUp/ConfirmacaoPopUp';
import NewProjetoPopUp from '../../Components/Projetos_dashboard/NewProjetoPopUp';

//import's backend
import { useProject } from '../../Hook/useProjects';
import { projectService } from '../../Services/api';
import { useAuth } from '../../Context/AuthContext';
import LogOut from '../../Components/Buttons/ButtonLogout';


const styles = StyleSheet.create({
    escopoTela: { flex: 1 },
    titulo: { color: "#DAD0B7", fontSize: 14, fontWeight: "bold", marginBottom: 30 },
    conteudo: { flex: 1, alignItems: "center", paddingTop: 40, position: "relative" },
    projetos: { gap: 10 },
    botao_plus: { position: "absolute", bottom: 25, right: 0, color: "#DAD0B7" },
});


const Dashboard = () => {
    const [modalVisivel, setModalVisivel] = useState(false);
    const [confirmacaoVisivel, setConfirmacaoVisivel] = useState(false);
    const [projetoParaExcluir, setProjetoParaExcluir] = useState(null);
    const { projects, loading, error, refetch } = useProject();
    const { user } = useAuth();

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
        setConfirmacaoVisivel(true);
    };

    const excluirProjeto = async () => {
        if (!projetoParaExcluir) return;

        try {
            await projectService.delete(projetoParaExcluir.idProject);
            refetch();
        } catch (err) {
            console.error("Erro ao excluir o projeto:", err);
            Alert.alert("Erro ao excluir", err.message || "Não foi possível excluir o projeto.");
        } finally {
            setConfirmacaoVisivel(false);
            setTimeout(() => { setProjetoParaExcluir(null); }, 300);
        }
    };

    const cancelarExclusao = () => {
        setConfirmacaoVisivel(false);
        setTimeout(() => { setProjetoParaExcluir(null); }, 200);
    };

    return (
        <View style={styles.escopoTela}>

            <Topo_tela username={user?.user_metadata?.userName || "Usuário"} />
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
                        />)
                    }
                </View>

                <TouchableOpacity style={styles.botao_plus} activeOpacity={0.5} onPress={() => setModalVisivel(true)}>
                    <CirclePlus style={{ marginBottom: 30, marginRight: 20 }} size={50} color={'#F0EADE'} />
                </TouchableOpacity>

                <NewProjetoPopUp 
                    visivel={modalVisivel}
                    aoFechar={() => setModalVisivel(false)}
                    aoCriarProjeto={adicionarProjeto}
                />

                <ConfirmacaoPopUp
                    visivel={confirmacaoVisivel}
                    aoCancelar={cancelarExclusao}
                    aoExecutar={excluirProjeto}
                    mensagem={`o projeto "${projetoParaExcluir?.projectName}"`}
                />
                
                <LogOut />
            </View>
        </View>
    );
};

export default Dashboard;
