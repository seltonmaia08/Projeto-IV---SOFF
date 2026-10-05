import { CirclePlus } from 'lucide-react-native';
import { useState } from 'react'
import { ActivityIndicator, Text, View, StyleSheet, TouchableOpacity } from 'react-native'

import Topo_tela from '../../Components/Projetos_dashboard/Topo_tela';
import Card_projeto from '../../Components/Projetos_dashboard/Card_projeto';
import CustomText from '../../Components/Text/CustomText';
import NewProjetoPopUp from '../../Components/Projetos_dashboard/NewProjetoPopUp';

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
    // const [projetos, setProjetos] = useState([
    //     {id: "1", name: "Rosa dos Ventos", produt: "LandoP", cod: "01"},
    //     {id: "2", name: "Caminhando em Passos Largos", produt: "Osmar Cinema", cod: "02"},
    //     {id: "3", name: "Quando o Canto Leva o Povo", produt: "Masashi Produções", cod: "03"}
    // ]);
    //DADOS MOCKADOS;
    const { projects, loading, error, refetch } = useProject()
    
    const adicionarProjeto = (novoProjeto) => {
        // setProjetos( anteriores => [...anteriores, novoProjeto]);
        refetch()
    }

    const excluirProjeto = async (idProject) => { // excluo a partir do id
        try{
           await projectService.delete(idProject)
            refetch()
        } catch (err){
            console.error("Erro ao excluir o projeto:", err);
        }
        // coloque na lista de projetos apenas os que não tem ID igual ao ID do projeto a ser apagado;
    }

    return (
        <View style={styles.escopoTela}>

            <Topo_tela/>
            <View style={styles.conteudo}>
                
                <CustomText style={styles.titulo}>MEUS PROJETOS</CustomText>

                {loading && <ActivityIndicator size="large" color="#EF5625" />}

                 {error && <CustomText>Erro ao carregar projetos.</CustomText>}
            
                <View style={styles.projetos}>

                    {

                        projects.length === 0
                        ?
                        <CustomText>Crie um novo projeto, agora mesmo...</CustomText>
                        :
                        projects.map(cada => <Card_projeto
                                             // ao deletar um deles.
                            key = {cada.idProject} // importante para que os outros cards não herdem as últimas alterações
                            idProject = {cada.idProject}
                            projectName = {cada.projectName}
                            producer = {cada.producer}
                            created_at={cada.created_at}
                            onExcluir = {excluirProjeto}
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
                
            </View>

        </View>
    )
}

export default Dashboard;