import { StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import CustomText from "../Text/CustomText";
import { LogOut as LogOutIcon } from "lucide-react-native";
import { supabase } from "../../Utils/Supabase";
import { useState } from "react";

const LogOut = ({ style }) => {

    const [loading, setLoading] = useState(false);

    const logout = async () => {
        try {
            setLoading(true);
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Erro ao sair:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity 
            style={[styles.btn, style]}
            onPress={logout}
            activeOpacity={0.7}
            disabled={loading}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#242424" />
            ) : (
                <>
                    <CustomText style={styles.text}>LOGOUT</CustomText>
                    <LogOutIcon size={18} color="#242424" />
                </>
            )}
        </TouchableOpacity>
    );
};

export default LogOut;

const styles = StyleSheet.create({
    btn: {
        width: "100%",
        height: 50,
        backgroundColor: "#F68E49",
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
    },
    text: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#242424",
        textAlign: "center",
        letterSpacing: 1.2
    }
});
