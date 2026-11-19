import { Copy, Check } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BlurView } from "expo-blur";
import * as Clipboard from 'expo-clipboard';

import GetInGreen_button from './GetInGreen_button';
import GetOut_button from './GetOut_button';
import CustomText from '../Text/CustomText';
import AlertaGeral from '../Alerta/AlertaGeral';

// import's backend
import { projectService, projectMemberService } from '../../Services/api';
import { useAuth } from '../../Context/AuthContext';


const NewProjetoPopUp = ({ visivel, aoFechar, aoCriarProjeto }) => {

    const { user } = useAuth();
    const [projectName, setProjectName] = useState();
    const [producer, setProducer] = useState();
    const [codRandom, setCodRandom] = useState();
    const [copiado, setCopiado] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(
        () => {
            if (visivel) {
                setCodRandom(gerarAleatório());
                setCopiado(false);
            }
        }, [visivel]
    );

    const gerarAleatório = () => {
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        let resultado = "";
        for (let i = 0; i < 8; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return resultado;
    };

    const copiarParaClipboard = async () => {
        if (codRandom) {
            await Clipboard.setStringAsync(codRandom);
            setCopiado(true);
            setTimeout(() => { setCopiado(false); }, 2000);
        }
    };

    const handleCriar = async () => {
        if (!projectName || !producer) return;

        try {
            setLoading(true);
            // 1. Cria o projeto incluindo o idUser do criador
            const novoProjeto = await projectService.create({
                projectName: projectName,
                producer: producer,
                linkInvitation: codRandom,
                idUser: user?.id
            });

            // 2. Adiciona o criador como membro do projeto com cargo "Proprietário"
            if (novoProjeto?.idProject && user?.id) {
                try {
                    await projectMemberService.create({
                        idProject: novoProjeto.idProject,
                        idUser: user.id,
                        cargo: "Proprietário"
                    });
                } catch (memberErr) {
                    console.warn('Aviso ao registrar criador em ProjectMember:', memberErr);
                }
            }

            aoCriarProjeto(novoProjeto);
        } catch (error) {
            console.error('Erro ao criar projeto:', error);
            AlertaGeral.alert('Erro', 'Não foi possível criar o projeto. Tente novamente.');
        } finally {
            setLoading(false);
        }

        handleCancelar();
    };

    const handleCancelar = () => {
        setProjectName("");
        setProducer("");
        aoFechar();
    };

    return (
        <Modal
            visible={visivel}
            transparent={true}
            animationType='fade'
            onRequestClose={aoFechar}
        >
            <BlurView style={styles.overlay} intensity={40} tint='dark'>
                <View style={styles.popUp}>
                    <CustomText style={styles.criar}>Criar Projeto</CustomText>

                    <View style={styles.dados}>
                        <View style={styles.campo}>
                            <CustomText style={styles.labels}>Nome: </CustomText>
                            <TextInput
                                value={projectName}
                                onChangeText={setProjectName}
                                placeholderTextColor={'#5F5F5F'}
                                style={styles.inputs} />
                        </View>
                        <View style={styles.campo}>
                            <CustomText style={styles.labels}>Produtora: </CustomText>
                            <TextInput
                                value={producer}
                                onChangeText={setProducer}
                                placeholderTextColor={'#5F5F5F'}
                                style={styles.inputs} />
                        </View>
                    </View>

                    <View style={styles.areaLink}>
                        <Text style={styles.linkAviso}>Copie o código abaixo e envie para os seus colaboradores de projeto!</Text>

                        <View style={styles.copiarCodigo}>
                            <CustomText style={styles.codigo}>{(codRandom)}</CustomText>

                            <TouchableOpacity activeOpacity={0.5} onPress={copiarParaClipboard}>
                                {
                                    copiado ? (<Check style={{ color: "#4CAF50" }} />) : (<Copy style={{ color: "#DAD0B7" }} />)
                                }
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.botoes}>
                        <TouchableOpacity activeOpacity={0.5} onPress={handleCancelar}>
                            <GetOut_button acao="CANCELAR" />
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.5} onPress={handleCriar} disabled={loading}>
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color="#DAD0B7" />
                                </View>
                            ) : (
                                <GetInGreen_button acao="CRIAR" />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center"
    },
    popUp: {
        width: 312,
        backgroundColor: "#313131",
        borderRadius: 15,
        padding: 20,
        gap: 40
    },
    criar: { fontWeight: "bold", fontSize: 18, color: "#DAD0B7" },
    dados: { gap: 10 },
    campo: { flexDirection: "row", gap: 10, justifyContent: 'flex-end', alignItems: 'center' },
    labels: { fontSize: 16, color: "#DAD0B7" },
    inputs: {
        flex: 1,
        fontSize: 16,
        color: "#DAD0B7",
        borderBottomColor: "#EF5625",
        borderBottomWidth: 1,
        outlineStyle: "none"
    },
    areaLink: { alignSelf: "center", gap: 15 },
    linkAviso: { fontSize: 12, color: "#DAD0B7", letterSpacing: 1.15, textAlign: "center" },
    copiarCodigo: { flexDirection: "row", gap: 10, alignSelf: "center" },
    codigo: {
        fontSize: 12,
        color: "#EF5625",
        letterSpacing: 1.15,
        textAlign: "center",
        fontWeight: "bold",
        paddingBottom: 5,
        borderBottomColor: "#EF5625",
        borderBottomWidth: 1,
        alignSelf: "center"
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

export default NewProjetoPopUp;
