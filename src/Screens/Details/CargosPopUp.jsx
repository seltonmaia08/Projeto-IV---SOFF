import { View, StyleSheet, TouchableOpacity, Modal, Linking } from 'react-native';
import { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import { X } from 'lucide-react-native';

import CustomText from '../../Components/Text/CustomText';

function CargosPopUp({visivel, aoFechar, aoSelecionar}) {

    const cargosProjeto = [
        "Diretor(a) Geral", 
        "Diretor(a) de Produção",
        "Diretor(a) de Fotografia",
        "Diretor(a) de Arte",
        "Assistente", 
        "Continuísta",
        "Produtor(a) de Locação",
        "Operador(a) de Câmera",
        "Foquista",
        "Figurinista",
        "Ténico(a) de Som",
        "Microfonista"
    ]; // mockados

    function alterarEFechar(novoCargo) {
        aoSelecionar(novoCargo);
        aoFechar();
    }

    return(
        <Modal visible={visivel} animationType='fade' transparent={true}>
            <BlurView style={styles.overlay} tint='dark' intensity={40}>

                <View style={styles.geral}>
                    
                    <View style={styles.escopo}>
                        
                        <View style={styles.card}>

                            <View style={styles.superior}>
                                <CustomText>Escolha um Cargo</CustomText>
                                <TouchableOpacity style={styles.x} activeOpacity={0.5} onPress={aoFechar}>
                                    <X style={{color:"#DAD0B7"}}/>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.campoName}>
                                {
                                    cargosProjeto.map(cada => (

                                        <TouchableOpacity onPress={() => alterarEFechar(cada)} style={styles.campoCargo} activeOpacity={0.7}>
                                            <CustomText style={styles.cargos}>{cada}</CustomText>
                                        </TouchableOpacity>

                                    ))
                                }
                            </View>
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
        gap: 15
    },
    card: {gap: 20},
    superior: {flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end"},
    campoName: {gap: 7},
    campoCargo: {backgroundColor: "#DAD0B7", borderRadius: 15, paddingVertical: 8, paddingHorizontal: 10},
    cargos: {fontSize: 16, color: "#313131"}
});

export default CargosPopUp;