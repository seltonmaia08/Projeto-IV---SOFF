import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';

import CustomText from '../../Components/Text/CustomText';
import ConfirmacaoPopUp from '../../Components/ConfirmPopUp/ConfirmacaoPopUp';
import SucessPopUp from "../../Components/SucessPopUp/SucessPopup"

function PlanoPago({route}) {

    const {nomeUsuario, emailUsuario, planoPago} = route.params;
    const [checado, setChecado] = useState(false);
    const [popUp, setPopUp] = useState(false);
    const navegacao = useNavigation();

    function handleAssinar() {
        setPopUp(true);

        setTimeout(() => setPopUp(false), 2500);
        navegacao.navigate("Planos", {nomeUsuario: nomeUsuario, emailUsuario: emailUsuario, planoPago: true});
    }
    function handleCancelar() {
        setPopUp(true);

        setTimeout(() => setPopUp(false), 2500);
        navegacao.navigate("Planos", {nomeUsuario: nomeUsuario, emailUsuario: emailUsuario, planoPago: false});
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

                <CustomText style={styles.titulo}>Plano PRO</CustomText>

                <View style={styles.conteudoPlano}>

                    <View style={styles.conteudoTopo}>
                        <CustomText style={styles.subtopicos}>TERMO DE ESCLARECIMENTO E CIÊNCIA 
                        DE CONTRATAÇÃO DE PLANO</CustomText>
                        <CustomText style={styles.textos}>Esta aba tem como objetivo esclarecer as condições, termos e funcionamento do plano de assinatura contratado no aplicativo SOF7. Ao prosseguir com a assinatura, o usuário declara ter lido, compreendido e aceito integralmente as informações abaixo: </CustomText>
                    </View>

                    <View style={styles.conteudoTexto}>
                        <CustomText style={styles.subtopicos}>1. OBJETO DO PLANO</CustomText>

                        <CustomText style={styles.textos}>• Benefícios: A assinatura concede acesso a: funcionalidades básicas; To Do List; criação de mais um projeto; chamados com mensagem personalizada; geração de PDFs; criação de novos departamentos e adição de colaboradores a esses departamentos.</CustomText>
                        <CustomText style={styles.textos}>• Modalidade: O plano contratado é na modalidade mensal podendo ser cancelado a qualquer momento.</CustomText>

                        <CustomText style={styles.subtopicos}>2. VALORES E COBRANÇA</CustomText>
                        <CustomText style={styles.textos}>• Valor: O valor recorrente do plano é de R$ 45,00 por mês.</CustomText>
                        <CustomText style={styles.textos}>• Forma de Pagamento: A cobrança será realizada diretamente pela loja de aplicativos (Google Play Store ou Apple App Store) no cartão cadastrado ou método de pagamento escolhido.</CustomText>
                        <CustomText style={styles.textos}>• Renovação Automática: A assinatura é renovada automaticamente ao final de cada período contratado, a menos que seja cancelada pelo usuário com pelo menos 24 horas de antecedência em relação ao término do ciclo vigente.</CustomText>

                        <CustomText style={styles.subtopicos}>3. CANCELAMENTO E REEMBOLSO</CustomText>
                        <CustomText style={styles.textos}>• Como Cancelar: O cancelamento pode ser feito a qualquer momento diretamente pela aba de planos, dentro do perfil do usuário, logo abaixo dos termos.</CustomText>
                        <CustomText style={styles.textos}>• Vigência após o cancelamento: Ao cancelar, você continuará com acesso aos recursos do plano até o final do período já pago.</CustomText>
                        <CustomText style={styles.textos}>• Reembolsos: Pedidos de reembolso devem ser solicitados diretamente à plataforma responsável pela cobrança (Apple ou Google), sujeitos às políticas de reembolso de cada empresa.</CustomText>

                        <CustomText style={styles.subtopicos}>4. DECLARAÇÃO DE USUÁRIO</CustomText>
                        <CustomText style={styles.textos}>• Ao assinar, confirmo que sou maior de idade ou estou autorizado por um responsável legal, entendo a natureza recorrente das cobranças e concordo com os Termos de Uso e Política de Privacidade do aplicativo.</CustomText>
                    </View>

                    {
                        planoPago ?

                        <View style={styles.botoes}>
                            <TouchableOpacity activeOpacity={0.5} style={styles.cancelar} onPress={handleCancelar}>
                                <CustomText style={{fontWeight: "bold"}}>CANCELAR PLANO</CustomText>
                            </TouchableOpacity>
                        </View>
                        :
                        <View style={{gap: 10}}>
                            <TouchableOpacity onPress={() => setChecado(!checado)} style={styles.checkArea} activeOpacity={1}>
                                <View style={styles.checkbox}> { checado && (<Check/>)} </View>
                                <CustomText style={{textAlign: "center"}}>Li e aceito os termos estabelecidos.</CustomText>
                            </TouchableOpacity>
                            
                            <View style={styles.botoes}>

                                {
                                    checado ?
                                    <TouchableOpacity activeOpacity={0.5} style={styles.assinar} onPress={handleAssinar}>
                                        <CustomText style={{fontWeight: "bold"}}>ASSINAR PLANO</CustomText>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity activeOpacity={1} style={styles.assinarApagado}>
                                        <CustomText style={{fontWeight: "bold", color: "#5f5f5f"}}>ASSINAR PLANO</CustomText>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                    }

                    
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
    titulo: {fontSize: 22, color: "#1B8F65", fontWeight: "bold"},
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
        width: 200,
        alignItems: "center"
    },
    assinar: {
        backgroundColor: "#1B8F65",
        paddingHorizontal: 20, 
        paddingVertical: 15, 
        borderRadius: 15, 
        width: 200,
        alignItems: "center"
    },
    assinarApagado: {
        backgroundColor: "#383838",
        paddingHorizontal: 20, 
        paddingVertical: 15, 
        borderRadius: 15, 
        width: 200,
        alignItems: "center"
    },
    checkArea: {flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5},
    checkbox: {backgroundColor: "white", width: 20, height: 20, alignItems: "center", borderRadius: 5}
});

export default PlanoPago;