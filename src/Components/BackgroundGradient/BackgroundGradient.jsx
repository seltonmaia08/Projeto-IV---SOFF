import { LinearGradient } from "expo-linear-gradient";
import { Flame } from "lucide-react-native";
import { StyleSheet } from "react-native";

const BackgroundGradient = ({ children }) => {
    return(
        <LinearGradient
            colors={['#EF5625', '#893115']}
            style={styles.container}
            start={{x: 1, y: 0}}
            end={{x: 1, y: 1}}
        >
            { children }
        </LinearGradient>
    )
} 

export default BackgroundGradient

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 2,
        paddingHorizontal: 2,
        borderRadius: 15,
    }
})