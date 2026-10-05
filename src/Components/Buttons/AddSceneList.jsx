import { StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "../Text/CustomText";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";

const AddSceneList = ({ onPress }) => {
    return (
        <TouchableOpacity 
            onPress={onPress}
            style={styles.button}>
            <Plus size={16} color={'#313131'} />
            <CustomText style={styles.textButton}>Adicionar Cena</CustomText>
        </TouchableOpacity >
    )
}

export default AddSceneList

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 58,
        borderRadius: 15,
        backgroundColor: '#F0EADE',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10
    },
    textButton: {
        color: '#313131',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 2,
        fontWeight: 'bold'
    },

})