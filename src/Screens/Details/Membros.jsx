import { View, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react-native';
import { ChevronDown } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

import Top from '../TopAba/Top';
import CustomText from '../../Components/Text/CustomText';
import MembrosModel from './MembrosModel';
import CargosPopUp from './CargosPopUp';


function Membros ({visivel, aoFechar}) {

    const codigo = "sempre234"; // tem que trazer o código criado antes pra cá
    const [copiado, setCopiado] = useState(false);
    const [cargoProprietario, setCargoProprietario] = useState("Continuista");
    const [cargosVisivel, setCargosVisivel] = useState(false);

    const copiarCodigo = async () => {

        await Clipboard.setStringAsync(codigo);
        setCopiado(true);
        setTimeout(() => {setCopiado(false)}, 2000);
    }

    function mudarCargoProprietario(novoCargo) {
        setCargoProprietario(novoCargo);
    }

    return (
        <Modal visible = {visivel} onRequestClose={aoFechar}>
            <View style={styles.escopo}>
                
                <Top abaName="Membros" voltar = {true} voltarOn={aoFechar}/>

                <View style={styles.content}>

                    <View style={styles.campo}>

                        <CustomText style={styles.secaoProprietario}>Proprietário</CustomText>
                        <View style={styles.perfilProprietario}>

                            <View style={styles.dadosProprietario}>
                                <View style={styles.fotinhaProprietario}><Image source={{uri: "https://i.pinimg.com/736x/3d/b1/4a/3db14a40a4e8aa42636ce79da98c4c9e.jpg"}} style={styles.icons}/></View>
                                <View style={styles.perfilInfos}>
                                    <CustomText style={styles.perfilNome}>John Kelvy</CustomText>
                                    <CustomText style={styles.perfilEmail}>johnkelvy@gmail.com</CustomText>
                                    <TouchableOpacity onPress={() => setCargosVisivel(true)} activeOpacity={0.7} style={styles.perfilTagProprietario}>
                                        <CustomText style={styles.perfilEmail}>{cargoProprietario}</CustomText>
                                        <ChevronDown style={styles.setinha}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.linha}></View>

                    <View style={styles.campo}>

                        <CustomText style={styles.secaoParticipantes}>Participantes</CustomText>
                        <MembrosModel
                            imagem = "https://i.pinimg.com/736x/84/a5/47/84a547cf4efb03f576a355841df48a8d.jpg"
                            nome = "Samuel Moreno"
                            email = "samueu@gmail.com"
                            cargo = "Direção de Áudio"
                        />
                        <MembrosModel
                            imagem = "https://i.pinimg.com/736x/d8/3d/f7/d83df721227cbaf144039f83998f938e.jpg"
                            nome = "Selton Maia"
                            email = "selton88@gmail.com"
                            cargo = "Direção de vídeo"
                        />
                        <MembrosModel
                            imagem = "https://i.pinimg.com/736x/9a/26/42/9a2642c927b378820e83f5dd735c01ea.jpg"
                            nome = "Clenda Uchoa"
                            email = "clendinha@gmail.com"
                            cargo = "Direção de Marketing"
                        />
                    </View>

                    <TouchableOpacity style={styles.botaoConvidar} activeOpacity={0.5} onPress={copiarCodigo}>
                        <CustomText style={styles.textoBotao}>Convidar Via Link</CustomText>
                        {
                            copiado ? (<Check style={{ color: "#1B8F65" }} />) : (<Copy style={{ color: "#F0EADE" }} />)
                        }
                    </TouchableOpacity>

                    <CargosPopUp
                        visivel = {cargosVisivel}
                        aoFechar = {() => setCargosVisivel(false)}
                        aoSelecionar = {mudarCargoProprietario}
                    />
                    
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    escopo: {backgroundColor: "#242424", flex: 1},
    content: {padding: 20, height: "100%", width: "100%", gap: 20},
    campo: {gap: 10},
    secaoProprietario: {fontSize: 12, fontWeight: "bold", color: "#1B8F65"},
    perfilProprietario: {
        width: "100%",
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        backgroundColor: "#313131",
        borderRadius: 15,
        padding: 10,
        paddingRight: 20
    },
    dadosProprietario: {flexDirection: "row", gap: 10, alignItems: "center", width: "100%"},
    icons: {width: "100%", height: "100%"},
    fotinhaProprietario: {
        width: 70, 
        height: 70, 
        borderColor: "#1B8F65", 
        borderWidth: 4, 
        borderRadius: 100,
        overflow: "hidden"
    },
    perfilInfos: {flex: 1, gap: 2},
    perfilNome: {fontSize: 20},
    perfilEmail: {fontSize: 12},
    perfilTagProprietario: {
        backgroundColor: "#1B8F65",
        borderRadius: 15,
        marginTop: 5,
        paddingVertical: 5,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    linha: {borderColor: "#242424", borderBottomColor: "#313131", borderWidth: 3},
    secaoParticipantes: {fontSize: 12, fontWeight: "bold", color: "#DAD0B7"},
    botaoConvidar: {
        position: "absolute",
        bottom: 180,
        width: "89%",
        padding: 15,
        backgroundColor: "#313131",
        borderRadius: 15,
        flexDirection: "row",
        justifyContent: "center",
        gap: 15
    },
    textoBotao: {fontSize: 16, fontWeight: "bold", textAlign: "center"},
    setinha: {color: "#DAD0B7"}
})

export default Membros;