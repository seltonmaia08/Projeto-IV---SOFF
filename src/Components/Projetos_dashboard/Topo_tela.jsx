import { CircleUser } from 'lucide-react-native';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import CustomText from '../Text/CustomText';


const Topo_tela = ({ username }) => {

    const navegacao = useNavigation();
    const fotoPerfil = "https://i.pinimg.com/474x/ba/49/74/ba4974e3ba1dbf399f3c66d3c063f74d.jpg";

    return (
        <View>
            <View style={styles.escopoTopo}>
                <CustomText style={styles.texto}>Olá, {username}!</CustomText>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navegacao.navigate("Perfil", {fotoPerfil})}>
                    <View style={styles.perfil}>
                        <Image source={{uri: fotoPerfil}} style={styles.imagem}/>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    escopoTopo: {
        backgroundColor: "#383838",
        height: 104, 
        flexDirection: "row", 
        justifyContent: "space-between", 
        padding: 20,
        alignItems: "center"
    },
    texto: {fontWeight: "bold", fontSize: 22},
    perfil: {overflow: "hidden", borderRadius: 100, borderWidth: 3, borderColor: "#DAD0B7"},
    imagem: {width: 55, height: 55}
});

export default Topo_tela;