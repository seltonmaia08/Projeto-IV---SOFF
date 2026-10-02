import { Text, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    escopoTopo: {
        backgroundColor: "#5F5F5F",
        height: 104, 
        flexDirection: "row", 
        justifyContent: "space-between", 
        padding: 20,
        alignItems: "flex-end"
    },
    texto: {color: "#F0EADE", fontSize: 28, fontWeight: "bold", fontFamily: "Alexandria"},
});

const Topo_tela = () => {

    return (
        <View>
        
            <View style={styles.escopoTopo}>
                <Text style={styles.texto}>Olá, Usuário!</Text>
                <Text style={{color: "#F0EADE"}}>(botão de profile)</Text>
            </View>

        </View>
    )
}

export default Topo_tela;