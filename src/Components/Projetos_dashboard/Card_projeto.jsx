import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import CustomText from '../Text/CustomText';
import GetOut_button from './GetOut_button';
import GetInGreen_button from './GetInGreen_button';
import { useAuth } from '../../Context/AuthContext';
import { useProject } from '../../Hook/useProjects';
import { supabase } from '../../Utils/Supabase';


const Card_projeto = ({ idProject, projectName, producer, created_at, onExcluir, onSair }) => {

    const [expandido, setExpandido] = useState(false);
    const [titleButton, setTitleButton] = useState('SAIR')
    const navegacao = useNavigation();
    const { user } = useAuth()
    const idUser = user.id

    const alternarDropDown = () => { setExpandido(!expandido) }

    const date = created_at
    const formatedDate = new Date(date).toLocaleDateString(
        'pt-br',
        { timeZone: 'UTC' }
    )

    useEffect(() => {
        const identificarPapel = async () => {
            if (!idProject || !user?.id) return;
            try {
                const { data } = await supabase
                    .from('Project')
                    .select('idUser')
                    .eq('idProject', idProject)
                    .eq('idUser', user.id)
                    .maybeSingle();

                if (data) {
                    setTitleButton("EXCLUIR");
                } else {
                    setTitleButton("SAIR");
                }
            } catch (error) {
                console.error('Erro ao identificar papel:', error);
            }
        };

        identificarPapel();
    }, [idProject, user?.id]);

    return (
        <View style={styles.cardContainer}>

            <TouchableOpacity style={styles.cardTopo} onPress={alternarDropDown} activeOpacity={0.5}>
                <CustomText style={styles.cardTitulo}>{projectName}</CustomText>
                {
                    expandido ? <ChevronUp size={24} style={styles.setinha} /> : <ChevronDown size={24} style={styles.setinha} />
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

                            <TouchableOpacity activeOpacity={0.7} onPress={() => {
                                 if (titleButton === "EXCLUIR"){
                                     onExcluir({idProject, projectName}) 
                                 } else {
                                     onSair({idProject, projectName, idUser})
                                 } 
                            }}>
                                <GetOut_button acao={titleButton} />
                            </TouchableOpacity>

                            <TouchableOpacity activeOpacity={0.7} onPress={() => { navegacao.navigate("ProjectStack", { idProject: idProject, projectName: projectName, producer: producer }) }}>
                                <GetInGreen_button acao="ENTRAR" />
                            </TouchableOpacity>

                        </View>
                    </View>
                )
            }

        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        width: 310,
        backgroundColor: "#313131",
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
    cardTitulo: { color: "#DAD0B7", fontSize: 16 },
    setinha: { color: "#DAD0B7" },
    cardInfo: { marginBottom: 20 },
    cardConteudo: {
        backgroundColor: "#DAD0B7",
        padding: 20,
        gap: 5
    },
    cardSessao: { flexDirection: "row" },
    cardLabel: { fontWeight: "bold", fontSize: 16, color: "#313131" },
    cardTexto: { fontSize: 16, color: "#313131" },
    botoes: { flexDirection: "row", justifyContent: "space-between" }
});

export default Card_projeto;