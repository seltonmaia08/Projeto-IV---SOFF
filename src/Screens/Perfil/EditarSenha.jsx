import { View, StyleSheet, TouchableOpacity, TextInput, Modal, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';

import CustomText from '../../Components/Text/CustomText';
import GetInGreen_button from '../../Components/Projetos_dashboard/GetInGreen_button';
import GetOut_button from '../../Components/Projetos_dashboard/GetOut_button';
import { useAuth } from '../../Context/AuthContext';
import { supabase } from '../../Utils/Supabase';
import AlertaGeral from '../../Components/Alerta/AlertaGeral';

function EditarSenha({ visivel, aoFechar, aoSalvar }) {
    const { user } = useAuth();

    const [confirmSenha, setConfirmSenha] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmNovaSenha, setConfirmNovaSenha] = useState("");
    const [mudarSenhaDisponivel, setMudarSenhaDisponivel] = useState(false);
    const [botaoDisponivel, setBotaoDisponivel] = useState(false);
    const [senhaIncorreta, setSenhaIncorreta] = useState(false);
    const [validando, setValidando] = useState(false);
    const [salvando, setSalvando] = useState(false);

    useEffect(() => {
        if (!novaSenha || novaSenha.length < 6) {
            setBotaoDisponivel(false);
        } else {
            if (novaSenha === confirmNovaSenha) {
                setBotaoDisponivel(true);
            } else {
                setBotaoDisponivel(false);
            }
        }
    }, [novaSenha, confirmNovaSenha]);

    async function handleConfirmarSenha() {
        if (!confirmSenha || !user?.email) return;

        try {
            setValidando(true);
            const { error } = await supabase.auth.signInWithPassword({
                email: user.email,
                password: confirmSenha,
            });

            if (error) {
                setMudarSenhaDisponivel(false);
                setSenhaIncorreta(true);
                setTimeout(() => {
                    setSenhaIncorreta(false);
                }, 2500);
            } else {
                setMudarSenhaDisponivel(true);
            }
        } catch (e) {
            setMudarSenhaDisponivel(false);
            setSenhaIncorreta(true);
            setTimeout(() => {
                setSenhaIncorreta(false);
            }, 2500);
        } finally {
            setValidando(false);
        }
    }

    function handleFechar() {
        setConfirmSenha("");
        setNovaSenha("");
        setConfirmNovaSenha("");
        setMudarSenhaDisponivel(false);
        setSenhaIncorreta(false);
        aoFechar();
    }

    async function handleSalvar() {
        if (!novaSenha || novaSenha !== confirmNovaSenha) return;

        try {
            setSalvando(true);
            const { error } = await supabase.auth.updateUser({
                password: novaSenha,
            });

            if (error) throw error;

            aoSalvar(novaSenha);
            handleFechar();
        } catch (err) {
            console.error("Erro ao alterar senha:", err);
            AlertaGeral.alert("Erro", err.message || "Não foi possível alterar a senha.");
        } finally {
            setSalvando(false);
        }
    }

    return (
        <Modal visible={visivel} animationType='fade' transparent={true} onRequestClose={handleFechar}>
            <BlurView style={styles.overlay} tint='dark' intensity={40}>
                <View style={styles.geral}>
                    <View style={styles.escopo}>
                        <CustomText style={styles.titulo}>Alterar Senha</CustomText>

                        <View style={styles.card}>
                            <View style={styles.superior}>
                                <CustomText>Confirme a senha antiga:</CustomText>
                            </View>
                            <View style={styles.campoName}>
                                <TextInput
                                    value={confirmSenha}
                                    onChangeText={setConfirmSenha}
                                    style={styles.texto}
                                    secureTextEntry={true}
                                />
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={styles.botaoSenha} 
                            onPress={handleConfirmarSenha} 
                            activeOpacity={0.7}
                            disabled={validando || !confirmSenha}
                        >
                            {validando ? (
                                <ActivityIndicator color="#DAD0B7" />
                            ) : (
                                <CustomText style={styles.botaoSenhaText}>CONFIRMAR</CustomText>
                            )}
                        </TouchableOpacity>

                        {senhaIncorreta && (
                            <CustomText style={styles.senhaIncorreta}>Senha incorreta!</CustomText>
                        )}

                        <View style={styles.linha}></View>

                        {mudarSenhaDisponivel ? (
                            <View style={styles.alterarVisivel}>
                                <View style={styles.card}>
                                    <CustomText>Nova senha (mínimo 6 caracteres)</CustomText>
                                    <View style={styles.campoName}>
                                        <TextInput
                                            style={styles.texto}
                                            value={novaSenha}
                                            onChangeText={setNovaSenha}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                </View>

                                <View style={styles.card}>
                                    <CustomText>Confirme a nova senha</CustomText>
                                    <View style={styles.campoName}>
                                        <TextInput
                                            style={styles.texto}
                                            value={confirmNovaSenha}
                                            onChangeText={setConfirmNovaSenha}
                                            secureTextEntry={true}
                                        />
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View style={styles.alterarVisivel}>
                                <View style={styles.card}>
                                    <CustomText style={styles.senhaIndisponivel}>Nova senha</CustomText>
                                    <View style={styles.campoNameIndisponivel}></View>
                                </View>

                                <View style={styles.card}>
                                    <CustomText style={styles.senhaIndisponivel}>Confirme a nova senha</CustomText>
                                    <View style={styles.campoNameIndisponivel}></View>
                                </View>
                            </View>
                        )}

                        <View style={styles.botoes}>
                            <TouchableOpacity activeOpacity={0.5} onPress={handleFechar}>
                                <GetOut_button acao="CANCELAR" />
                            </TouchableOpacity>

                            {botaoDisponivel ? (
                                <TouchableOpacity 
                                    activeOpacity={0.5} 
                                    onPress={handleSalvar}
                                    disabled={salvando}
                                >
                                    {salvando ? (
                                        <View style={[styles.botaoIndisponivel, { backgroundColor: "#116646" }]}>
                                            <ActivityIndicator color="#DAD0B7" />
                                        </View>
                                    ) : (
                                        <GetInGreen_button acao="SALVAR" />
                                    )}
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.botaoIndisponivel}>
                                    <CustomText style={styles.botaoIndisponivelTexto}>SALVAR</CustomText>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
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
        gap: 20
    },
    titulo: { fontWeight: "bold", fontSize: 16 },
    linha: { borderColor: "#DAD0B7", borderBottomWidth: 1 },
    card: { gap: 10 },
    superior: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
    campoName: { backgroundColor: "#DAD0B7", height: 50, borderRadius: 15, paddingHorizontal: 10, justifyContent: "center" },
    texto: {
        fontSize: 14,
        color: "#313131",
        textAlign: "justify",
        textAlignVertical: "center",
        flex: 1,
    },
    senhaIncorreta: { color: "#e05353", textAlign: "center" },
    botaoSenha: { backgroundColor: "#383838", height: 50, borderRadius: 15, paddingHorizontal: 10, justifyContent: "center" },
    botaoSenhaText: { textAlign: "center", fontWeight: "bold" },
    botoes: { flexDirection: "row", justifyContent: "space-between" },
    botaoIndisponivel: {
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        backgroundColor: "#383838", 
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 90,
    },
    alterarVisivel: { gap: 20 },
    senhaIndisponivel: { color: "#5F5F5F" },
    campoNameIndisponivel: { backgroundColor: "#383838", height: 50, borderRadius: 15, paddingHorizontal: 10, justifyContent: "center" },
    botaoIndisponivelTexto: { fontSize: 14, color: "#5F5F5F", fontWeight: "bold" }
});

export default EditarSenha;
