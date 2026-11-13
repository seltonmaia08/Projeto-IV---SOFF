import { View, StyleSheet, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';

import CustomText from '../../Components/Text/CustomText';
import GetInGreen_button from '../../Components/Projetos_dashboard/GetInGreen_button';
import GetOut_button from '../../Components/Projetos_dashboard/GetOut_button';
import { projectService } from '../../Services/api';

function EditNamePopUp({visivel, idProject, nome, produt, aoFechar, aoSalvar}) {

    const [name, setName] = useState(nome);
    const [produtora, setProdutora] = useState(produt);
    const [loading, setLoading] = useState(false);

    useEffect(
        () => {
            setName(nome);
            setProdutora(produt);
        }, [nome, produt]
    )

    const salvarEdicao = async () => {
        if (!name?.trim()) {
            Alert.alert('Aviso', 'O nome do projeto não pode ficar vazio.');
            return;
        }

        try {
            setLoading(true);
            await projectService.update(idProject, {
                projectName: name.trim(),
                producer: (produtora || '').trim()
            }, 'idProject');

            if (aoSalvar) {
                aoSalvar(name.trim(), (produtora || '').trim());
            }
            aoFechar();
        } catch (error) {
            console.error('Erro ao atualizar projeto:', error);
            Alert.alert('Erro', 'Não foi possível atualizar as informações do projeto.');
        } finally {
            setLoading(false);
        }
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

                            <TouchableOpacity activeOpacity={0.5} onPress={aoFechar} disabled={loading}>
                                <GetOut_button acao="CANCELAR"/>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.5} onPress={salvarEdicao} disabled={loading}>
                                {loading ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator color="#DAD0B7" size="small" />
                                    </View>
                                ) : (
                                    <GetInGreen_button acao="SALVAR"/>
                                )}
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
    loadingContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#1B8F65",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center"
    }
});

export default EditNamePopUp;
