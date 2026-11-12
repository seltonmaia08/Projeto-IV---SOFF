import { StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "../Text/CustomText";
import { LogOutIcon } from "lucide-react-native";
import { supabase } from "../../Utils/Supabase";
import { useAuth } from "../../Context/AuthContext";

const LogOut = () => {

    const { user } = useAuth()

    const logout = async () => {
        await supabase.auth.signOut()
    }

    return(
        <TouchableOpacity 
            style={styles.btn}
            onPress={logout}        >
            <CustomText style={styles.text}>Sair</CustomText>
            
        </TouchableOpacity>
    )
}

export default LogOut

const styles = StyleSheet.create({
    btn: {
        width: 150,
        height: 60,
        borderColor: 'red',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 20,
        borderRadius: 15,
    },
    text: {
        textTransform: 'uppercase',
        textAlign: 'center',
        letterSpacing: 1
    }
})