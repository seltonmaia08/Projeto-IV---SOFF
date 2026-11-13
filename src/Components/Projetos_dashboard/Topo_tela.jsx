import { CircleUser } from 'lucide-react-native';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomText from '../Text/CustomText';


const Topo_tela = ({ username }) => {

    const navegacao = useNavigation();

    return (
        <View>
            <View style={styles.escopoTopo}>
                <CustomText style={styles.texto}>Olá, {username}!</CustomText>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navegacao.navigate("Perfil")}>
                    <CircleUser size={45} style={styles.perfil}/>
                </TouchableOpacity>
            </View>
        </View>
    )
}

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
    perfil: {color: "#DAD0B7"}
});

export default Topo_tela;