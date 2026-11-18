import { View, StyleSheet, TouchableOpacity, Modal, Linking, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import { Edit, X } from 'lucide-react-native';

import CustomText from '../../Components/Text/CustomText';
import EditarLinks from './EditarLinks';
import { supabase } from '../../Utils/Supabase';

function LinksPopUp({visivel, aoFechar, idProject}) {

    const [edicao, setEdicao] = useState(false);
    const [links, setLinks] = useState("");

    // Carrega os links do projeto a partir do Supabase
    useEffect(() => {
        const carregarLinks = async () => {
            if (!idProject || !visivel) return;
            try {
                const { data, error } = await supabase
                    .from('Project')
                    .select('links')
                    .eq('idProject', idProject)
                    .maybeSingle();

                if (!error && data && data.links !== undefined && data.links !== null) {
                    setLinks(data.links);
                }
            } catch (err) {
                console.error("Erro ao carregar links do projeto:", err);
            }
        };

        carregarLinks();
    }, [idProject, visivel]);

    const salvarLinks = async (novoTexto) => {
        try {
            setLinks(novoTexto);
            if (idProject) {
                const { error } = await supabase
                    .from('Project')
                    .update({ links: novoTexto })
                    .eq('idProject', idProject);

                if (error) {
                    console.warn("Aviso ao salvar links no Project:", error);
                }
            }
        } catch (err) {
            console.error("Erro ao salvar links:", err);
            Alert.alert("Erro", "Não foi possível salvar os links.");
        }
    };

    const listaLinks = links ? links.split("\n").filter(link => link.trim() !== "") : [];

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
                                        listaLinks.length === 0 ? (
                                            <CustomText style={[styles.links, { opacity: 0.6 }]}>
                                                Nenhum link cadastrado ainda.
                                            </CustomText>
                                        ) : (
                                            listaLinks.map((cada, index) => {
                                                const linkLimpo = cada.trim();
                                                return (
                                                    <CustomText
                                                        key={index}
                                                        style={styles.links}
                                                        onPress={() => {
                                                            const url = linkLimpo.startsWith('http://') || linkLimpo.startsWith('https://')
                                                                ? linkLimpo
                                                                : `https://${linkLimpo}`;
                                                            Linking.openURL(url).catch(e => console.warn("Erro ao abrir URL:", e));
                                                        }}
                                                    >
                                                        •_{linkLimpo}
                                                    </CustomText>
                                                );
                                            })
                                        )
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
                            aoSalvar={salvarLinks}
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