import { StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "../Text/CustomText";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";

const AddSceneList = ({ title, onPress }) => {
    return (
        <TouchableOpacity 
            onPress={onPress}
            style={styles.button}
            activeOpacity={0.5}
        >
            <Plus size={16} color={'#313131'} />
            <CustomText style={styles.textButton}>{title}</CustomText>
        </TouchableOpacity >
    )
}

export default AddSceneList

const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 58,
        borderRadius: 15,
        backgroundColor: '#DAD0B7',
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