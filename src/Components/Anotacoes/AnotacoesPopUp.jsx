import { View, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { BlurView } from 'expo-blur';
import CustomText from '../Text/CustomText';
import GetInGreen_button from '../Projetos_dashboard/GetInGreen_button';
import GetOut_button from '../Projetos_dashboard/GetOut_button';

function AnotacoesPopUp({ visivel, aoFechar, aoSalvar }) {

    const [titulo, setTitulo] = useState("");
    const [anotacoes, setAnotacoes] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(
        () => {
            setTitulo("");
            setAnotacoes("");
            setLoading(false);
        }, [visivel]
    )

    const handleSalvar = async () => {
        setLoading(true);
        try {
            await aoSalvar(titulo, anotacoes);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visivel} animationType='fade' transparent={true}>
            <BlurView style={styles.overlay} tint='dark' intensity={40}>

                <View style={styles.geral}>

                    <View style={styles.escopo}>

                        <View style={styles.card}>
                            <CustomText>Título da Nota</CustomText>
                            <View style={styles.campoTitulo}>
                                <TextInput
                                    value={titulo}
                                    onChangeText={setTitulo}
                                    placeholderTextColor={'#5F5F5F'}
                                    style={styles.texto}></TextInput>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <CustomText>Anotação</CustomText>
                            <View style={styles.campoTexto}>
                                <TextInput
                                    style={styles.texto}
                                    value={anotacoes}
                                    onChangeText={setAnotacoes}
                                    multiline={true}
                                    placeholderTextColor={'#5F5F5F'}
                                ></TextInput>
                            </View>
                            <View style={styles.botoes}>

                                <TouchableOpacity activeOpacity={0.5} onPress={aoFechar} disabled={loading}>
                                    <GetOut_button acao="CANCELAR" />
                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.5} onPress={handleSalvar} disabled={loading}>
                                    {loading ? (
                                        <View style={styles.loadingContainer}>
                                            <ActivityIndicator size="small" color="#DAD0B7" />
                                        </View>
                                    ) : (
                                        <GetInGreen_button acao="SALVAR" />
                                    )}
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </View>
            </BlurView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: "center", alignItems: "center" },
    geral: { gap: 10 },
    escopo: {
        width: 320,
        borderRadius: 15,
        backgroundColor: "#313131",
        overflow: "hidden",
        padding: 15,
        gap: 10
    },
    card: { gap: 10 },
    campoTitulo: { backgroundColor: "#F0EADE", height: 50, borderRadius: 15, paddingHorizontal: 10, justifyContent: "center" },
    campoTexto: { backgroundColor: "#F0EADE", height: 200, borderRadius: 15, padding: 10, fontSize: 12 },
    texto: {
        fontSize: 14,
        color: "#313131",
        textAlign: "justify",
        textAlignVertical: "top",
        flex: 1,
        outlineStyle: "none"
    },
    botoes: { flexDirection: "row", justifyContent: "space-between" },
    loadingContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#1B8F65",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 70,
    }
});

export default AnotacoesPopUp;