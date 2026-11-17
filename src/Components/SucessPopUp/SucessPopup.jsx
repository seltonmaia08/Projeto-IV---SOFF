import { View, StyleSheet, Modal } from 'react-native';
import { BlurView } from 'expo-blur';

import CustomText from '../Text/CustomText';

function SucessPopup({visivel, mensagem}) {

    return (
        <Modal
            visible = {visivel}
            animationType='fade'
            transparent = {true}
        >
            <BlurView style={styles.overlay} tint='dark' intensity={40}>

                <CustomText style={styles.mensagem}>{mensagem}</CustomText>

            </BlurView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.6)"},
    mensagem: {
        padding: 20, 
        backgroundColor: "#1B8F65", 
        fontSize: 16, 
        fontWeight: "bold",
        borderRadius: 15
    }
})

export default SucessPopup;