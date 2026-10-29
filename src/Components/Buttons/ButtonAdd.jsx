import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Plus, X } from "lucide-react-native";

const ButtonAdd = ({ onPress, isActive }) => {

    return (
        <View style={styles.containerButton}>
            <TouchableOpacity
                style={styles.buttonAdd}
                onPress={onPress}
            >
                {
                    isActive ?
                    (<X size={36} color={'#F0EADE'} />)
                    :
                    (<Plus size={36} color={'#F0EADE'} />)

                }
            </TouchableOpacity>
        </View>
    )
}

export default ButtonAdd

const styles = StyleSheet.create({
    containerButton: {
        position: 'absolute',
        right: 30,
        bottom: 20,
        elevation: 6,
        borderRadius: 100,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 8,
        zIndex: 99
    },
    buttonAdd: {
        width: 64,
        height: 64,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#EF5625",
        borderRadius: 100,
        zIndex: 10,
    }
})