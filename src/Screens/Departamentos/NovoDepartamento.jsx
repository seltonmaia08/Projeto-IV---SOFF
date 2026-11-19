import { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Modal, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { BlurView } from "expo-blur";
import { ChevronDown, ChevronUp, Check } from 'lucide-react-native';

import GetInGreen_button from '../../Components/Projetos_dashboard/GetInGreen_button';
import GetOut_button from '../../Components/Projetos_dashboard/GetOut_button';
import CustomText from '../../Components/Text/CustomText';
import AlertaGeral from '../../Components/Alerta/AlertaGeral';

const NovoDepartamento = ({
    visivel,
    aoFechar,
    aoCriarDepart,
    aoSalvarDepart,
    aoExcluirDepart,
    departamentoParaEditar,
    todosMembros = []
}) => {

    const [departamento, setDepartamento] = useState("");
    const [listaMembros, setListaMembros] = useState([]);
    const [listaOn, setListaOn] = useState(false);
    const [membrosSelecionados, setMembrosSelecionados] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (visivel) {
            setListaMembros(todosMembros || []);
            if (departamentoParaEditar) {
                setDepartamento(departamentoParaEditar.nome || "");
                setMembrosSelecionados(departamentoParaEditar.membrosIds || []);
            } else {
                setDepartamento("");
                setMembrosSelecionados([]);
            }
            setListaOn(false);
            setLoading(false);
        }
    }, [visivel, departamentoParaEditar, todosMembros]);

    const handleCancelar = () => {
        setDepartamento("");
        setMembrosSelecionados([]);
        setListaOn(false);
        aoFechar();
    };

    const handleCriar = async () => {
        if (!departamento || departamento.trim() === "") {
            AlertaGeral.alert("Aviso", "Por favor, digite o nome do departamento.");
            return;
        }

        setLoading(true);
        try {
            if (departamentoParaEditar) {
                if (aoSalvarDepart) {
                    await aoSalvarDepart({
                        idDepartment: departamentoParaEditar.idDepartment,
                        nome: departamento.trim(),
                        membrosIds: membrosSelecionados
                    });
                }
            } else {
                if (aoCriarDepart) {
                    await aoCriarDepart({
                        nome: departamento.trim(),
                        membrosIds: membrosSelecionados
                    });
                }
            }

            setDepartamento("");
            setMembrosSelecionados([]);
            setListaOn(false);
            aoFechar();
        } finally {
            setLoading(false);
        }
    };

    const handleExcluir = async () => {
        if (departamentoParaEditar && aoExcluirDepart) {
            setLoading(true);
            try {
                await aoExcluirDepart(departamentoParaEditar.idDepartment, departamentoParaEditar.nome);
                aoFechar();
            } finally {
                setLoading(false);
            }
        }
    };

    const toggleMembro = (idMembro) => {
        if (membrosSelecionados.includes(idMembro)) {
            setMembrosSelecionados(membrosSelecionados.filter(cada => cada !== idMembro));
        } else {
            setMembrosSelecionados([...membrosSelecionados, idMembro]);
        }
    };

    return (
        <Modal
            visible={visivel}
            transparent={true}
            animationType='fade' // animação suave na hora de aparecer
            onRequestClose={aoFechar} // onRequestClose é pra se o usuário apertar na setinha de voltar do celular
        >
            <BlurView style={styles.overlay} intensity={40} tint='dark'>
                <View style={styles.popUp}>
                    <CustomText style={styles.criar}>
                        {departamentoParaEditar ? "Editar Departamento" : "Criar Departamento"}
                    </CustomText>

                    <View style={styles.dados}>
                        <View style={styles.campo}>
                            <CustomText style={styles.labels}>Nome do Departamento: </CustomText>
                            <TextInput value={departamento} onChangeText={setDepartamento} style={styles.inputs}/>
                        </View>
                        <View style={styles.campo}>
                            <CustomText style={styles.labels}>Selecione os colaboradores: </CustomText>

                            <View>
                                <TouchableOpacity activeOpacity={0.7} onPress={() => setListaOn(!listaOn)}>
                                    <View style={[styles.dropDown, listaOn && styles.dropDownAberto]}>
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
                                                    const idKey = cada.idProjectMember || cada.idUser || index;
                                                    const nomeExibicao = cada.nome || cada.userName || (typeof cada === 'string' ? cada : 'Membro');
                                                    const selecionado = membrosSelecionados.includes(idKey);
                                                    return (
                                                        <TouchableOpacity
                                                            activeOpacity={0.7}
                                                            key={idKey}
                                                            onPress={() => toggleMembro(idKey)}
                                                            style={styles.itemMembro}
                                                        >
                                                            <CustomText style={[styles.textoMembro, selecionado && styles.textoMembroSelecionado]}>
                                                                {nomeExibicao}
                                                            </CustomText>
                                                            {selecionado && <Check style={styles.setinhaDrop}/>}
                                                        </TouchableOpacity>
                                                    );
                                                })
                                            }
                                        </ScrollView>
                                    )
                                }
                            </View>
                        </View>
                    </View>

                    <View style={styles.botoes}>

                        <TouchableOpacity activeOpacity={0.5} onPress={handleCancelar} disabled={loading}>
                            <GetOut_button acao="CANCELAR" />
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.5} onPress={handleCriar} disabled={loading}>
                            {loading ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color="#DAD0B7" />
                                </View>
                            ) : (
                                <GetInGreen_button acao={departamentoParaEditar ? "SALVAR" : "CRIAR"} />
                            )}
                        </TouchableOpacity>

                    </View>

                    {departamentoParaEditar && (
                        <TouchableOpacity activeOpacity={0.5} onPress={handleExcluir} disabled={loading} style={{ alignItems: 'center', marginTop: 10 }}>
                            <CustomText style={{ color: "#EF5625", fontSize: 14 }}>Excluir Departamento</CustomText>
                        </TouchableOpacity>
                    )}
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
    campo: { gap: 10, zIndex: 999, position: "relative", height: 90 },
    labels: { fontSize: 16, color: "#DAD0B7" },
    dropDown: {
        backgroundColor: "#DAD0B7",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        borderRadius: 15
    },
    dropDownAberto: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        borderBottomColor: "#c3c3c3",
        borderBottomWidth: 1
    },
    textoDrop: {color: "#383838"},
    setinhaDrop: {color: "#383838"},
    inputs: {
        flex: 1,
        fontSize: 16,
        color: "#DAD0B7",
        borderBottomColor: "#EF5625",
        borderBottomWidth: 1,
        outlineStyle: "none",
    },
    containerLista: {
        maxHeight: 140,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: "#DAD0B7",
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        position: "absolute",
        top: "100%",
        width: "100%",
        elevation: 99,
        zIndex: 9999
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
    botoes: { flexDirection: "row", justifyContent: "space-between" },
    loadingContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#1B8F65",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 70,
    }
});

export default NovoDepartamento;