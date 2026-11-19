import { StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import CustomText from "../Text/CustomText";

const ButtonSave = ({ onPress, loading }) => {

    return (
        <TouchableOpacity
            disabled={loading}
            style={styles.buttonSave}
            onPress={onPress}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#F0EADE" />
            ) : (
                <CustomText style={styles.text}>Adicionar</CustomText>
            )}
        </TouchableOpacity>
    )
}

export default ButtonSave

const styles = StyleSheet.create({
    buttonSave: {
        width: '48.5%',
        height: 54,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: '#1B8F65',
    },

    text: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2
    }
})