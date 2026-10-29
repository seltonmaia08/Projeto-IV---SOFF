import { View, StyleSheet, TouchableOpacity, Modal, Linking, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import { Edit, X } from 'lucide-react-native';

import CustomText from '../../Components/Text/CustomText';
import EditarLinks from './EditarLinks';

function LinksPopUp({visivel, aoFechar}) {

    const [edicao, setEdicao] = useState(false);
    const [links, setLinks] = useState(
        "https://lucide.dev/icons/chevron-left\nhttps://discord.com/channels/@me\nhttps://i.pinimg.com/originals/6a/1d/41/6a1d415bac0a94c46f4f0ff8ee0524f8.gif"
    );
    const listaLinks = links.split("\n").filter(link => link.trim() !== "");

    return(
        <Modal visible={visivel} animationType='fade' transparent={true}>
            <BlurView style={styles.overlay} tint='dark' intensity={40}>

                <View style={styles.geral}>
                    
                    <View style={styles.escopo}>
                        
                        <View style={styles.card}>

                            <View style={styles.superior}>
                                <CustomText>Links do Projeto</CustomText>
                                <TouchableOpacity style={styles.x} activeOpacity={0.5} onPress={aoFechar}>
                                    <X style={{color:"#DAD0B7"}}/>
                                </TouchableOpacity>
                            </View>
                            <ScrollView>
                                <View style={styles.campoName}>
                                    {
                                        listaLinks.map((cada, index) => (
                                            <CustomText
                                                key={index}
                                                style={styles.links}
                                                onPress={() => Linking.openURL(cada.trim())}
                                            >
                                                •_{cada.trim()}
                                            </CustomText>
                                        ))
                                    }
                                    
                                </View>
                            </ScrollView>
                        </View>

                        <TouchableOpacity style={styles.botao} activeOpacity={0.5} onPress={() => setEdicao(true)}>
                            <CustomText style={styles.botaoTexto}>EDITAR</CustomText>
                        </TouchableOpacity> 

                        <EditarLinks
                            visivel = {edicao}
                            aoFechar = {() => setEdicao(false)}
                            linksIniciais={links}
                            aoSalvar={(novoTexto) => setLinks(novoTexto)}
                        /> 

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
        gap: 15
    },
    card: {gap: 10},
    superior: {flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"},
    campoName: {
        backgroundColor: "#DAD0B7", 
        height: 400, 
        borderRadius: 15,
        padding: 10,
        gap: 15
    },
    texto: {
        fontSize: 14,
        color: "#313131",
        textAlign: "justify",
        textAlignVertical: "center",
        flex: 1,
        outlineStyle: "none"
    },
    links: {color: "#313131"},
    botao: {
        width: "100%",
        backgroundColor: "#DAD0B7",
        padding: 10,
        borderRadius: 15
    },
    botaoTexto: {color: "#313131", textAlign: "center", fontWeight: "bold"}
});

export default LinksPopUp;