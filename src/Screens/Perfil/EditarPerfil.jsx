import { View, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import * as ImagePicker from "expo-image-picker";
import { BlurView } from 'expo-blur';
import { Upload } from 'lucide-react-native';

import CustomText from '../../Components/Text/CustomText';
import GetInGreen_button from '../../Components/Projetos_dashboard/GetInGreen_button';
import GetOut_button from '../../Components/Projetos_dashboard/GetOut_button';

function EditarPerfil({visivel, nome, email, fotoAtual, aoFechar, aoSalvar}) {

    const [userName, setUserName] = useState(nome || "");
    const [userEmail, setUserEmail] = useState(email || "");
    const [userPhoto, setUserPhoto] = useState(fotoAtual || "");

    useEffect(() => {
        if (visivel) {
            setUserName(nome || "");
            setUserEmail(email || "");
            setUserPhoto(fotoAtual || "");
        }
    }, [visivel, nome, email, fotoAtual]);

    async function escolherFoto() {
        // pedir permissão pra acesso da galeria
        const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(!permissao.granted) {return}

        const resultado = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], // bloquear outros arquivos fora imagens;
            allowsEditing: true, // abre interface de corte para a imagem
            aspect: [1, 1], // corte 1 por 1
            quality: 0.8 // qualidade da imagem desce para 80% da original
        });

        if(!resultado.canceled) { // se não cancelou
            setUserPhoto(resultado.assets[0].uri); // coloco a uri do primeiro resultado do vetor de imagens;
        } 
    }

    function handleFechar() {
        setUserEmail(email);
        setUserName(nome);
        aoFechar();
    }

    function handleSalvar() {
        aoSalvar(userName, userEmail, userPhoto);
    }

    return(
        <Modal visible={visivel} animationType='fade' transparent={true}>
            <BlurView style={styles.overlay} tint='dark' intensity={40}>

                <View style={styles.geral}>
                    
                    <View style={styles.escopo}>

                        <CustomText style={styles.titulo}>Editar Perfil</CustomText>

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

                        <View style={styles.card}>
                            <View style={styles.linha}></View>
                            <TouchableOpacity style={styles.trocarFoto} activeOpacity={0.7} onPress={escolherFoto}>
                                <CustomText style={{textAlign: "center"}}>Trocar foto de perfil</CustomText>
                                <Upload style={{color: "#DAD0B7", width: 20, height: 20}}/>
                            </TouchableOpacity>
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
    linha: {borderColor: "#DAD0B7", borderBottomWidth: 1},
    titulo: {fontWeight: "bold", fontSize: 16},
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
    trocarFoto: {
        flexDirection: "row",
        gap: 7,
        backgroundColor: "#383838", 
        height: 50, 
        borderRadius: 15, 
        paddingHorizontal: 10, 
        justifyContent: "center",
        alignItems: "center"
    },
    botoes: {flexDirection: "row", justifyContent: "space-between"},
});

export default EditarPerfil;