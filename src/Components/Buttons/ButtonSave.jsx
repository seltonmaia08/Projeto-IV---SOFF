import { StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "../Text/CustomText";

const ButtonSave = ({ onPress }) => {
    return (
        <TouchableOpacity
            style={styles.buttonSave}
            onPress={onPress}
        >
            <CustomText style={styles.text}>Adicionar</CustomText>
        </TouchableOpacity>
    )
}

export default ButtonSave

const styles = StyleSheet.create({
    buttonSave: {
        width: 140,
        height: 54,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: '#EF5625'
    },

    text: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2
    }
})