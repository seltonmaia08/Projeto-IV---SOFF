import { Copy } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Modal, TouchableOpacity } from 'react-native';
import { BlurView } from "expo-blur"

import GetIn_button from './GetIn_button';
import GetOut_button from './GetOut_button';

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
        gap: 30
    },
    criar: {fontWeight: "bold", fontSize: 18, color: "#F0EADE"},
    dados: {gap: 10},
    campo: {flexDirection: "row", gap: 10},
    labels: {fontSize: 16, color: "#F0EADE"},
    inputs: {
        flex: 1, 
        fontSize: 16, 
        color: "#F0EADE", 
        borderBottomColor: "#EF5625", 
        borderBottomWidth: 1,
        outlineStyle: "none"
    },
    areaLink: {alignSelf: "center", marginTop: 20, gap: 15},
    linkAviso: {fontSize: 12, color: "#F0EADE", letterSpacing: 1.15, textAlign: "center"},
    copiarCodigo: {flexDirection: "row", gap: 10, alignSelf: "center"},
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
    botoes: {flexDirection: "row", justifyContent: "space-between"}
})

const NewProjetoPopUp = ({visivel, aoFechar, aoCriarProjeto}) => {

    const [nome, setNome] = useState();
    const [produtora, setProdutora] = useState();

    const handleCriar = () => {

        aoCriarProjeto({
            id: Date.now().toString(),
            name: nome,
            produt: produtora
        })

        setNome("");
        setProdutora("");
        aoFechar();
    }

    const handleCancelar = () => {
        setNome("");
        setProdutora("");
        aoFechar();
    }

    return(
        <Modal
            visible = {visivel}
            transparent = {true}
            animationType= 'fade' // animação suave na hora de aparecer
            onRequestClose={aoFechar} // onRequestClose é pra se o usuário apertar na setinha de voltar do celular
        >
            <BlurView style={styles.overlay} intensity={40} tint='dark'>
                <View style={styles.popUp}>
                    <Text style={styles.criar}>Criar Projeto</Text>

                    <View style={styles.dados}>
                        <View style={styles.campo}>
                            <Text style={styles.labels}>Nome: </Text>
                            <TextInput value={nome} onChangeText={setNome} style={styles.inputs}/>
                        </View>
                        <View style={styles.campo}>
                            <Text style={styles.labels}>Produtora: </Text>
                            <TextInput value={produtora} onChangeText={setProdutora} style={styles.inputs}/>
                        </View>
                    </View>

                    <View style={styles.areaLink}>
                        <Text style={styles.linkAviso}>Copie o link abaixo e envie para os seus colaboradores de projeto!</Text>
                        <View style={styles.copiarCodigo}>
                            <Text style={styles.codigo}>(código randômico)</Text>

                            <TouchableOpacity activeOpacity={0.5}>
                                <Copy style={{color: "#F0EADE"}}/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.botoes}>

                        <TouchableOpacity activeOpacity={0.5} onPress={handleCancelar}>
                            <GetOut_button acao = "CANCELAR"/>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.5} onPress={handleCriar}>
                            <GetIn_button acao = "CRIAR"/>
                        </TouchableOpacity>

                    </View>
                </View>
            </BlurView>
        </Modal>
        
    )
}

export default NewProjetoPopUp;