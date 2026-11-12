import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { supabase } from '../../Utils/Supabase';
import { projectMemberService } from '../../Services/api';
import { useAuth } from '../../Context/AuthContext';
import CustomText from '../Text/CustomText';

const JoinProjectPopUp = ({ visivel, aoFechar, aoEntrarComSucesso }) => {

    const { user } = useAuth()
    const [codigo, setCodigo] = useState('')
    const [loading, setLoading] = useState(false)

    const entrarNoProjeto = async () => {
        const codLimpo = codigo.trim().toLowerCase()
        if (!codigo) {
            Alert.alert('Aviso', 'Digite o código de convite.')
            return
        }

        try {
            setLoading(true)

            //Procurar por um projeto com esse código
            const { data: projeto, error: projError } = await supabase
                .from('Project')
                .select('*')
                .eq('linkInvitation', codLimpo)
                .single()

            if (projError === !projeto) {
                Alert.alert('Erro', 'Projeto não encontrado. Verifique o código digitado.');
                return;
            }
            // 2. Verifica se o usuário já é membro deste projeto
            const { data: membroExistente } = await supabase
                .from('ProjectMember')
                .select('*')
                .eq('idProject', projeto.idProject)
                .eq('idUser', user.id)
                .single();
            if (membroExistente) {
                Alert.alert('Aviso', 'Você já faz parte deste projeto!');
                aoFechar();
                return;
            }
            // 3. Adiciona o usuário como membro na tabela ProjectMember
            await projectMemberService.create({
                idProject: projeto.idProject,
                idUser: user.id,
                cargo: 'Participante'
            });
            Alert.alert('Sucesso!', `Você entrou no projeto "${projeto.projectName}".`);
            setCodigo('');
            aoEntrarComSucesso(); // Dispara o refetch() do Dashboard
            aoFechar();
        } catch (error) {
            console.error('Erro ao entrar no projeto:', error);
            Alert.alert('Erro', 'Não foi possível entrar no projeto.');
        } finally {
            setLoading(false);
        }

    }

    return (
        <Modal
            visible={visivel}
            transparent={true}
            animationType='fade'
            onRequestClose={aoFechar}
        >
            <BlurView style={styles.overlay} intensity={40} tint='dark'>
                <View style={styles.popUp}>
                    <Text style={styles.criar}>Criar Projeto</Text>

                    <View style={styles.dados}>
                        <View style={styles.campo}>
                            <Text style={styles.labels}>Código de convite </Text>
                            <TextInput value={codigo} onChangeText={setCodigo} style={styles.inputs} />
                        </View>
                    </View>

                    <View style={styles.botoes}>
                        <TouchableOpacity activeOpacity={0.5} onPress={aoFechar}>
                            <GetOut_button acao="CANCELAR" />
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={0.5} onPress={aoEntrarComSucesso}>
                            <GetInGreen_button acao="ENTRAR" />
                        </TouchableOpacity>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center"
    },
    popUp: {
        width: 312,
        backgroundColor: "#313131",
        borderRadius: 15,
        padding: 20,
        gap: 40
    },
    criar: { fontWeight: "bold", fontSize: 18, color: "#F0EADE" },
    dados: { gap: 10 },
    campo: { flexDirection: "row", gap: 10 },
    labels: { fontSize: 16, color: "#F0EADE" },
    inputs: {
        flex: 1,
        fontSize: 16,
        color: "#F0EADE",
        borderBottomColor: "#EF5625",
        borderBottomWidth: 1,
        outlineStyle: "none"
    },
    areaLink: { alignSelf: "center", gap: 15 },
    linkAviso: { fontSize: 12, color: "#F0EADE", letterSpacing: 1.15, textAlign: "center" },
    copiarCodigo: { flexDirection: "row", gap: 10, alignSelf: "center" },
    codigo: {
        fontSize: 12,
        color: "#EF5625",
        letterSpacing: 1.15,
        textAlign: "center",
        fontWeight: "bold",
        paddingBottom: 5,
        borderBottomColor: "#EF5625",
        borderBottomWidth: 1,
        alignSelf: "center"
    },
    botoes: { flexDirection: "row", justifyContent: "space-between" }
});