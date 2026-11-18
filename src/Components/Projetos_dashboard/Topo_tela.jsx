import { CircleUser } from 'lucide-react-native';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../../Context/AuthContext';
import { useNavigation } from '@react-navigation/native';

import CustomText from '../Text/CustomText';


const Topo_tela = ({ username }) => {

    const navegacao = useNavigation();
    const { user } = useAuth();

    const foto = user?.user_metadata?.avatar_url || user?.user_metadata?.photoUrl || ""; 

    return (
        <View>
            <View style={styles.escopoTopo}>
                <CustomText style={styles.texto}>Olá, {username}!</CustomText>
                <TouchableOpacity activeOpacity={0.5} onPress={() => navegacao.navigate("Perfil")}>
                    <View style={styles.perfil}>
                        <Image source={{uri: foto}} style={styles.imagem}/>
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
        alignItems: "flex-end"
    },
    texto: {fontWeight: "bold", fontSize: 22},
    perfil: {overflow: "hidden", borderRadius: 100, borderWidth: 3, borderColor: "#DAD0B7"},
    imagem: {width: 50, height: 50}
});

export default Topo_tela;