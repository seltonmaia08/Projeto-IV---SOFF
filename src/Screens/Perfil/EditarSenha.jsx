import { View, StyleSheet, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';

import CustomText from '../../Components/Text/CustomText';
import GetInGreen_button from '../../Components/Projetos_dashboard/GetInGreen_button';
import GetOut_button from '../../Components/Projetos_dashboard/GetOut_button';

function EditarSenha({visivel, senhaAtual, aoFechar, aoSalvar}) {

    const [userPassword, setUserPassword] = useState(senhaAtual);
    const [confirmSenha, setConfirmSenha] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmNovaSenha, setConfirmNovaSenha] = useState("");
    const [mudarSenhaDisponivel, setMudarSenhaDisponivel] = useState(false);
    const [botaoDisponivel, setBotaoDisponivel] = useState(false);

    useEffect(

        () => {

            if(novaSenha == "") {setBotaoDisponivel(false)}
            else {

                if(novaSenha === confirmNovaSenha) {setBotaoDisponivel(true)}
                else {setBotaoDisponivel(false)}
            }

        }, [novaSenha, confirmNovaSenha]
    )

    function handleConfirmarSenha() {
        if(confirmSenha === userPassword) {setMudarSenhaDisponivel(true)}
        else {setMudarSenhaDisponivel(false)}
    }

    function handleFechar() {
        setUserPassword(senhaAtual);
        setConfirmSenha("");
        setNovaSenha("");
        setConfirmNovaSenha("");
        setMudarSenhaDisponivel(false);
        aoFechar();
    }

    function handleSalvar() {
        aoSalvar(novaSenha);
        setUserPassword(novaSenha);
        setConfirmSenha("");
        setNovaSenha("");
        setConfirmNovaSenha("");
        setMudarSenhaDisponivel(false);
        aoFechar();
    }

    return(
        <Modal visible={visivel} animationType='fade' transparent={true}>
            <BlurView style={styles.overlay} tint='dark' intensity={40}>

                <View style={styles.geral}>
                    
                    <View style={styles.escopo}>
                        
                        <View style={styles.card}>
                            <View style={styles.superior}>
                                <CustomText>Confirme a senha antiga:</CustomText>
                            </View>
                            <View style={styles.campoName}>
                                <TextInput value={confirmSenha} onChangeText={setConfirmSenha} style={styles.texto}></TextInput>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.botaoSenha} onPress={handleConfirmarSenha} activeOpacity={0.7}>
                            <CustomText style={styles.botaoSenhaText}>CONFIRMAR</CustomText>
                        </TouchableOpacity>
                        <View style={styles.linha}></View>

                        {
                            mudarSenhaDisponivel ? 
                                <View style={styles.alterarVisivel}>
                                    <View style={styles.card}>
                                        <CustomText>Nova senha</CustomText>
                                        <View style={styles.campoName}>
                                            <TextInput
                                                style={styles.texto}
                                                value={novaSenha}
                                                onChangeText={setNovaSenha}
                                            ></TextInput>
                                        </View>
                                    </View>

                                    <View style={styles.card}>
                                        <CustomText>Confirme a nova senha</CustomText>
                                        <View style={styles.campoName}>
                                            <TextInput
                                                style={styles.texto}
                                                value={confirmNovaSenha}
                                                onChangeText={setConfirmNovaSenha}
                                            ></TextInput>
                                        </View>
                                    </View>
                                </View>

                            :

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
                        }


                        <View style={styles.botoes}>

                            <TouchableOpacity activeOpacity={0.5} onPress={handleFechar}>
                                <GetOut_button acao="CANCELAR"/>
                            </TouchableOpacity>

                            {
                                botaoDisponivel ?
                                    <TouchableOpacity activeOpacity={0.5} onPress={handleSalvar}>
                                        <GetInGreen_button acao="SALVAR"/>
                                    </TouchableOpacity>
                                :

                                <View style={styles.botaoIndisponivel}><CustomText style={styles.botaoIndisponivelTexto}>SALVAR</CustomText></View>
                            }
                            
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
        gap: 20
    },
    linha: {borderColor: "#DAD0B7", borderBottomWidth: 1},
    card: {gap: 10},
    superior: {flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"},
    campoName: {backgroundColor: "#DAD0B7", height: 50, borderRadius: 15, paddingHorizontal: 10, justifyContent: "center"},
    texto: {
        fontSize: 14,
        color: "#313131",
        textAlign: "justify",
        textAlignVertical: "center",
        flex: 1,
        outlineStyle: "none"
    },
    botaoSenha: {backgroundColor: "#383838", height: 50, borderRadius: 15, paddingHorizontal: 10, justifyContent: "center"},
    botaoSenhaText: {textAlign: "center", fontWeight: "bold"},
    botoes: {flexDirection: "row", justifyContent: "space-between"},
    botaoIndisponivel: {
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        backgroundColor: "#383838", 
        borderRadius: 15,
        alignItems: "center"
    },
    alterarVisivel: {gap: 20},
    senhaIndisponivel: {color: "#5F5F5F"},
    campoNameIndisponivel: {backgroundColor: "#383838", height: 50, borderRadius: 15, paddingHorizontal: 10, justifyContent: "center"},
    botaoIndisponivelTexto: {fontSize: 14, color: "#5F5F5F", fontWeight: "bold"}
});

export default EditarSenha;