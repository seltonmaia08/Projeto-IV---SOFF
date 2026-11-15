import { View, StyleSheet, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';

import CustomText from '../../Components/Text/CustomText';
import GetInGreen_button from '../../Components/Projetos_dashboard/GetInGreen_button';
import GetOut_button from '../../Components/Projetos_dashboard/GetOut_button';

function EditarPerfil({visivel, nome, email, aoFechar, aoSalvar}) {

    const [userName, setUserName] = useState(nome);
    const [userEmail, setUserEmail] = useState(email);

    function handleFechar() {
        setUserEmail(email);
        setUserName(nome);
        aoFechar();
    }

    function handleSalvar() {
        aoSalvar(userName, userEmail);
    }

    return(
        <Modal visible={visivel} animationType='fade' transparent={true}>
            <BlurView style={styles.overlay} tint='dark' intensity={40}>

                <View style={styles.geral}>
                    
                    <View style={styles.escopo}>
                        
                        <View style={styles.card}>
                            <View style={styles.superior}>
                                <CustomText>Nome do usuário</CustomText>
                            </View>
                            <View style={styles.campoName}>
                                <TextInput value={userName} onChangeText={setUserName} style={styles.texto}></TextInput>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <CustomText>Email do usuário</CustomText>
                            <View style={styles.campoName}>
                                <TextInput
                                    style={styles.texto}
                                    value={userEmail}
                                    onChangeText={setUserEmail}
                                ></TextInput>
                            </View>
                        </View>

                        <View>
                            <CustomText>Foto de perfil</CustomText>
                            <View><CustomText>(implementar)</CustomText></View>
                        </View>
                        <View style={styles.botoes}>

                            <TouchableOpacity activeOpacity={0.5} onPress={handleFechar}>
                                <GetOut_button acao="CANCELAR"/>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.5} onPress={handleSalvar}>
                                <GetInGreen_button acao="SALVAR"/>
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
        padding: 15,
        gap: 20
    },
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
    botoes: {flexDirection: "row", justifyContent: "space-between"},
});

export default EditarPerfil;