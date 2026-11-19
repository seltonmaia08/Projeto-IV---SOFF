import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';

import CustomText from '../../Components/Text/CustomText';
import EditarSenha from './EditarSenha';
import EditarPerfil from './EditarPerfil';
import SucessPopup from '../../Components/SucessPopUp/SucessPopup';
import { useAuth } from '../../Context/AuthContext';
import { supabase } from '../../Utils/Supabase';
import { StorageService } from '../../Utils/StorageService';
import AlertaGeral from '../../Components/Alerta/AlertaGeral';

const Perfil = ({ route }) => {
    const navegacao = useNavigation();
    const { user } = useAuth();

    const [editarVisivel, setEditarVisivel] = useState(false);
    const [editarSenhaVisivel, setEditarSenhaVisivel] = useState(false);
    const [popUpSucesso, setPopUpSucesso] = useState(false);

    const [nomeUsuario, setNomeUsuario] = useState(
        user?.user_metadata?.name || user?.user_metadata?.userName || "Usuário"
    );
    const [emailUsuario, setEmailUsuario] = useState(user?.email || "");
    const [fotoPerfil, setFotoPerfil] = useState(
        route?.params?.foto || user?.user_metadata?.avatar_url || user?.user_metadata?.photoUrl || "https://i.pinimg.com/736x/3d/b1/4a/3db14a40a4e8aa42636ce79da98c4c9e.jpg"
    );

    // Carrega os dados reais do perfil a partir do Supabase
    useEffect(() => {
        const carregarPerfil = async () => {
            if (!user?.id) return;
            try {
                const { data, error } = await supabase
                    .from('Profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle();

                if (!error && data) {
                    if (data.name) setNomeUsuario(data.name);
                    if (data.email) setEmailUsuario(data.email);
                    const foto = data.avatar || data.avatar_url || data.photoUrl || data.photo;
                    if (foto) setFotoPerfil(foto);
                } else if (user?.user_metadata) {
                    const fotoMeta = user.user_metadata.avatar_url || user.user_metadata.photoUrl;
                    if (fotoMeta) setFotoPerfil(fotoMeta);
                }
            } catch (err) {
                console.warn("Aviso ao carregar dados do perfil:", err);
            }
        };

        carregarPerfil();
    }, [user?.id]);

    async function alterarDados(novoNome, novoEmail, novaFoto) {
        try {
            if (!user?.id) return;

            let fotoUrlFinal = novaFoto;

            // Se for uma imagem local recém-selecionada, faz o upload usando o StorageService
            if (novaFoto && !novaFoto.startsWith('http://') && !novaFoto.startsWith('https://')) {
                try {
                    fotoUrlFinal = await StorageService.uploadImage(
                        novaFoto,
                        'continuity-images',
                        `profiles/${user.id}`
                    );
                } catch (uploadError) {
                    console.warn("Tentando upload no bucket profiles:", uploadError);
                    try {
                        fotoUrlFinal = await StorageService.uploadImage(
                            novaFoto,
                            'profiles',
                            `${user.id}`
                        );
                    } catch (e2) {
                        console.error("Erro no upload da foto de perfil:", e2);
                    }
                }
            }

            // 1. Atualiza metadados do Auth
            const authUpdatePayload = {
                data: {
                    name: novoNome,
                    userName: novoNome,
                    avatar_url: fotoUrlFinal,
                    photoUrl: fotoUrlFinal
                }
            };
            if (novoEmail && novoEmail !== user?.email) {
                authUpdatePayload.email = novoEmail;
            }
            await supabase.auth.updateUser(authUpdatePayload);

            // 2. Atualiza na tabela Profiles de forma resiliente
            let profileSalvo = false;
            for (const colFoto of ['avatar', 'avatar_url', 'photoUrl']) {
                const payload = { name: novoNome, email: novoEmail };
                if (fotoUrlFinal) payload[colFoto] = fotoUrlFinal;

                const { error: profErr } = await supabase
                    .from('Profiles')
                    .update(payload)
                    .eq('id', user.id);

                if (!profErr) {
                    profileSalvo = true;
                    break;
                }
            }

            if (!profileSalvo) {
                await supabase
                    .from('Profiles')
                    .update({ name: novoNome, email: novoEmail })
                    .eq('id', user.id);
            }

            setNomeUsuario(novoNome);
            setEmailUsuario(novoEmail);
            if (fotoUrlFinal) setFotoPerfil(fotoUrlFinal);
            setEditarVisivel(false);
            AlertaGeral.alert("Sucesso", "Perfil atualizado com sucesso!");
        } catch (err) {
            console.error("Erro ao salvar dados do perfil:", err);
            AlertaGeral.alert("Erro", "Não foi possível salvar as alterações.");
        }
    }

    function onSenhaAlteradaComSucesso() {
        setPopUpSucesso(true);
        setTimeout(() => {
            setPopUpSucesso(false);
        }, 3000);
    }

    function onDadosAlteradoComSucesso() {
        setEditarVisivel(false)
        setPopUpSucesso(true);
        setTimeout(() => {
            setPopUpSucesso(false);
        }, 3000);
    }

    const logout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    };

    return (
        <View style={styles.escopo}> 
            <View style={styles.topo}>
                <TouchableOpacity style={styles.voltar} activeOpacity={0.5} onPress={() => navegacao.navigate("Dashboard")}>
                    <ChevronLeft size={28} style={styles.voltarIcon}/>
                </TouchableOpacity>
                <Image style={styles.banner} source={{ uri: "https://thmais.com.br/wp-content/uploads/2026/01/semana-do-cinema-retorna-em-fevereiro-com-ingressos-a-precos-populares.jpg" }} />
                <View style={styles.fotoPerfilCampo}>
                    <Image style={styles.fotoPerfil} source={{ uri: fotoPerfil }} />
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

                        <TouchableOpacity activeOpacity={0.7} style={styles.sair} onPress={logout}>
                            <CustomText style={styles.textoBotao}>LOGOUT</CustomText>
                        </TouchableOpacity>
                    </View>
                </View>

                <EditarPerfil
                    visivel={editarVisivel}
                    nome={nomeUsuario}
                    email={emailUsuario}
                    fotoAtual={fotoPerfil}
                    aoFechar={() => setEditarVisivel(false)}
                    aoSalvar={onDadosAlteradoComSucesso}
                />

                <EditarSenha
                    visivel={editarSenhaVisivel}
                    aoFechar={() => setEditarSenhaVisivel(false)}
                    aoSalvar={onSenhaAlteradaComSucesso}
                />

                <SucessPopup
                    visivel={popUpSucesso}
                    mensagem={"Ação realizada com sucesso!"}
                />
            </View>
        </View>
    );
};

export default Perfil;

const styles = StyleSheet.create({
    escopo: { flex: 1, alignItems: "center" },
    voltarIcon: { color: "#DAD0B7" },
    voltar: { 
        position: "absolute", 
        zIndex: 1, 
        paddingVertical: 20,
        paddingHorizontal: 10,
        alignSelf: "flex-start"
    },
    topo: { width: "100%", alignItems: "center" },
    banner: { width: "100%", height: 170, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
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
    fotoPerfil: { width: "100%", height: "100%" },
    textos: { marginTop: 70, alignItems: "center", gap: 2 },
    conteudoPerfil: {
        flex: 1,
        width: "100%", 
        paddingHorizontal: 20,  
    },
    nomePerfil: { fontSize: 22, fontWeight: "bold" },
    emailPefil: { fontSize: 13, letterSpacing: 1.5, color: "#DAD0B7" },
    areaBotoes: {
        flex: 1, 
        width: "100%", 
        marginTop: 20, 
        gap: 10, 
        justifyContent: "space-between", 
        marginBottom: 60
    },
    editar: { width: 180, height: 50, backgroundColor: "#383838", borderRadius: 15, justifyContent: "center" },
    senha: { width: 180, height: 50, backgroundColor: "#383838", borderRadius: 15, justifyContent: "center" },
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
    textoBotao: { fontSize: 14, fontWeight: "bold", textAlign: "center" },
    gapButtons: { gap: 10, width: "100%", alignItems: "center" }
});
