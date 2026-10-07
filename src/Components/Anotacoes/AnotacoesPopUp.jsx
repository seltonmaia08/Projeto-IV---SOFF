import { View, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { useState } from 'react';
import { BlurView } from 'expo-blur';
import CustomText from '../Text/CustomText';
import GetIn_button from '../Projetos_dashboard/GetIn_button';
import GetOut_button from '../Projetos_dashboard/GetOut_button';
//{visivel, aoSalvar, aoCancelar}

function AnotacoesPopUp() {

    const [anotacoes, setAnotacoes] = useState("Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quo obcaecati fugit iusto maiores nihil eveniet nostrum voluptate praesentium molestias dolores, reprehenderit, exercitationem aspernatur inventore magnam, sequi architecto accusamus earum recusandae.");

    return(
        <Modal visible={true} animationType='fade' transparent={true}>
            <BlurView style={styles.overlay} tint='dark' intensity={40}>
                <View style={styles.geral}>

                    <CustomText style={styles.titulo}>Anotações Gerais</CustomText>
                    
                    <View style={styles.escopo}>
                        
                        <View style={styles.campoTexto}>
                            <TextInput style={styles.texto} value={anotacoes} onChangeText={setAnotacoes} multiline={true}></TextInput>
                        </View>

                        <View style={styles.botoes}>

                            <TouchableOpacity activeOpacity={0.5}>
                                <GetOut_button acao="CANCELAR"/>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.5}>
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
    titulo: {fontSize: 18},
    escopo: {
        width: 320,
        borderRadius: 15, 
        borderColor: "#EF5625", 
        borderWidth: 2, 
        overflow: "hidden",
        padding: 10,
        gap: 20
    },
    campoTexto: {backgroundColor: "#F0EADE", height: 400, borderRadius: 15, padding: 20},
    texto: {fontSize: 12, color: "#313131", textAlign: "justify", textAlignVertical: "top", flex: 1},
    botoes: {flexDirection: "row", justifyContent: "space-between"}
});

export default AnotacoesPopUp;