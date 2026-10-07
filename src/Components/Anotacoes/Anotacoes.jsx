import { View, StyleSheet } from 'react-native';
import CustomText from '../Text/CustomText';

function Anotacoes() {

    return(
        <View style={styles.geral}>
            <CustomText style={styles.titulo}>Anotações Gerais</CustomText>
            <View style={styles.escopo}>
                <View style={styles.campoTexto}>
                    <CustomText style={styles.texto}>Olá</CustomText>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    geral: {flex: 1, gap: 10},
    titulo: {fontSize: 18},
    escopo: {
        width: '100%',
        borderRadius: 15, 
        borderColor: "#EF5625", 
        borderWidth: 2, 
        overflow: "hidden",
        padding: 10
    },
    campoTexto: {backgroundColor: "#F0EADE", height: 500, borderRadius: 15, padding: 20},
    texto: {fontSize: 12, color: "#313131"}
});

export default Anotacoes;