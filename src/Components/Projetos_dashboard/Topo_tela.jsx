import { CircleUser } from 'lucide-react-native';

import { Text, View, StyleSheet } from 'react-native';
import CustomText from '../Text/CustomText';

const styles = StyleSheet.create({
    escopoTopo: {
        backgroundColor: "#5F5F5F",
        height: 104, 
        flexDirection: "row", 
        justifyContent: "space-between", 
        padding: 20,
        alignItems: "flex-end"
    },
    texto: {fontWeight: "bold", fontSize: 24},
    perfil: {color: "#F0EADE"}
});

const Topo_tela = () => {

    return (
        <View>
        
            <View style={styles.escopoTopo}>
                <CustomText style={styles.texto}>Olá, Usuário!</CustomText>
                <CircleUser size={45} style={styles.perfil}/>
            </View>

        </View>
    )
}

export default Topo_tela;