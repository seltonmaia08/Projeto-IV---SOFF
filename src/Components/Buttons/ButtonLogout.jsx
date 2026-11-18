import { StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "../Text/CustomText";
import { LogOut as LogOutIcon } from "lucide-react-native";
import { supabase } from "../../Utils/Supabase";

const LogOut = ({ style }) => {

    const logout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    };

    return (
        <TouchableOpacity 
            style={[styles.btn, style]}
            onPress={logout}
            activeOpacity={0.7}
        >
            <CustomText style={styles.text}>LOGOUT</CustomText>
            <LogOutIcon size={18} color="#DAD0B7" />
        </TouchableOpacity>
    );
};

export default LogOut;

const styles = StyleSheet.create({
    btn: {
        width: "100%",
        height: 50,
        backgroundColor: "#EF5625",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
    },
    text: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#DAD0B7",
        textAlign: "center",
        letterSpacing: 1.2
    }
});
