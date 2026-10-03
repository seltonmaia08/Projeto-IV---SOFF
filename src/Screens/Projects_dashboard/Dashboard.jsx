import { Text, View, StyleSheet } from 'react-native'
import Topo_tela from '../../../components/Topo_tela';

const styles = StyleSheet.create({
    escopoTela: {flex: 1},
    textos: {color: "white", fontSize: 14, fontWeight: "bold", fontFamily: "Alexandria"},
    conteudo: {flex: 1, alignItems: "center", paddingTop: 40, position: "relative"},
    botao_canto: {position: "absolute", bottom: 25, right: 25, color: "#F0EADE"}
});

const Dashboard = () => {
    return (
        <View style={styles.escopoTela}>

            <Topo_tela/>
            <View style={styles.conteudo}>
                <Text style={styles.textos}>MEUS PROJETOS</Text>
                <Text style={styles.botao_canto}>(botão de +)</Text>
            </View>

        </View>
    )
}

export default Dashboard;