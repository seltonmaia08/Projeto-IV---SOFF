import { StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "../Text/CustomText";

const ButtonCancel = ({ onPress }) => {
    return (
        <TouchableOpacity
            style={styles.buttonCancel}
            onPress={onPress}
        >
            <CustomText style={styles.text}>Cancelar</CustomText>
        </TouchableOpacity>
    )
}

export default ButtonCancel

// Ajustar o estilo desse botão
const styles = StyleSheet.create({
    buttonCancel: {
        width: 140,
        height: 54,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: '#5F5F5F'
    },

    text: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2
    }
})