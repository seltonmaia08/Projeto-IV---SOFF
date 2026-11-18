import { View, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback, useContext } from 'react';

import CustomText from '../../Components/Text/CustomText';
import Top from '../TopAba/Top';
import ButtonAdd from '../../Components/Buttons/ButtonAdd';
import NovoDepartamento from './NovoDepartamento';
import { ProjectContext } from '../../Context/ProjectContext';
import { supabase } from '../../Utils/Supabase';

const Departamentos = () => {

    const { idProject } = useContext(ProjectContext) || {};

    const [addDepart, setAddDepart] = useState(false);
    const [departamentos, setDepartamentos] = useState([]);
    const [todosMembros, setTodosMembros] = useState([]);
    const [departamentoSelecionado, setDepartamentoSelecionado] = useState(null);
    const [loading, setLoading] = useState(false);

    // Carrega os departamentos e membros do projeto
    const carregarDepartamentos = useCallback(async () => {
        if (!idProject) return;
        try {
            setLoading(true);

            // 1. Busca departamentos do projeto no Supabase
            const { data: deptData, error: deptError } = await supabase
                .from('Department')
                .select('*')
                .eq('idProject', idProject);

            if (deptError) {
                console.warn("Aviso ao buscar departamentos:", deptError);
            }

            // 2. Busca todos os membros do projeto em ProjectMember
            const { data: membData, error: membError } = await supabase
                .from('ProjectMember')
                .select('*')
                .eq('idProject', idProject);

            if (membError) {
                console.warn("Aviso ao buscar membros:", membError);
            }

            const membrosDoProjeto = membData || [];

            // 3. Busca os perfis para obter os nomes
            const userIds = membrosDoProjeto.map(m => m.idUser).filter(Boolean);
            let profilesMap = {};
            if (userIds.length > 0) {
                const { data: profData } = await supabase
                    .from('Profiles')
                    .select('*')
                    .in('id', userIds);

                if (profData) {
                    profData.forEach(p => {
                        const uid = p.id || p.idUser;
                        if (uid) profilesMap[uid] = p.name || p.userName || p.nome || "Participante";
                    });
                }
            }

            // 4. Formata a lista completa de membros do projeto
            const membrosFormatados = membrosDoProjeto.map(m => ({
                idProjectMember: m.idProjectMember,
                idUser: m.idUser,
                idDepartment: m.idDepartment,
                nome: profilesMap[m.idUser] || "Participante"
            }));
            setTodosMembros(membrosFormatados);

            // 5. Mapeia cada departamento com seus respectivos membros
            const departamentosFormatados = (deptData || []).map(d => {
                const idDept = d.idDepartment || d.id;
                const nomeDept = d.departmentName || d.name || d.nome || "Sem nome";
                const membrosDesteDept = membrosFormatados.filter(
                    m => String(m.idDepartment) === String(idDept)
                );

                return {
                    idDepartment: idDept,
                    nome: nomeDept,
                    membros: membrosDesteDept.map(m => m.nome),
                    membrosIds: membrosDesteDept.map(m => m.idProjectMember)
                };
            });

            setDepartamentos(departamentosFormatados);
        } catch (err) {
            console.error("Erro ao carregar departamentos:", err);
        } finally {
            setLoading(false);
        }
    }, [idProject]);

    useEffect(() => {
        carregarDepartamentos();
    }, [carregarDepartamentos]);

    // Cria um novo departamento e associa os membros selecionados
    const criarDepartamento = async ({ nome, membrosIds = [] }) => {
        if (!idProject) return;
        try {
            let novoId = null;

            // Insere na tabela Department (tentando colunas departmentName / name)
            const { data: inserted, error: insErr } = await supabase
                .from('Department')
                .insert([{ idProject, departmentName: nome }])
                .select();

            if (!insErr && inserted?.[0]) {
                novoId = inserted[0].idDepartment || inserted[0].id;
            } else if (insErr?.code === 'PGRST204') {
                const { data: ins2 } = await supabase
                    .from('Department')
                    .insert([{ idProject, name: nome }])
                    .select();
                if (ins2?.[0]) novoId = ins2[0].idDepartment || ins2[0].id;
            } else if (insErr) {
                throw insErr;
            }

            // Se houver membros selecionados, associa ao departamento
            if (novoId && membrosIds.length > 0) {
                const { error: updError } = await supabase
                    .from('ProjectMember')
                    .update({ idDepartment: novoId })
                    .in('idProjectMember', membrosIds);

                if (updError) {
                    console.warn("Aviso ao associar membros ao departamento:", updError);
                }
            }

            await carregarDepartamentos();
            Alert.alert("Sucesso", `Departamento "${nome}" criado com sucesso!`);
        } catch (err) {
            console.error("Erro ao criar departamento:", err);
            Alert.alert("Erro", "Não foi possível criar o departamento.");
        }
    };

    // Atualiza departamento, adiciona pessoas selecionadas e remove pessoas desmarcadas
    const salvarDepartamento = async ({ idDepartment, nome, membrosIds = [] }) => {
        if (!idDepartment) return;
        try {
            // 1. Atualiza nome do departamento
            let { error: updDeptErr } = await supabase
                .from('Department')
                .update({ departmentName: nome })
                .eq('idDepartment', idDepartment);

            if (updDeptErr?.code === 'PGRST204') {
                await supabase
                    .from('Department')
                    .update({ name: nome })
                    .eq('idDepartment', idDepartment);
            }

            // 2. Busca quem estava neste departamento antes
            const membrosAntes = todosMembros.filter(m => String(m.idDepartment) === String(idDepartment));
            const idsAntes = membrosAntes.map(m => m.idProjectMember);

            // Membros a remover (estavam antes, mas foram desmarcados)
            const idsParaRemover = idsAntes.filter(id => !membrosIds.includes(id));
            if (idsParaRemover.length > 0) {
                await supabase
                    .from('ProjectMember')
                    .update({ idDepartment: null })
                    .in('idProjectMember', idsParaRemover);
            }

            // Membros a adicionar (marcados agora, mas não pertenciam a este departamento)
            const idsParaAdicionar = membrosIds.filter(id => !idsAntes.includes(id));
            if (idsParaAdicionar.length > 0) {
                await supabase
                    .from('ProjectMember')
                    .update({ idDepartment })
                    .in('idProjectMember', idsParaAdicionar);
            }

            await carregarDepartamentos();
            Alert.alert("Sucesso", `Departamento "${nome}" atualizado com sucesso!`);
        } catch (err) {
            console.error("Erro ao salvar departamento:", err);
            Alert.alert("Erro", "Não foi possível salvar as alterações.");
        }
    };

    // Exclui o departamento e desvincula os membros
    const excluirDepartamento = async (idDepartment, nomeDept) => {
        if (!idDepartment) return;
        try {
            // 1. Desvincula todos os membros pertencentes a esse departamento
            await supabase
                .from('ProjectMember')
                .update({ idDepartment: null })
                .eq('idDepartment', idDepartment);

            // 2. Deleta o departamento da tabela Department
            const { error: delErr } = await supabase
                .from('Department')
                .delete()
                .eq('idDepartment', idDepartment);

            if (delErr) throw delErr;

            await carregarDepartamentos();
            Alert.alert("Sucesso", `Departamento "${nomeDept || ''}" excluído com sucesso!`);
        } catch (err) {
            console.error("Erro ao excluir departamento:", err);
            Alert.alert("Erro", "Não foi possível excluir o departamento.");
        }
    };

    const confirmarExcluir = (departamento) => {
        Alert.alert(
            "Excluir Departamento",
            `Deseja realmente excluir o departamento "${departamento.nome}"?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => excluirDepartamento(departamento.idDepartment, departamento.nome)
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Top abaName={"Departamentos"} voltar={false}/>
            <ScrollView contentContainerStyle={styles.departamentos}>

                {
                    departamentos.map((cada, index) =>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            key={cada.idDepartment || index}
                            onPress={() => {
                                setDepartamentoSelecionado(cada);
                                setAddDepart(true);
                            }}
                            onLongPress={() => confirmarExcluir(cada)}
                        >
                            <View style={styles.depart}>
                                <CustomText style={styles.textoDepart}>{cada.nome.toUpperCase()}</CustomText>
                            </View>
                        </TouchableOpacity>
                    )
                }

            </ScrollView>
                
            <ButtonAdd
                style={styles.botaoAdd}
                onPress={() => {
                    setDepartamentoSelecionado(null);
                    setAddDepart(true);
                }}
            />
            <NovoDepartamento
                visivel={addDepart}
                aoFechar={() => {
                    setAddDepart(false);
                    setDepartamentoSelecionado(null);
                }}
                aoCriarDepart={criarDepartamento}
                aoSalvarDepart={salvarDepartamento}
                aoExcluirDepart={excluirDepartamento}
                departamentoParaEditar={departamentoSelecionado}
                todosMembros={todosMembros}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: "#242424"},
    departamentos: {alignItems: "center", marginTop: 50, gap: 20, paddingBottom: 100},
    depart: {backgroundColor: "#DAD0B7", width: 280, padding: 20, borderRadius: 15},
    textoDepart: {fontWeight: "bold", fontSize: 20, color: "#242424", textAlign: "center"},
    botaoAdd: {position: "absolute", bottom: 20, right: 20}
});

export default Departamentos;