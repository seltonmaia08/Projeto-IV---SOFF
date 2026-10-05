import { View, StyleSheet, TouchableOpacity } from 'react-native';

import CustomText from '../src/Components/Text/CustomText';
import GetIn_button from './GetIn_button';
import GetOut_button from './GetOut_button';

const styles = StyleSheet.create({
    escopo: {
        width: 300, 
        backgroundColor: "#F0EADE",
        padding: 20, 
        alignItems: "center",
        borderRadius: 15,
        borderTopWidth: 15,
        borderTopColor: "#EF5625",
        gap: 20
    },
    alerta: {fontSize: 14, color: "#313131", textAlign: "center"},
    laranja: {color: "#EF5625"},
    botoes: {flexDirection: "row", gap: 30}
})

const ConfirmacaoPopUp = () => {

    return(

        <View style={styles.escopo}>

            <CustomText style={styles.alerta}>Você realmente deseja <View style={styles.laranja}>excluir</View> o projeto (nome do projeto)?</CustomText>

            <View style={styles.botoes}>

                <TouchableOpacity activeOpacity={0.7}>
                    <GetOut_button acao = "NÃO"/>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.7}>
                    <GetIn_button acao = "SIM" />
                </TouchableOpacity>

            </View>

        </View>
    )
}

export default ConfirmacaoPopUp;