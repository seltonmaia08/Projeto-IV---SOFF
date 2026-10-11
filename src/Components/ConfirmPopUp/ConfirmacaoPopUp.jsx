import { View, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { BlurView } from 'expo-blur';

import CustomText from '../Text/CustomText';
import GetIn_button from '../Projetos_dashboard/GetIn_button';
import GetOut_button from '../Projetos_dashboard/GetOut_button';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)", // preto com 60% de opacidade,
        justifyContent: "center",
        alignItems: "center"
    },
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

const ConfirmacaoPopUp = ({visivel, aoCancelar, aoExecutar, mensagem}) => {


    return(
        <Modal
            visible={visivel}
            transparent={true}
            animationType='fade'
            onRequestClose={aoCancelar}
        >
            <BlurView style={styles.overlay} tint='dark' intensity={40}>

                <View style={styles.escopo}>

                    <CustomText style={styles.alerta}>Você realmente deseja <CustomText style={styles.laranja}>excluir</CustomText> {mensagem}?</CustomText>

                    <View style={styles.botoes}>

                        <TouchableOpacity activeOpacity={0.7} onPress={() => aoCancelar()}>
                            <GetOut_button acao = "NÃO"/>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.7} onPress={() => aoExecutar()}>
                            <GetIn_button acao = "SIM" />
                        </TouchableOpacity>

                    </View>

                </View>

            </BlurView>
        </Modal>
    )
}

export default ConfirmacaoPopUp;