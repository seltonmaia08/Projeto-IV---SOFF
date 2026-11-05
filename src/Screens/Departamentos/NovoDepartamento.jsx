import { useState } from 'react';
import { View, StyleSheet, TextInput, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { BlurView } from "expo-blur";
import { ChevronDown, ChevronUp, Check } from 'lucide-react-native';

import GetInGreen_button from '../../Components/Projetos_dashboard/GetInGreen_button';
import GetOut_button from '../../Components/Projetos_dashboard/GetOut_button';
import CustomText from '../../Components/Text/CustomText';

const NovoDepartamento = ({ visivel, aoFechar, aoCriarDepart }) => {

    const [departamento, setDepartamento] = useState();
    const [listaMembros, setListaMembros] = useState(["Selton Maia", "Clenda Uchoa", "Samuel Moreno", "Pedro", "Tiago", "João"]); // mockados
    const [listaOn, setListaOn] = useState(false);
    const [membrosSelecionados, setMembrosSelecionados] = useState([]);

    const handleCancelar = () => {
        setDepartamento("");
        setMembrosSelecionados([]);
        setListaOn(false);
        aoFechar();
    }

    const handleCriar = () => {

    }

    const toggleMembro = (nome) => {
        if(membrosSelecionados.includes(nome)){
            setMembrosSelecionados(membrosSelecionados.filter(cada => cada !== nome));
        }
        else {
            setMembrosSelecionados([...membrosSelecionados, nome]);
        }
    }

    return (
        <Modal
            visible={visivel}
            transparent={true}
            animationType='fade' // animação suave na hora de aparecer
            onRequestClose={aoFechar} // onRequestClose é pra se o usuário apertar na setinha de voltar do celular
        >
            <BlurView style={styles.overlay} intensity={40} tint='dark'>
                <View style={styles.popUp}>
                    <CustomText style={styles.criar}>Criar Departamento</CustomText>

                    <View style={styles.dados}>
                        <View style={styles.campo}>
                            <CustomText style={styles.labels}>Nome do Departamento: </CustomText>
                            <TextInput value={departamento} onChangeText={setDepartamento} style={styles.inputs}/>
                        </View>
                        <View style={styles.campo}>
                            <CustomText style={styles.labels}>Selecione os colaboradores: </CustomText>

                            <View>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => setListaOn(!listaOn)}>
                                    <View style={styles.dropDown}>
                                        <CustomText style={styles.textoDrop}>
                                            {
                                                membrosSelecionados.length > 0 ?
                                                `${membrosSelecionados.length} membros selecionado(s)` :
                                                "Selecionar"
                                            }
                                        </CustomText>
                                        {
                                            listaOn ?
                                            <ChevronUp style={styles.setinhaDrop}/> :
                                            <ChevronDown style={styles.setinhaDrop}/>
                                        }
                                        
                                    </View>
                                </TouchableOpacity>

                                {
                                    listaOn && (

                                        <ScrollView style={styles.containerLista} nestedScrollEnabled={true}>
                                            {
                                                listaMembros.map((cada, index) => {

                                                    const selecionado = membrosSelecionados.includes(cada) // verifica se o "cada" está selecionado
                                                    return (
                                                    <TouchableOpacity
                                                        activeOpacity={0.7}
                                                        key={index}
                                                        onPress={() => toggleMembro(cada)}
                                                        style={styles.itemMembro}
                                                    >
                                                        
                                                        <CustomText style={[styles.textoMembro, selecionado && styles.textoMembroSelecionado]}>
                                                            {cada}
                                                        </CustomText>
                                                        {selecionado && <Check style={styles.setinhaDrop}/>}
                                                    </TouchableOpacity>
                                                )})
                                            }
                                        </ScrollView>
                                    )
                                }
                            </View>
                        </View>
                    </View>

                    <View style={styles.botoes}>

                        <TouchableOpacity activeOpacity={0.5} onPress={aoFechar}>
                            <GetOut_button acao="CANCELAR" />
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.5}>
                            <GetInGreen_button acao="CRIAR" />
                        </TouchableOpacity>

                    </View>
                </View>
            </BlurView>
        </Modal>

    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)", // preto com 60% de opacidade,
        justifyContent: "center",
        alignItems: "center"
    },
    popUp: {
        width: 312,
        backgroundColor: "#313131",
        borderRadius: 15,
        padding: 20,
        gap: 30
    },
    criar: { fontWeight: "bold", fontSize: 18, color: "#DAD0B7" },
    dados: { gap: 30 },
    campo: { gap: 10 },
    labels: { fontSize: 16, color: "#DAD0B7" },
    dropDown: {
        backgroundColor: "#DAD0B7",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderRadius: 15
    },
    textoDrop: {color: "#383838"},
    setinhaDrop: {color: "#383838"},
    inputs: {
        flex: 1,
        fontSize: 16,
        color: "#DAD0B7",
        borderBottomColor: "#EF5625",
        borderBottomWidth: 1,
        outlineStyle: "none"
    },
    containerLista: {
        maxHeight: 140,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: "#DAD0B7",
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15
    },
    itemMembro: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 5, 
        borderRadius: 15
    },
    textoMembro: {color: "#383838"},
    textoMembroSelecionado: {fontWeight: "bold"},
    botoes: { flexDirection: "row", justifyContent: "space-between" }
});

export default NovoDepartamento;