import { View, StyleSheet, TouchableOpacity } from 'react-native';
import CustomText from '../Text/CustomText';

function Anotacoes() {

    return(
        <View style={styles.geral}>

            <CustomText style={styles.titulo}>Anotações Gerais</CustomText>

            <TouchableOpacity activeOpacity={0.8}>
            <View style={styles.escopo}>
                
                <View style={styles.campoTexto}>
                    <CustomText style={styles.texto}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo obcaecati fugit iusto maiores nihil eveniet nostrum voluptate praesentium molestias dolores, reprehenderit, exercitationem aspernatur inventore magnam, sequi architecto accusamus earum recusandae.</CustomText>
                </View>
                
            </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    geral: {gap: 10},
    titulo: {fontSize: 18},
    escopo: {
        width: 320,
        borderRadius: 15, 
        borderColor: "#EF5625", 
        borderWidth: 2, 
        overflow: "hidden",
        padding: 10
    },
    campoTexto: {backgroundColor: "#F0EADE", height: 400, borderRadius: 15, padding: 20},
    texto: {fontSize: 12, color: "#313131", textAlign: "justify"}
});

export default Anotacoes;