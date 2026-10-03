import { CirclePlus } from 'lucide-react-native';
import { useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'

import Topo_tela from '../../../components/Topo_tela';
import Card_projeto from '../../../components/Card_projeto';
import CustomText from '../../Components/Text/CustomText';
import NewProjetoPopUp from '../../../components/NewProjetoPopUp';

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
        {id: "", name: "Rosa dos Ventos", produt: "LandoP"},
        {id: "", name: "Caminhando em Passos Largos", produt: "Osmar Cinema"},
        {id: "", name: "Quando o Canto Leva o Povo", produt: "Masashi Produções"}
    ]);
    //DADOS MOCKADOS;

    
    const adicionarProjeto = (novoProjeto) => {
        setProjetos( anteriores => [...anteriores, novoProjeto]);
    }

    return (
        <View style={styles.escopoTela}>

            <Topo_tela/>
            <View style={styles.conteudo}>
                
                <CustomText style={styles.titulo}>MEUS PROJETOS</CustomText>
            
                <View style={styles.projetos}>
                    {
                        projetos.map(cada => <Card_projeto
                            nome = {cada.name}
                            produtora= {cada.produt}
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