import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

import CustomText from '../../Components/Text/CustomText';

const Perfil = ({route}) => {

    const navegacao = useNavigation();
    const {urlFoto} = route.params;

    return (
        <View style={styles.escopo}> 

            <View style={styles.topo}>

                <TouchableOpacity style={styles.voltar} activeOpacity={0.5} onPress={() => navegacao.navigate("Dashboard")}>
                    <ChevronLeft style={styles.voltarIcon}/>
                </TouchableOpacity>
                <Image style={styles.banner} source={{uri: "https://thmais.com.br/wp-content/uploads/2026/01/semana-do-cinema-retorna-em-fevereiro-com-ingressos-a-precos-populares.jpg"}}/>
                <View style={styles.fotoPerfilCampo}>
                    <Image style={styles.fotoPerfil} source={{uri: urlFoto}} />
                </View>
            </View>

            <View style={styles.conteudoPerfil}>

                <View style={styles.textos}>
                    <CustomText style={styles.nomePerfil}>John Wick Kelvy</CustomText>
                    <CustomText style={styles.emailPefil}>johnkelvy@gmail.com</CustomText>
                </View>

                <View style={styles.areaBotoes}>
    
                    <View style={styles.gapButtons}>
                        <TouchableOpacity activeOpacity={0.7} style={styles.editar}>
                            <CustomText style={styles.textoBotao}>EDITAR PERFIL</CustomText>
                        </TouchableOpacity>
                    

                        <TouchableOpacity activeOpacity={0.7} style={styles.senha}>
                            <CustomText style={styles.textoBotao}>ALTERAR SENHA</CustomText>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.gapButtons}>
                        <TouchableOpacity activeOpacity={0.7} style={styles.plano}>
                            <CustomText style={styles.textoBotao}>PLANOS E ASSINATURA</CustomText>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.7} style={styles.sair}>
                            <CustomText style={styles.textoBotao}>LOGOUT</CustomText>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    escopo: {flex: 1, alignItems: "center"},
    voltarIcon: {color: "#DAD0B7", width: 30, height: 30,},
    voltar: { 
        position: "absolute", 
        zIndex: 1, 
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignSelf: "flex-start"
    },
    topo: {width: "100%", alignItems: "center"},
    banner: {width: "100%", height: 170, borderBottomLeftRadius: 30, borderBottomRightRadius: 30},
    fotoPerfilCampo: {
        width: 132, 
        height: 132, 
        borderRadius: 100, 
        overflow: "hidden", 
        position: "absolute", 
        top: 100,
        borderWidth: 5,
        borderColor: "#DAD0B7"
    },
    fotoPerfil: {width: "100%", height: "100%"},
    textos: {marginTop: 70, alignItems: "center", gap: 1},
    conteudoPerfil: {
        flex: 1,
        width: "100%", 
        paddingHorizontal: 20,  
    },
    nomePerfil: {fontSize: 22},
    emailPefil: {fontSize: 12, letterSpacing: "15%"},
    areaBotoes: {
        flex: 1, 
        width: "100%", 
        marginTop: 20, 
        gap: 10, 
        justifyContent: "space-between", 
        marginBottom: 60
    },
    editar: {width: 180, height: 50, backgroundColor: "#383838", borderRadius: 15, justifyContent: "center"},
    senha: {width: 180, height: 50, backgroundColor: "#383838", borderRadius: 15, justifyContent: "center"},
    plano: {
        width: "100%", 
        height: 50, 
        backgroundColor: "#383838", 
        borderRadius: 15, 
        justifyContent: "center",
    },
    sair: {
        width: "100%", 
        height: 50, 
        backgroundColor: "#EF5625", 
        borderRadius: 15, 
        justifyContent: "center",
    },
    textoBotao: {fontSize: 14, fontWeight: "bold", textAlign: "center"},
    gapButtons: {gap: 10, width: "100%", alignItems: "center"}
})

export default Perfil;