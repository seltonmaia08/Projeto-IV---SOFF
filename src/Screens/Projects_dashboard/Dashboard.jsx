import { CirclePlus } from 'lucide-react-native';

import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import Topo_tela from '../../../components/Topo_tela';
import Card_projeto from '../../../components/Card_projeto';

const styles = StyleSheet.create({
    escopoTela: {flex: 1},
    titulo: {color: "white", fontSize: 14, fontWeight: "bold", fontFamily: "Alexandria", marginBottom: 30},
    conteudo: {flex: 1, alignItems: "center", paddingTop: 40, position: "relative"},
    projetos: {gap: 10},
    botao_plus: {position: "absolute", bottom: 25, right: 25, color: "#F0EADE"}
});

const Dashboard = () => {
    return (
        <View style={styles.escopoTela}>

            <Topo_tela/>
            <View style={styles.conteudo}>
                <Text style={styles.titulo}>MEUS PROJETOS</Text>
            
                <View style={styles.projetos}>
                    <Card_projeto nome = "Rosa dos Ventos" produtora = "LandoP"/>
                    <Card_projeto nome = "Caminhando em Passos Largos" produtora = "Osmar Cinema"/>
                    <Card_projeto nome = "Quando o Canto Leva o Povo" produtora = "Masashi Produções"/>
                </View>

                <TouchableOpacity style={styles.botao_plus} activeOpacity={0.5}>
                    <CirclePlus size={50}/>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default Dashboard;