import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react-native';

import CustomText from '../../Components/Text/CustomText';
import CargosPopUp from './CargosPopUp';


function MembrosModel({imagem, nome, email, cargo, cargosDisponiveis, aoMudarCargo}) {

    const [cargosVisivel, setCargosVisivel] = useState(false);
    const [cargoAtual, setCargoAtual] = useState(cargo);

    function alterarCargo(novoCargo) {
        setCargoAtual(novoCargo);
    }

    return (
        <View style={styles.perfilParticipante}>

            <View style={styles.dadosParticipante}>
                <View style={styles.fotinhaParticipante}><Image source={{uri: imagem}} style={styles.icons}/></View>
                <View style={styles.perfilInfos}>
                    <CustomText style={styles.perfilNome}>{nome}</CustomText>
                    <CustomText style={styles.perfilEmail}>{email}</CustomText>
                    <TouchableOpacity activeOpacity={0.7} onPress = {() => setCargosVisivel(true)} style={styles.perfilTagParticipante}>
                        <CustomText style={styles.perfilTagParticipanteNome}>{cargoAtual}</CustomText>
                        <ChevronRight style={styles.setinha}/>
                    </TouchableOpacity>
                </View>
            </View>
            <CargosPopUp
                visivel = {cargosVisivel}
                aoFechar = {() => setCargosVisivel(false)}
                aoSelecionar = {alterarCargo}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    perfilParticipante: {
        width: "100%",
        flexDirection: "row", 
        justifyContent: "space-between", 
        alignItems: "center",
        backgroundColor: "#313131",
        borderRadius: 15,
        padding: 10,
        paddingRight: 20,
    },
    dadosParticipante: {flexDirection: "row", gap: 10, alignItems: "center", width: "100%"},
    icons: {width: "100%", height: "100%"},
    fotinhaParticipante: {
        width: 70, 
        height: 70, 
        borderColor: "#DAD0B7", 
        borderWidth: 4, 
        borderRadius: 100,
        overflow: "hidden"
    },
    perfilInfos: {flex: 1, gap: 2},
    perfilNome: {fontSize: 20},
    perfilEmail: {fontSize: 12},
    perfilTagParticipante: { 
        backgroundColor: "#DAD0B7", 
        borderRadius: 15, 
        marginTop: 5,
        paddingVertical: 5,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    perfilTagParticipanteNome: {fontSize: 12, color: "#242424"},
    setinha: {color: "#313131"},
    dropdownContainer: {
        backgroundColor: "#242424",
        borderRadius: 10,
        marginTop: 5,
        padding: 8,
        gap: 5,
        borderWidth: 1,
        borderColor: "#DAD0B7"
    },
    dropdownTitulo: {fontSize: 10, color: "#888", marginBottom: 2},
    dropdownItem: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
        backgroundColor: "#313131"
    },
    dropdownItemTexto: {fontSize: 12, color: "#DAD0B7"}
})

export default MembrosModel;