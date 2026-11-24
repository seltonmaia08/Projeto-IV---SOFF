import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

import CustomText from '../../Components/Text/CustomText';
import SucessPopUp from '../../Components/SucessPopUp/SucessPopup';

function PlanoGratuito({route}) {

    const {nomeUsuario, emailUsuario, planoPago} = route.params;
    const [popUp, setPopUp] = useState(false);
    const navegacao = useNavigation();

    function handleCancelar() {
        setPopUp(true);

        setTimeout(() => setPopUp(false), 2500);
        navegacao.navigate("Planos", {nomeUsuario, emailUsuario, planoPago: false});
    }

    function handleAssinar() {
        navegacao.navigate("PlanoPago", {nomeUsuario, emailUsuario, planoPago});
    }

    return(
        <ScrollView style={styles.escopo}>

            <View style={styles.topo}>

                <TouchableOpacity activeOpacity={0.5} onPress={() => navegacao.navigate("Planos", {nomeUsuario, emailUsuario, planoPago})}>
                    <ChevronLeft style={styles.topoIcone}/>
                </TouchableOpacity>

                <View style={styles.topoTexto}>
                    <CustomText style={styles.nome}>{nomeUsuario}</CustomText>
                    <CustomText style={styles.email}>{emailUsuario}</CustomText>
                </View>
            </View>

            <View style={styles.conteudo}>

                <CustomText style={styles.titulo}>Plano Gratuito</CustomText>

                <View style={styles.conteudoPlano}>

                    <View style={styles.conteudoTopo}>
                        <CustomText style={styles.subtopicos}>SOBRE O PLANO GRATUITO </CustomText>
                        <CustomText style={styles.textos}>Esta aba tem como objetivo abordar as funcionalidades e restrições do plano gratuito do aplicativo SOF7, conforme abaixo: </CustomText>
                    </View>

                    <View style={styles.conteudoTexto}>

                        <CustomText style={styles.textos}>• Funcionalidades: O plano aborda apenas a gestão básica de projetos, que engloba as funções de criação de cenas, anotações gerais, envio de chamado básico, alteração de status do set e ferramenta de continuidade, assim como só lhe é permitido ser dono de 1 projeto (e colaborador de quantos quiser).</CustomText>
                        <CustomText style={styles.textos}>• Restrições: O usuário não tem acesso a funcionalidades como To Do List; criação de mais um projeto; chamados com mensagem personalizada; geração de PDFs; criação de novos departamentos e adição de colaboradores a esses departamentos.</CustomText>

                    </View>

                    <View style={styles.botoes}>

                        {
                            planoPago?
                            <TouchableOpacity activeOpacity={0.5} style={styles.cancelar} onPress={handleCancelar}>
                                <CustomText style={{fontWeight: "bold"}}>CANCELAR O PLANO PRO</CustomText>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity activeOpacity={0.5} style={styles.assinar} onPress={handleAssinar}>
                                <CustomText style={{fontWeight: "bold"}}>ASSINAR O PLANO PRO</CustomText>
                            </TouchableOpacity>
                        }
                        
                    </View>
                </View>
                
                <SucessPopUp
                    visivel={popUp}
                    mensagem="Ação realizada com sucesso!"
                />
            </View>

        </ScrollView>
    )
}

const styles = StyleSheet.create({
    escopo: {flex: 1},
    topo: {
        backgroundColor: "#383838", 
        width: "100%", 
        height: 130,
        flexDirection: "row",
        alignItems: "flex-end",
        paddingVertical: 10,
    },
    topoTexto: {justifyContent: "center"},
    topoIcone: {color: "#DAD0B7", padding: 10},
    nome: {fontSize: 22},
    email: {fontSize: 12},
    conteudo: {padding: 20, gap: 20, width: "100%"},
    titulo: {fontSize: 22, color: "#EF5625", fontWeight: "bold"},
    cardPlano: {alignItems: "center", width: "100%"},
    conteudoTopo: {gap: 10},
    conteudoPlano: {width: "100%", gap: 25},
    subtopicos: {fontSize: 14},
    textos: {fontSize: 12},
    conteudoTexto: {gap: 10},
    botoes: {alignItems: "center"},
    cancelar: {
        backgroundColor: "#EF5625",
        paddingHorizontal: 20, 
        paddingVertical: 15, 
        borderRadius: 15, 
        width: 230,
        alignItems: "center"
    },
    assinar: {
        backgroundColor: "#1B8F65",
        paddingHorizontal: 20, 
        paddingVertical: 15, 
        borderRadius: 15, 
        width: 210,
        alignItems: "center"
    }
});

export default PlanoGratuito;