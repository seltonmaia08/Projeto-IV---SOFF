import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useState } from "react";

import CustomText from '../../Components/Text/CustomText';

function Planos({route}) {

    const {nomeUsuario, emailUsuario, planoPago, sucesso} = route.params;
    
    const navegacao = useNavigation();

    return(
        <View style={styles.escopo}>

            <View style={styles.topo}>

                <TouchableOpacity activeOpacity={0.5} onPress={() => navegacao.navigate("Perfil")}>
                    <ChevronLeft style={styles.topoIcone}/>
                </TouchableOpacity>

                <View style={styles.topoTexto}>
                    <CustomText style={styles.nome}>{nomeUsuario}</CustomText>
                    <CustomText style={styles.email}>{emailUsuario}</CustomText>
                </View>
            </View>

            <View style={styles.conteudo}>

                <CustomText style={styles.titulo}>Plano Atual</CustomText>
                {
                    planoPago?
                    <View style={styles.conteudoChave}>
                        <TouchableOpacity style={styles.cardPlano} activeOpacity={0.7} onPress={() => navegacao.navigate("PlanoPago", {nomeUsuario, emailUsuario, planoPago})}>
                            
                            <View style={styles.conteudoCard}>
                                <CustomText style={styles.tituloCardPago}>Plano PRO</CustomText>
                                <View style={styles.funcionalidades}>
                                    <CustomText>• Funcionalidades básicas;</CustomText>
                                    <CustomText>• Criar mais de um projeto;</CustomText>
                                    <CustomText>• Chamado com mensagem adicional; </CustomText>
                                    <CustomText>• Criação de novos departamentos + TO DO list;</CustomText>
                                    <CustomText>• Adição de membros nos departamentos separados; </CustomText>
                                    <CustomText>• Geração de PDF. </CustomText>
                                </View>

                                <View style={styles.preco}>
                                    <CustomText style={styles.precoPro}>R$ 45,00 
                                        <CustomText style={styles.mes}> / mês</CustomText>
                                    </CustomText>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.linha}></View>

                        <CustomText style={styles.titulo}>Outros Planos</CustomText>
                        <TouchableOpacity style={styles.cardPlano} activeOpacity={0.7} onPress={() => navegacao.navigate("PlanoGratuito", {nomeUsuario, emailUsuario, planoPago})}>
                            
                            <View style={styles.conteudoCard}>
                                <CustomText style={styles.tituloCardGratuito}>Plano Gratuito</CustomText>
                                <View style={styles.funcionalidades}>
                                    <CustomText>• Funcionalidades básicas;</CustomText>
                                    <CustomText>• Criar apenas um projeto.</CustomText>
                                </View>

                                <View style={styles.preco}>
                                    <CustomText style={styles.precoGratuito}>R$ 0,00 
                                        <CustomText style={styles.mes}> / mês</CustomText>
                                    </CustomText>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    :

                    <View style={styles.conteudoChave}>
                        <TouchableOpacity style={styles.cardPlano} activeOpacity={0.7} onPress={() => navegacao.navigate("PlanoGratuito", {nomeUsuario, emailUsuario, planoPago})}>
                            
                            <View style={styles.conteudoCard}>
                                <CustomText style={styles.tituloCardGratuito}>Plano Gratuito</CustomText>
                                <View style={styles.funcionalidades}>
                                    <CustomText>• Funcionalidades básicas;</CustomText>
                                    <CustomText>• Criar apenas um projeto.</CustomText>
                                </View>

                                <View style={styles.preco}>
                                    <CustomText style={styles.precoGratuito}>R$ 0,00 
                                        <CustomText style={styles.mes}> / mês</CustomText>
                                    </CustomText>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.linha}></View>

                        <CustomText style={styles.titulo}>Outros Planos</CustomText>
                        <TouchableOpacity style={styles.cardPlano} activeOpacity={0.7} onPress={() => navegacao.navigate("PlanoPago", {nomeUsuario, emailUsuario, planoPago})}>
                            
                            <View style={styles.conteudoCard}>
                                <CustomText style={styles.tituloCardPago}>Plano PRO</CustomText>
                                <View style={styles.funcionalidades}>
                                    <CustomText>• Funcionalidades básicas;</CustomText>
                                    <CustomText>• Criar mais de um projeto;</CustomText>
                                    <CustomText>• Chamado com mensagem adicional; </CustomText>
                                    <CustomText>• Criação de novos departamentos + TO DO list;</CustomText>
                                    <CustomText>• Adição de membros nos departamentos separados; </CustomText>
                                    <CustomText>• Geração de PDF. </CustomText>
                                </View>

                                <View style={styles.preco}>
                                    <CustomText style={styles.precoPro}>R$ 45,00 
                                        <CustomText style={styles.mes}> / mês</CustomText>
                                    </CustomText>
                                </View>
                            </View>
                        </TouchableOpacity>
                        
                    </View>
                }
            </View>
        </View>
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
    conteudoChave: {gap: 20},
    titulo: {fontSize: 18},
    cardPlano: {alignItems: "center", width: "100%"},
    tituloCardPago: {fontSize: 22, color: "#1B8F65", fontWeight: "bold"},
    conteudoCard: {padding: 20, backgroundColor: "#383838", borderRadius: 15, gap: 10, width: "100%"},
    funcionalidades: {gap: 5},
    preco: {alignItems: "flex-end"},
    precoPro: {color: "#1B8F65", fontSize: 22, fontWeight: "bold"},
    mes: {fontSize: 12, fontWeight: "500"},
    linha: {borderBottomColor: "#DAD0B7", borderBottomWidth: 1},
    tituloCardGratuito: {fontSize: 22, fontWeight: "bold", color: "#EF5625"},
    precoGratuito: {color: "#EF5625", fontSize: 22, fontWeight: "bold"},
});

export default Planos;