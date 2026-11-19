import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect, useCallback, useContext } from "react";

import CustomText from "../../Components/Text/CustomText";
import Top from "../TopAba/Top";
import ButtonAdd from "../../Components/Buttons/ButtonAdd";
import NovoDepartamento from "./NovoDepartamento";
import { ProjectContext } from "../../Context/ProjectContext";
import { supabase } from "../../Utils/Supabase";
import AlertaGeral from "../../Components/Alerta/AlertaGeral";
import DepartamentoDetalhe from "./DepartamentoDetalhe";

const Departamentos = () => {
  const { idProject } = useContext(ProjectContext) || {};

  const [addDepart, setAddDepart] = useState(false);
  const [departamentos, setDepartamentos] = useState([]);
  const [todosMembros, setTodosMembros] = useState([]);
  const [departamentoSelecionado, setDepartamentoSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [departamentoAberto, setDepartamentoAberto] = useState(null);

  // Carrega os departamentos e membros do projeto
  const carregarDepartamentos = useCallback(async () => {
    if (!idProject) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // 1. Busca departamentos do projeto no Supabase (com timeout de segurança)
      let deptData = [];
      const deptPromise = supabase
        .from("Department")
        .select("*")
        .eq("idProject", idProject);

      const timeoutPromise = (ms) =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout ao carregar dados")), ms)
        );

      let { data: deptResult, error: deptError } = await Promise.race([
        deptPromise,
        timeoutPromise(8000),
      ]).catch((e) => ({ data: [], error: e }));

      if (deptError && deptError.code === "42703") {
        const { data: allDepts } = await supabase
          .from("Department")
          .select("*");
        deptData = allDepts || [];
      } else {
        if (deptError)
          console.warn("Aviso ao buscar departamentos:", deptError);
        deptData = deptResult || [];
      }

      // 2. Busca todos os membros do projeto em ProjectMember
      const { data: membData, error: membError } = await supabase
        .from("ProjectMember")
        .select("*")
        .eq("idProject", idProject);

      if (membError) {
        console.warn("Aviso ao buscar membros:", membError);
      }

      const membrosDoProjeto = membData || [];

      // 3. Busca os perfis para obter os nomes
      const userIds = membrosDoProjeto.map((m) => m.idUser).filter(Boolean);
      let profilesMap = {};
      if (userIds.length > 0) {
        const { data: profData } = await supabase
          .from("Profiles")
          .select("*")
          .in("id", userIds);

        if (profData) {
          profData.forEach((p) => {
            const uid = p.id || p.idUser;
            if (uid)
              profilesMap[uid] =
                p.name || p.userName || p.nome || "Participante";
          });
        }
      }

      // 4. Formata a lista completa de membros do projeto
      const membrosFormatados = membrosDoProjeto.map((m) => ({
        idProjectMember: m.idProjectMember,
        idUser: m.idUser,
        idDepartment: m.idDepartment,
        nome: profilesMap[m.idUser] || "Participante",
      }));
      setTodosMembros(membrosFormatados);

      // 5. Mapeia cada departamento com seus respectivos membros
      // Quando idProject não existe no Department, filtramos pelos depts que têm
      // ao menos um membro pertencente a este projeto
      const idsDepartamentosDosProjeto = new Set(
        membrosFormatados
          .map((m) => m.idDepartment)
          .filter(Boolean)
          .map(String),
      );

      const departamentosFormatados = (deptData || [])
        .filter((d) => {
          // Se a coluna idProject existe no resultado, filtra por ela
          if (d.idProject !== undefined)
            return String(d.idProject) === String(idProject);
          // Caso contrário, mantém apenas depts que têm membros deste projeto
          const idDept = d.idDepartment || d.id;
          return idsDepartamentosDosProjeto.has(String(idDept));
        })
        .map((d) => {
          const idDept = d.idDepartment || d.id;
          const nomeDept = d.departmentName || d.name || d.nome || "Sem nome";
          const membrosDesteDept = membrosFormatados.filter(
            (m) => String(m.idDepartment) === String(idDept),
          );

          return {
            idDepartment: idDept,
            nome: nomeDept,
            membros: membrosDesteDept.map((m) => m.nome),
            membrosIds: membrosDesteDept.map((m) => m.idProjectMember),
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

      // Insere na tabela Department, tentando com e sem a coluna idProject
      const payloadComProject = { idProject, departmentName: nome };
      const { data: inserted, error: insErr } = await supabase
        .from("Department")
        .insert([payloadComProject])
        .select();

      if (!insErr && inserted?.[0]) {
        novoId = inserted[0].idDepartment || inserted[0].id;
      } else if (insErr?.code === "42703") {
        // Coluna idProject não existe — insere sem ela
        const { data: ins2, error: insErr2 } = await supabase
          .from("Department")
          .insert([{ departmentName: nome }])
          .select();
        if (!insErr2 && ins2?.[0]) novoId = ins2[0].idDepartment || ins2[0].id;
        else if (insErr2) throw insErr2;
      } else if (insErr?.code === "PGRST204") {
        // Coluna departmentName não existe — tenta name
        const { data: ins3, error: insErr3 } = await supabase
          .from("Department")
          .insert([{ idProject, name: nome }])
          .select();
        if (!insErr3 && ins3?.[0]) novoId = ins3[0].idDepartment || ins3[0].id;
        else if (insErr3) throw insErr3;
      } else if (insErr) {
        throw insErr;
      }

      // Se houver membros selecionados, associa ao departamento
      if (novoId && membrosIds.length > 0) {
        const { error: updError } = await supabase
          .from("ProjectMember")
          .update({ idDepartment: novoId })
          .in("idProjectMember", membrosIds);

        if (updError) {
          console.warn("Aviso ao associar membros ao departamento:", updError);
        }
      }

      await carregarDepartamentos();
      AlertaGeral.alert(
        "Sucesso",
        `Departamento "${nome}" criado com sucesso!`,
      );
    } catch (err) {
      console.error("Erro ao criar departamento:", err);
      AlertaGeral.alert("Erro", "Não foi possível criar o departamento.");
    }
  };

  // Atualiza departamento, adiciona pessoas selecionadas e remove pessoas desmarcadas
  const salvarDepartamento = async ({
    idDepartment,
    nome,
    membrosIds = [],
  }) => {
    if (!idDepartment) return;
    try {
      // 1. Atualiza nome do departamento
      let { error: updDeptErr } = await supabase
        .from("Department")
        .update({ departmentName: nome })
        .eq("idDepartment", idDepartment);

      if (updDeptErr?.code === "PGRST204") {
        await supabase
          .from("Department")
          .update({ name: nome })
          .eq("idDepartment", idDepartment);
      }

      // 2. Busca quem estava neste departamento antes
      const membrosAntes = todosMembros.filter(
        (m) => String(m.idDepartment) === String(idDepartment),
      );
      const idsAntes = membrosAntes.map((m) => m.idProjectMember);

      // Membros a remover (estavam antes, mas foram desmarcados)
      const idsParaRemover = idsAntes.filter((id) => !membrosIds.includes(id));
      if (idsParaRemover.length > 0) {
        await supabase
          .from("ProjectMember")
          .update({ idDepartment: null })
          .in("idProjectMember", idsParaRemover);
      }

      // Membros a adicionar (marcados agora, mas não pertenciam a este departamento)
      const idsParaAdicionar = membrosIds.filter(
        (id) => !idsAntes.includes(id),
      );
      if (idsParaAdicionar.length > 0) {
        await supabase
          .from("ProjectMember")
          .update({ idDepartment })
          .in("idProjectMember", idsParaAdicionar);
      }

      await carregarDepartamentos();
      AlertaGeral.alert(
        "Sucesso",
        `Departamento "${nome}" atualizado com sucesso!`,
      );
    } catch (err) {
      console.error("Erro ao salvar departamento:", err);
      AlertaGeral.alert("Erro", "Não foi possível salvar as alterações.");
    }
  };

  // Exclui o departamento e desvincula os membros
  const excluirDepartamento = async (idDepartment, nomeDept) => {
    if (!idDepartment) return;
    try {
      // 1. Desvincula todos os membros pertencentes a esse departamento
      await supabase
        .from("ProjectMember")
        .update({ idDepartment: null })
        .eq("idDepartment", idDepartment);

      // 2. Deleta o departamento da tabela Department
      const { error: delErr } = await supabase
        .from("Department")
        .delete()
        .eq("idDepartment", idDepartment);

      if (delErr) throw delErr;

      await carregarDepartamentos();
      AlertaGeral.alert(
        "Sucesso",
        `Departamento "${nomeDept || ""}" excluído com sucesso!`,
      );
    } catch (err) {
      console.error("Erro ao excluir departamento:", err);
      AlertaGeral.alert("Erro", "Não foi possível excluir o departamento.");
    }
  };

  const confirmarExcluir = (departamento) => {
    AlertaGeral.alert(
      "Excluir Departamento",
      `Deseja realmente excluir o departamento "${departamento.nome}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () =>
            excluirDepartamento(departamento.idDepartment, departamento.nome),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Top abaName={"Departamentos"} voltar={false} />
      <ScrollView contentContainerStyle={styles.departamentos}>
        {loading ? (
          <View style={{ alignItems: "center", justifyContent: "center", gap: 10, marginTop: 40 }}>
            <ActivityIndicator size="large" color="#EF5625" />
            <CustomText>Carregando departamentos...</CustomText>
          </View>
        ) : departamentos.length === 0 ? (
          <View style={{ alignItems: "center", justifyContent: "center", gap: 10, marginTop: 40, paddingHorizontal: 20 }}>
            <CustomText style={{ textAlign: "center", fontSize: 16, color: "#DAD0B7" }}>
              Nenhum departamento cadastrado.
            </CustomText>
            <CustomText style={{ textAlign: "center", fontSize: 12, color: "#8E8E8E" }}>
              Toque no botão + abaixo para criar um departamento e vincular membros.
            </CustomText>
          </View>
        ) : (
          departamentos.map((cada, index) => (
            <TouchableOpacity
              activeOpacity={0.7}
              key={cada.idDepartment || index}
              onPress={() => setDepartamentoAberto(cada)}
              onLongPress={() => confirmarExcluir(cada)}
            >
              <View style={styles.depart}>
                <CustomText style={styles.textoDepart}>
                  {cada.nome.toUpperCase()}
                </CustomText>
                {cada.membros && cada.membros.length > 0 ? (
                  <CustomText style={styles.subtextoDepart}>
                    {cada.membros.length} colaborador{cada.membros.length > 1 ? "es" : ""}
                  </CustomText>
                ) : null}
              </View>
            </TouchableOpacity>
          ))
        )}
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
      {departamentoAberto && (
        <DepartamentoDetalhe
          visivel={true}
          departamento={departamentoAberto}
          aoFechar={() => setDepartamentoAberto(null)}
          aoEditarDepartamento={(dept) => {
            setDepartamentoAberto(null);
            setDepartamentoSelecionado(dept);
            setAddDepart(true);
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#242424" },
  departamentos: {
    alignItems: "center",
    marginTop: 50,
    gap: 20,
    paddingBottom: 100,
  },
  depart: {
    backgroundColor: "#DAD0B7",
    width: 280,
    padding: 20,
    borderRadius: 15,
  },
  textoDepart: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#242424",
    textAlign: "center",
  },
  subtextoDepart: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginTop: 4,
  },
  botaoAdd: { position: "absolute", bottom: 20, right: 20 },
});

export default Departamentos;
