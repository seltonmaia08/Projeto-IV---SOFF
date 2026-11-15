import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

import CustomText from '../../Components/Text/CustomText';
import EditarSenha from './EditarSenha';
import EditarPerfil from './EditarPerfil';

const Perfil = ({route}) => {

    const navegacao = useNavigation();
    const [editarVisivel, setEditarVisivel] = useState(false);
    const [editarSenhaVisivel, setEditarSenhaVisivel] = useState(false);
    const [nomeUsuario, setNomeUsuario] = useState("John Wick Kelvy"); // mockado
    const [emailUsuario, setEmailUsuario] = useState("johnkelvy@gmail.com"); // mockado
    const [senhaUsuario, setSenhaUsuario] = useState("mucholoco99"); // mockado
    const { fotoPerfil } = route.params;

    function alterarDados(novoNome, novoEmail) {

        setNomeUsuario(novoNome);
        setEmailUsuario(novoEmail);
        setEditarVisivel(false);
    }

    function alterarSenha (novaSenha) {
        setSenhaUsuario(novaSenha);
    }

    return (
        <View style={styles.escopo}> 

            <View style={styles.topo}>

                <TouchableOpacity style={styles.voltar} activeOpacity={0.5} onPress={() => navegacao.navigate("Dashboard")}>
                    <ChevronLeft style={styles.voltarIcon}/>
                </TouchableOpacity>
                <Image style={styles.banner} source={{uri: "https://thmais.com.br/wp-content/uploads/2026/01/semana-do-cinema-retorna-em-fevereiro-com-ingressos-a-precos-populares.jpg"}}/>
                <View style={styles.fotoPerfilCampo}>
                    <Image style={styles.fotoPerfil} source={{uri: fotoPerfil}} />
                </View>
            </View>

            <View style={styles.conteudoPerfil}>

                <View style={styles.textos}>
                    <CustomText style={styles.nomePerfil}>{nomeUsuario}</CustomText>
                    <CustomText style={styles.emailPefil}>{emailUsuario}</CustomText>
                </View>

                <View style={styles.areaBotoes}>
    
                    <View style={styles.gapButtons}>
                        <TouchableOpacity activeOpacity={0.7} style={styles.editar} onPress={() => setEditarVisivel(true)}>
                            <CustomText style={styles.textoBotao}>EDITAR PERFIL</CustomText>
                        </TouchableOpacity>
                    

                        <TouchableOpacity activeOpacity={0.7} style={styles.senha} onPress={() => setEditarSenhaVisivel(true)}>
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

                <EditarPerfil
                    visivel={editarVisivel}
                    nome={nomeUsuario}
                    email={emailUsuario}
                    aoFechar={() => setEditarVisivel(false)}
                    aoSalvar={alterarDados}
                />
                <EditarSenha
                    visivel={editarSenhaVisivel}
                    senhaAtual={senhaUsuario}
                    aoFechar={() => setEditarSenhaVisivel(false)}
                    aoSalvar={alterarSenha}
                />

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