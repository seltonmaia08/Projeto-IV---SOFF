import { CirclePlus } from 'lucide-react-native';
import { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'

import Topo_tela from '../../../components/Topo_tela';
import Card_projeto from '../../../components/Card_projeto';
import CustomText from '../../Components/Text/CustomText';
import NewProjetoPopUp from '../../../components/NewProjetoPopUp';
import ConfirmacaoPopUp from '../../../components/ConfirmacaoPopUp';

const styles = StyleSheet.create({
    escopoTela: {flex: 1},
    titulo: {color: "white", fontSize: 14, fontWeight: "bold", marginBottom: 30},
    conteudo: {flex: 1, alignItems: "center", paddingTop: 40, position: "relative"},
    projetos: {gap: 10},
    botao_plus: {position: "absolute", bottom: 25, right: 25, color: "#F0EADE"},
});

const Dashboard = () => {

    const [modalVisivel, setModalVisivel] = useState(false);
    const [projetos, setProjetos] = useState([
        {id: "1", name: "Rosa dos Ventos", produt: "LandoP", cod: "01"},
        {id: "2", name: "Caminhando em Passos Largos", produt: "Osmar Cinema", cod: "02"},
        {id: "3", name: "Quando o Canto Leva o Povo", produt: "Masashi Produções", cod: "03"}
    ]);
    //DADOS MOCKADOS;
    
    const adicionarProjeto = (novoProjeto) => {
        setProjetos( anteriores => [...anteriores, novoProjeto]);
    }

    const excluirProjeto = (idDoProjeto) => { // excluo a partir do id
        setProjetos(anteriores => anteriores.filter(cada => cada.id !== idDoProjeto));
        // coloque na lista de projetos apenas os que não tem ID igual ao ID do projeto a ser apagado;
    }

    return (
        <View style={styles.escopoTela}>

            <Topo_tela/>
            <View style={styles.conteudo}>
                {/*<ConfirmacaoPopUp/>*/}
                <CustomText style={styles.titulo}>MEUS PROJETOS</CustomText>
            
                <View style={styles.projetos}>
                    {
                        projetos.map(cada => <Card_projeto
                            key = {cada.id} // importante para que os outros cards não herdem as últimas alterações
                            // ao deletar um deles.
                            id = {cada.id}
                            nome = {cada.name}
                            produtora= {cada.produt}
                            onExcluir= {excluirProjeto}
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