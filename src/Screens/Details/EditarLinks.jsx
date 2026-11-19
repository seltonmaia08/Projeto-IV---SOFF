import { View, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';

import CustomText from '../../Components/Text/CustomText';
import GetInGreen_button from '../../Components/Projetos_dashboard/GetInGreen_button';
import GetOut_button from '../../Components/Projetos_dashboard/GetOut_button';

function EditarLinks({ visivel, aoFechar, linksIniciais, aoSalvar }) {

    const [textoEditavel, setTextoEditavel] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(

        () => {
            if (visivel) {
                setTextoEditavel(linksIniciais);
                setLoading(false);
            }
        }, [visivel, linksIniciais]);

    const handleSalvar = async () => {
        setLoading(true);
        try {
            await aoSalvar(textoEditavel);
            aoFechar();
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal visible={visivel} animationType='fade' transparent={true}>
            <BlurView style={styles.overlay} tint='dark' intensity={40}>

                <View style={styles.geral}>

                    <View style={styles.escopo}>

                        <View style={styles.card}>
                            <View style={styles.superior}>
                                <CustomText>Coloque 1 link por linha</CustomText>
                            </View>
                            <View style={styles.campoName}>
                                <TextInput
                                    style={styles.texto}
                                    multiline={true}
                                    value={textoEditavel}
                                    onChangeText={setTextoEditavel}
                                    placeholder="Cole os links, um por linha."
                                    placeholderTextColor={'#5F5F5F'}

                                />
                            </View>
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
        gap: 15
    },
    card: { gap: 10 },
    superior: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    campoName: {
        backgroundColor: "#DAD0B7",
        height: 400,
        borderRadius: 15,
        padding: 10,
        gap: 15,
    },
    texto: {
        fontSize: 14,
        color: "#313131",
        flex: 1,
        outlineStyle: "none"
    },
    links: { color: "#313131" },
    botao: {
        width: "100%",
        backgroundColor: "#DAD0B7",
        padding: 10,
        borderRadius: 15
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
})

export default EditarLinks;