import { CirclePlus } from 'lucide-react-native';
import { useState } from 'react'
import { ActivityIndicator, Text, View, StyleSheet, TouchableOpacity } from 'react-native'

import Topo_tela from '../../Components/Projetos_dashboard/Topo_tela';
import Card_projeto from '../../Components/Projetos_dashboard/Card_projeto';
import CustomText from '../../Components/Text/CustomText';
import ConfirmacaoPopUp from '../../Components/Projetos_dashboard/ConfirmacaoPopUp';
import NewProjetoPopUp from '../../Components/Projetos_dashboard/NewProjetoPopUp';
import Anotacoes from '../../Components/Anotacoes/Anotacoes';
import AnotacoesPopUp from '../../Components/Anotacoes/AnotacoesPopUp';

//import's backend
import { useProject } from '../../Hook/useProjects';
import { projectService } from '../../Services/api';


const styles = StyleSheet.create({
    escopoTela: {flex: 1},
    titulo: {color: "white", fontSize: 14, fontWeight: "bold", marginBottom: 30},
    conteudo: {flex: 1, alignItems: "center", paddingTop: 40, position: "relative"},
    projetos: {gap: 10},
    botao_plus: {position: "absolute", bottom: 25, right: 25, color: "#F0EADE"},
});


const Dashboard = () => {
    const [modalVisivel, setModalVisivel] = useState(false);
    const [confirmacaoVisivel, setConfirmacaoVisivel] = useState(false);
    const [projetoParaExcluir, setProjetoParaExcluir] = useState(null);
    const { projects, loading, error, refetch } = useProject()
    
    const adicionarProjeto = (novoProjeto) => {
        refetch()
    }

    const prepararExclusao = (projeto) => {
        setProjetoParaExcluir(projeto);
        setConfirmacaoVisivel(true);
    }

    const excluirProjeto = async () => { // excluo a partir do id na variável projetoParaExcluir
        if(!projetoParaExcluir){return}

        try{
            await projectService.delete(projetoParaExcluir.idProject);
            refetch();
        } catch (err){
            console.error("Erro ao excluir o projeto:", err);
        } finally {
            setConfirmacaoVisivel(false);
            setTimeout( () => {setProjetoParaExcluir(null)}, 300);
        }
    }

    const cancelarExclusao = () => {
        setConfirmacaoVisivel(false);
        setTimeout( () => {setProjetoParaExcluir(null)}, 200); // se o usuário for mais rápido do que isso, pode dar problema de renderização
    }

    return (
        <View style={styles.escopoTela}>

            <Topo_tela/>
            <View style={styles.conteudo}>
                {/*<Anotacoes/>
                <AnotacoesPopUp/>*/}
                <CustomText style={styles.titulo}>MEUS PROJETOS</CustomText>

                {loading && <ActivityIndicator size="large" color="#EF5625" />}

                 {error && <CustomText>Erro ao carregar projetos.</CustomText>}
            
                <View style={styles.projetos}>

                    {

                        projects.length === 0
                        ?
                        <CustomText>Comece criando um novo projeto!</CustomText>
                        :
                        projects.map(cada => <Card_projeto
                                             // ao deletar um deles.
                            key = {cada.idProject} // importante para que os outros cards não herdem as últimas alterações
                            idProject = {cada.idProject}
                            projectName = {cada.projectName}
                            producer = {cada.producer}
                            created_at={cada.created_at}
                            onExcluir = {prepararExclusao}
                        />)
                    }
                </View>

                <TouchableOpacity style={styles.botao_plus} activeOpacity={0.5} onPress={() => setModalVisivel(true)}>
                    <CirclePlus size={50}/>
                </TouchableOpacity>

                <NewProjetoPopUp 
                    visivel= {modalVisivel}
                    aoFechar = {() => setModalVisivel(false)}
                    aoCriarProjeto = {adicionarProjeto}
                />

                <ConfirmacaoPopUp
                    visivel = {confirmacaoVisivel}
                    aoCancelar={cancelarExclusao}
                    aoExecutar={excluirProjeto}
                    nome={projetoParaExcluir?.projectName}
                />
                
            </View>

        </View>
    )
}

export default Dashboard;