import { View, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';

import CustomText from '../../Components/Text/CustomText';
import GetInGreen_button from '../../Components/Projetos_dashboard/GetInGreen_button';
import GetOut_button from '../../Components/Projetos_dashboard/GetOut_button';

function EditNamePopUp({visivel, nome, produt, aoFechar, aoSalvar}) {

    const [name, setName] = useState(nome);
    const [produtora, setProdutora] = useState(produt);

    useEffect(
        () => {
            setName(nome);
            setProdutora(produt);
        }, [nome, produt]
    )

    const enviarNovaNota = () => {
        aoSalvar(name, produtora);
        aoFechar();
    }

    return(
        <Modal visible={visivel} animationType='fade' transparent={true}>
            <BlurView style={styles.overlay} tint='dark' intensity={40}>

                <View style={styles.geral}>
                    
                    <View style={styles.escopo}>
                        
                        <View style={styles.card}>
                            <View style={styles.superior}>
                                <CustomText>Nome do Projeto</CustomText>
                            </View>
                            <View style={styles.campoName}>
                                <TextInput value={name} onChangeText={setName} style={styles.texto}></TextInput>
                            </View>
                        </View>

                        <View style={styles.card}>
                            <CustomText>Produtora</CustomText>
                            <View style={styles.campoName}>
                                <TextInput
                                    style={styles.texto}
                                    value={produtora}
                                    onChangeText={setProdutora} 
                                ></TextInput>
                            </View>
                        </View>
                        <View style={styles.botoes}>

                            <TouchableOpacity activeOpacity={0.5} onPress={aoFechar}>
                                <GetOut_button acao="CANCELAR"/>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.5} onPress={enviarNovaNota}>
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
    x: {padding: 1},
    campoName: {backgroundColor: "#DAD0B7", height: 50, borderRadius: 15, paddingHorizontal: 10, justifyContent: "center"},
    texto: {
        fontSize: 14,
        color: "#313131",
        textAlign: "justify",
        textAlignVertical: "center",
        flex: 1,
        outlineStyle: "none"
    },
    botoes: {flexDirection: "row", justifyContent: "space-between"}
});

export default EditNamePopUp;