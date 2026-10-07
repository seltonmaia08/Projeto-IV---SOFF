import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

import CustomText from '../Text/CustomText';
import GetOut_button from './GetOut_button';
import GetIn_button from './GetIn_button';

const styles = StyleSheet.create({
    cardContainer: {
        width: 310,
        backgroundColor: "#5F5F5F",
        borderRadius: 15,
        overflow: "hidden"
    },
    cardTopo: {
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20
    },
    cardTitulo: {color: "white", fontSize: 16},
    setinha: {color: "white"},
    cardInfo: {marginBottom: 20},
    cardConteudo: {
        backgroundColor: "#F0EADE",
        padding: 20,
        gap: 5
    },
    cardSessao: {flexDirection: "row"},
    cardLabel: {fontWeight: "bold", fontSize: 16, color: "#313131"},
    cardTexto: {fontSize: 16, color: "#313131"},
    botoes: {flexDirection: "row", justifyContent: "space-between"}
})

const Card_projeto = ({idProject, projectName, producer, created_at, onExcluir}) => {

    const [expandido, setExpandido] = useState(false);
    const navegacao = useNavigation();

    const alternarDropDown = () => {setExpandido(!expandido)}

    const date = created_at
    const formatedDate = new Date(date).toLocaleDateString(
        'pt-br', 
        { timeZone: 'UTC'}
    )


    return (
        <View style={styles.cardContainer}>
        
            <TouchableOpacity style={styles.cardTopo} onPress={alternarDropDown} activeOpacity={0.5}>
                <CustomText style={styles.cardTitulo}>{projectName}</CustomText>
                {
                    expandido? <ChevronUp size={24} style={styles.setinha}/> : <ChevronDown size={24} style={styles.setinha}/>
                }
            </TouchableOpacity>

            {
                expandido && (
                    <View style={styles.cardConteudo}>
                        
                        <View style={styles.cardInfo}>
                            <View style={styles.cardSessao}>
                                <CustomText style={styles.cardLabel}>Produtora: </CustomText>
                                <CustomText style={styles.cardTexto}>{producer}</CustomText>
                            </View>

                            <View style={styles.cardSessao}>
                                <CustomText style={styles.cardLabel}>Criado em: </CustomText>
                                <CustomText style={styles.cardTexto}>{formatedDate}</CustomText>
                            </View>
                        </View>

                        <View style={styles.botoes}>

                            <TouchableOpacity activeOpacity = {0.7} onPress={() => onExcluir({idProject, projectName})}>
                                <GetOut_button acao = "EXCLUIR"/>
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity = {0.7} onPress={() => navegacao.navigate("ProjectStack", {idProject: idProject, projectName: projectName})}>
                                <GetIn_button acao = "ENTRAR"/>
                            </TouchableOpacity>

                        </View>
                    </View>
                )
            }

        </View>
    )
}

export default Card_projeto;