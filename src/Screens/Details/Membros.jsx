import { View, StyleSheet, TouchableOpacity, Modal, Image, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { Check, Copy, ChevronDown } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

import Top from '../TopAba/Top';
import CustomText from '../../Components/Text/CustomText';
import MembrosModel from './MembrosModel';
import CargosPopUp from './CargosPopUp';
import { useContext } from 'react';
import { ProjectContext } from '../../Context/ProjectContext';
import { useMembers } from '../../Hook/useMembers';

function Membros({ visivel, aoFechar }) {

    const [copiado, setCopiado] = useState(false);
    const [cargoProprietario, setCargoProprietario] = useState("Proprietário");
    const [cargosVisivel, setCargosVisivel] = useState(false);

    const { idProject } = useContext(ProjectContext) || {};
    const { owner, members, linkInvitation, loading } = useMembers(idProject);

    const fotoPadrao = "https://i.pinimg.com/736x/3d/b1/4a/3db14a40a4e8aa42636ce79da98c4c9e.jpg";

    useEffect(() => {
        if (owner?.cargo) {
            setCargoProprietario(owner.cargo);
        }
    }, [owner?.cargo]);

    const copiarCodigo = async () => {
        if (linkInvitation) {
            await Clipboard.setStringAsync(linkInvitation);
            setCopiado(true);
            setTimeout(() => { setCopiado(false); }, 2000);
        }
    };

    function mudarCargoProprietario(novoCargo) {
        setCargoProprietario(novoCargo);
    }

    return (
        <Modal visible={visivel} onRequestClose={aoFechar}>
            <View style={styles.escopo}>

                <Top abaName="Membros" voltar={true} voltarOn={aoFechar} />

                <View style={styles.content}>

                    {loading ? (
                        <ActivityIndicator size="large" color="#EF5625" style={{ marginTop: 40 }} />
                    ) : (
                        <>
                            {/* --- SEÇÃO DO PROPRIETÁRIO --- */}
                            <View style={styles.campo}>
                                <CustomText style={styles.secaoProprietario}>Proprietário</CustomText>
                                <View style={styles.perfilProprietario}>

                                    <View style={styles.dadosProprietario}>
                                        <View style={styles.fotinhaProprietario}>
                                            <Image 
                                                source={{ uri: owner?.avatar || fotoPadrao }} 
                                                style={styles.icons} 
                                            />
                                        </View>
                                        <View style={styles.perfilInfos}>
                                            <CustomText style={styles.perfilNome}>
                                                {owner?.userName || "Nome não encontrado"}
                                            </CustomText>
                                            <CustomText style={styles.perfilEmail}>
                                                {owner?.email || "E-mail não informado"}
                                            </CustomText>
                                            <TouchableOpacity 
                                                onPress={() => setCargosVisivel(true)} 
                                                activeOpacity={0.7} 
                                                style={styles.perfilTagProprietario}
                                            >
                                                <CustomText style={styles.perfilEmail}>{cargoProprietario}</CustomText>
                                                <ChevronDown style={styles.setinha} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.linha}></View>

                            {/* --- SEÇÃO DOS PARTICIPANTES --- */}
                            <View style={styles.campo}>
                                <CustomText style={styles.secaoParticipantes}>Participantes</CustomText>

                                {members.length === 0 ? (
                                    <CustomText style={{ color: "#DAD0B7", fontStyle: "italic" }}>
                                        Nenhum participante adicionado ainda.
                                    </CustomText>
                                ) : (
                                    members.map((membro, index) => (
                                        <MembrosModel
                                            key={membro.idProjectMember || index}
                                            imagem={membro.User?.avatar || fotoPadrao}
                                            nome={membro.User?.userName || "Sem nome"}
                                            email={membro.User?.email || "Sem e-mail"}
                                            cargo={membro.cargo || "Sem cargo"}
                                        />
                                    ))
                                )}
                            </View>
                        </>
                    )}

                    <TouchableOpacity style={styles.botaoConvidar} activeOpacity={0.5} onPress={copiarCodigo}>
                        <CustomText style={styles.textoBotao}>Convidar Via Link</CustomText>
                        {copiado ? (<Check style={{ color: "#1B8F65" }} />) : (<Copy style={{ color: "#F0EADE" }} />)}
                    </TouchableOpacity>

                    <CargosPopUp
                        visivel={cargosVisivel}
                        aoFechar={() => setCargosVisivel(false)}
                        aoSelecionar={mudarCargoProprietario}
                    />

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    escopo: { backgroundColor: "#242424", flex: 1 },
    content: { padding: 20, height: "100%", width: "100%", gap: 20 },
    campo: { gap: 10 },
    secaoProprietario: { fontSize: 12, fontWeight: "bold", color: "#1B8F65" },
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
    dadosProprietario: { flexDirection: "row", gap: 10, alignItems: "center", width: "100%" },
    icons: { width: "100%", height: "100%" },
    fotinhaProprietario: {
        width: 70,
        height: 70,
        borderColor: "#1B8F65",
        borderWidth: 4,
        borderRadius: 100,
        overflow: "hidden"
    },
    perfilInfos: { flex: 1, gap: 2 },
    perfilNome: { fontSize: 20 },
    perfilEmail: { fontSize: 12 },
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
    linha: { borderColor: "#242424", borderBottomColor: "#313131", borderWidth: 3 },
    secaoParticipantes: { fontSize: 12, fontWeight: "bold", color: "#DAD0B7" },
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
    textoBotao: { fontSize: 16, fontWeight: "bold", textAlign: "center" },
    setinha: { color: "#DAD0B7" }
});

export default Membros;
