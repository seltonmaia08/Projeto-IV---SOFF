import { View, StyleSheet, TouchableOpacity, TextInput, Modal, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import CustomText from '../Text/CustomText';
import GetIn_button from '../Projetos_dashboard/GetIn_button';
import GetOut_button from '../Projetos_dashboard/GetOut_button';

function AnotacoesPopUp({visivel, textoInicial, aoFechar, aoSalvar}) {

    const [titulo, setTitulo] = useState("");
    const [anotacoes, setAnotacoes] = useState(textoInicial);

    useEffect(
        () => {if(visivel){setAnotacoes(textoInicial)}
        }, [visivel, textoInicial]
    )

    return(
        <Modal visible={visivel} animationType='fade' transparent={true}>
            <BlurView style={styles.overlay} tint='dark' intensity={40}>

                <View style={styles.geral}>
                    
                    <View style={styles.escopo}>
                        
                        <View style={styles.card}>
                            <CustomText>Título da nota</CustomText>
                            <View style={styles.campoTitulo}>
                                <TextInput value={titulo} onChangeText={setTitulo} style={styles.texto}></TextInput>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <CustomText>Anotações</CustomText>
                            <View style={styles.campoTexto}>
                                <TextInput
                                    style={styles.texto}
                                    value={anotacoes}
                                    onChangeText={setAnotacoes} 
                                    multiline={true}
                                ></TextInput>
                            </View>
                        </View>

                        <View style={styles.botoes}>

                            <TouchableOpacity activeOpacity={0.5} onPress={aoFechar}>
                                <GetOut_button acao="CANCELAR"/>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.5} onPress={() => aoSalvar(anotacoes)}>
                                <GetIn_button acao="SALVAR"/>
                            </TouchableOpacity>
                            
                        </View>
                    </View>
                </View>
            </BlurView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: "center", alignItems: "center"},
    geral: {gap: 10},
    escopo: {
        width: 320,
        borderRadius: 15, 
        backgroundColor: "#313131",
        overflow: "hidden",
        padding: 10,
        gap: 20
    },
    card: {gap: 10},
    campoTitulo: {backgroundColor: "#F0EADE", height: 50, borderRadius: 15, padding: 10, justifyContent: "center"},
    campoTexto: {backgroundColor: "#F0EADE", height: 200, borderRadius: 15, padding: 10},
    texto: {
        fontSize: 14,
        color: "#313131",
        textAlign: "justify",
        textAlignVertical: "top",
        flex: 1,
        outlineStyle: "none"
    },
    botoes: {flexDirection: "row", justifyContent: "space-between"}
});

export default AnotacoesPopUp;