import { View, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import { X } from 'lucide-react-native';

import CustomText from '../Text/CustomText';
import GetIn_button from '../Projetos_dashboard/GetIn_button';
import GetOut_button from '../Projetos_dashboard/GetOut_button';
import ConfirmacaoPopUp from "../ConfirmPopUp/ConfirmacaoPopUp"

function LerAnotacao({visivel, title, note, aoFechar, aoExcluir, aoSalvar}) {

    const [titulo, setTitulo] = useState(title);

    
    const [anotacoes, setAnotacoes] = useState(note);
    const [aviso, setAviso] = useState(false);

    useEffect(
        () => {
            setTitulo(title);
            setAnotacoes(note);
        }, [title, note]
    )

    const excluirEFechar = () => {
        aoExcluir(title);
        setAviso(false);
        aoFechar();
    }

    const enviarNovaNota = () => {
        aoSalvar(titulo, anotacoes);
        aoFechar();
    }

    return(
        <Modal visible={visivel} animationType='fade' transparent={true}>
            <BlurView style={styles.overlay} tint='dark' intensity={40}>

                <View style={styles.geral}>
                    
                    <View style={styles.escopo}>
                        
                        <View style={styles.card}>
                            <View style={styles.superior}>
                                <CustomText>Título da Nota</CustomText>
                                <TouchableOpacity style={styles.x} activeOpacity={0.5} onPress={aoFechar}>
                                    <X style={{color:"#DAD0B7"}}/>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.campoTitulo}>
                                <TextInput value={titulo} onChangeText={setTitulo} style={styles.texto}></TextInput>
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
                                ></TextInput>
                            </View>
                                <View style={styles.botoes}>

                                <TouchableOpacity activeOpacity={0.5} onPress={() => setAviso(true)}>
                                    <GetOut_button acao="EXCLUIR"/>
                                </TouchableOpacity>

                                <TouchableOpacity activeOpacity={0.5} onPress={enviarNovaNota}>
                                    <GetIn_button acao="SALVAR"/>
                                </TouchableOpacity>
                                
                            </View>
                            <ConfirmacaoPopUp
                                visivel={aviso}
                                aoCancelar={() => setAviso(false)}
                                aoExecutar={excluirEFechar}
                                mensagem={"essa nota"}
                            />
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
        padding: 15,
        gap: 10
    },
    card: {gap: 10},
    superior: {flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"},
    x: {padding: 1},
    campoTitulo: {backgroundColor: "#DAD0B7", height: 50, borderRadius: 15, paddingHorizontal: 10, justifyContent: "center"},
    campoTexto: {backgroundColor: "#DAD0B7", height: 200, borderRadius: 15, padding: 10, fontSize: 12},
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

export default LerAnotacao;