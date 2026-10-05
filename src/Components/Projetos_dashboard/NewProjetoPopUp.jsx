import { Copy, Check } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { Alert, Text, View, StyleSheet, TextInput, Modal, TouchableOpacity } from 'react-native';
import { BlurView } from "expo-blur"
import * as Clipboard from 'expo-clipboard';

import GetIn_button from './GetIn_button';
import GetOut_button from './GetOut_button';

// import's backend
import { projectService } from '../../Services/api';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)", // preto com 60% de opacidade,
        justifyContent: "center",
        alignItems: "center"
    },
    popUp: {
        width: 312,
        backgroundColor: "#313131",
        borderWidth: 3,
        borderColor: "#EF5625",
        borderRadius: 15,
        padding: 20,
        gap: 40
    },
    criar: { fontWeight: "bold", fontSize: 18, color: "#F0EADE" },
    dados: { gap: 10 },
    campo: { flexDirection: "row", gap: 10 },
    labels: { fontSize: 16, color: "#F0EADE" },
    inputs: {
        flex: 1,
        fontSize: 16,
        color: "#F0EADE",
        borderBottomColor: "#EF5625",
        borderBottomWidth: 1,
        outlineStyle: "none"
    },
    areaLink: { alignSelf: "center", gap: 15 },
    linkAviso: { fontSize: 12, color: "#F0EADE", letterSpacing: 1.15, textAlign: "center" },
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
    botoes: { flexDirection: "row", justifyContent: "space-between" }
})

const NewProjetoPopUp = ({ visivel, aoFechar, aoCriarProjeto }) => {

    const [projectName, setProjectName] = useState();
    const [producer, setProducer] = useState();
    const [codRandom, setCodRandom] = useState();
    const [copiado, setCopiado] = useState(false);
    const [loading, setLoading] = useState(false)

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
            //charAt precisa de um índice, que eu vou sortear.
        }
        return resultado;
    }

    const copiarParaClipboard = async () => {

        if (codRandom) {
            await Clipboard.setStringAsync(codRandom);
            setCopiado(true);

            setTimeout(() => { setCopiado(false) }, 2000); // 
        }
    }

    const handleCriar = async () => {
        if (!projectName || !producer) return

        try {
            setLoading(true)
            const novoProjeto = await projectService.create({
                projectName: projectName,
                producer: producer,
                linkInvitation: codRandom
            })
            aoCriarProjeto(novoProjeto)
        } catch (error) {
            console.error('Erro ao criar projeto:', error)
            Alert.alert('Erro', 'Não foi possível criar o projeto. Tente novamente.')
        } finally {
            setLoading(false)
        }
        

        handleCancelar()
    }

    const handleCancelar = () => {
        setProjectName("");
        setProducer("");
        aoFechar();
    }

return (
    <Modal
        visible={visivel}
        transparent={true}
        animationType='fade' // animação suave na hora de aparecer
        onRequestClose={aoFechar} // onRequestClose é pra se o usuário apertar na setinha de voltar do celular
    >
        <BlurView style={styles.overlay} intensity={40} tint='dark'>
            <View style={styles.popUp}>
                <Text style={styles.criar}>Criar Projeto</Text>

                <View style={styles.dados}>
                    <View style={styles.campo}>
                        <Text style={styles.labels}>Nome: </Text>
                        <TextInput value={projectName} onChangeText={setProjectName} style={styles.inputs} />
                    </View>
                    <View style={styles.campo}>
                        <Text style={styles.labels}>Produtora: </Text>
                        <TextInput value={producer} onChangeText={setProducer} style={styles.inputs} />
                    </View>
                </View>

                <View style={styles.areaLink}>

                    <Text style={styles.linkAviso}>Copie o código abaixo e envie para os seus colaboradores de projeto!</Text>

                    <View style={styles.copiarCodigo}>
                        <Text style={styles.codigo}>{(codRandom)}</Text>

                        <TouchableOpacity activeOpacity={0.5} onPress={copiarParaClipboard}>
                            {
                                copiado ? (<Check style={{ color: "#4CAF50" }} />) : (<Copy style={{ color: "#F0EADE" }} />)
                            }
                        </TouchableOpacity>
                    </View>

                </View>

                <View style={styles.botoes}>

                    <TouchableOpacity activeOpacity={0.5} onPress={handleCancelar}>
                        <GetOut_button acao={loading ? "SALVANDO..." : "CRIAR"} />
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={0.5} onPress={handleCriar}>
                        <GetIn_button acao="CRIAR" />
                    </TouchableOpacity>

                </View>
            </View>
        </BlurView>
    </Modal>

)
}

export default NewProjetoPopUp;