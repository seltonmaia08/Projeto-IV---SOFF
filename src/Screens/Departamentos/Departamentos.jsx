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
  const [donoProjetoId, setDonoProjetoId] = useState(null);

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

      // 2. Busca os dados do Projeto para obter o dono (idUser)
      let ownerId = null;
      try {
        const { data: projData, error: projErr } = await supabase
          .from("Project")
          .select("idUser")
          .eq("idProject", idProject)
          .single();

        if (!projErr && projData?.idUser) {
          ownerId = projData.idUser;
          setDonoProjetoId(ownerId);
        }
      } catch (e) {
        console.warn("Aviso ao buscar dono do projeto:", e);
      }

      // 3. Busca todos os membros do projeto em ProjectMember
      const { data: membData, error: membError } = await supabase
        .from("ProjectMember")
        .select("*")
        .eq("idProject", idProject);

      if (membError) {
        console.warn("Aviso ao buscar membros:", membError);
      }

      const membrosDoProjeto = membData || [];

      // 4. Coleta os IDs de todos os usuários a serem consultados (membros + dono)
      const userIdsSet = new Set();
      if (ownerId) userIdsSet.add(ownerId);
      membrosDoProjeto.forEach((m) => {
        if (m.idUser) userIdsSet.add(m.idUser);
      });

      // 5. Busca os perfis para obter os nomes
      let profilesMap = {};
      if (userIdsSet.size > 0) {
        const { data: profData } = await supabase
          .from("Profiles")
          .select("*")
          .in("id", Array.from(userIdsSet));

        if (profData) {
          profData.forEach((p) => {
            const uid = p.id || p.idUser;
            if (uid)
              profilesMap[uid] =
                p.name || p.userName || p.nome || "Participante";
          });
        }
      }

      // 6. Formata a lista de colaboradores únicos do projeto (inclui o dono do projeto)
      const seenUsers = new Set();
      const membrosUnicos = [];

      // Se houver dono, inclui na lista para que possa participar de qualquer departamento
      if (ownerId) {
        seenUsers.add(ownerId);
        const ownerRow = membrosDoProjeto.find((m) => m.idUser === ownerId);
        const cargoDono = ownerRow?.cargo || ownerRow?.position || "Proprietário";
        membrosUnicos.push({
          idProjectMember: ownerId, // Usamos sempre o idUser (UUID) como chave identificadora única
          idUser: ownerId,
          nome: profilesMap[ownerId] || "Proprietário",
          cargo: cargoDono,
          isOwner: true,
        });
      }

      // Adiciona os demais membros sem duplicatas
      membrosDoProjeto.forEach((m) => {
        if (m.idUser && !seenUsers.has(m.idUser)) {
          seenUsers.add(m.idUser);
          membrosUnicos.push({
            idProjectMember: m.idUser, // Usamos sempre o idUser (UUID) como chave identificadora única
            idUser: m.idUser,
            nome: profilesMap[m.idUser] || "Participante",
            cargo: m.cargo || m.position || "Participante",
            isOwner: false,
          });
        }
      });

      setTodosMembros(membrosUnicos);

      // 7. Mapeia cada departamento com seus respectivos membros
      // Um colaborador agora pode participar de múltiplos departamentos!
      const idsDepartamentosDosMembros = new Set(
        membrosDoProjeto
          .map((m) => m.idDepartment)
          .filter(Boolean)
          .map(String),
      );

      const departamentosFormatados = (deptData || [])
        .filter((d) => {
          if (d.idProject !== undefined)
            return String(d.idProject) === String(idProject);
          const idDept = d.idDepartment || d.id;
          return idsDepartamentosDosMembros.has(String(idDept));
        })
        .map((d) => {
          const idDept = d.idDepartment || d.id;
          const nomeDept = d.departmentName || d.name || d.nome || "Sem nome";

          // Filtra todas as linhas de ProjectMember que pertencem a este departamento
          const registrosDesteDept = membrosDoProjeto.filter(
            (m) => m.idDepartment && String(m.idDepartment) === String(idDept),
          );

          // Pega os userIds únicos deste departamento
          const userIdsDesteDept = Array.from(
            new Set(registrosDesteDept.map((m) => m.idUser).filter(Boolean)),
          );

          return {
            idDepartment: idDept,
            nome: nomeDept,
            membros: userIdsDesteDept.map(
              (uid) => profilesMap[uid] || (uid === ownerId ? "Proprietário" : "Participante"),
            ),
            membrosIds: userIdsDesteDept, // array de idUser dos colaboradores vinculados
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

  // Cria um novo departamento e associa os membros selecionados (sem desvincular de outros departamentos)
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
        const { data: ins2, error: insErr2 } = await supabase
          .from("Department")
          .insert([{ departmentName: nome }])
          .select();
        if (!insErr2 && ins2?.[0]) novoId = ins2[0].idDepartment || ins2[0].id;
        else if (insErr2) throw insErr2;
      } else if (insErr?.code === "PGRST204") {
        const { data: ins3, error: insErr3 } = await supabase
          .from("Department")
          .insert([{ idProject, name: nome }])
          .select();
        if (!insErr3 && ins3?.[0]) novoId = ins3[0].idDepartment || ins3[0].id;
        else if (insErr3) throw insErr3;
      } else if (insErr) {
        throw insErr;
      }

      // Se houver membros selecionados, associa cada um ao novo departamento
      if (novoId && membrosIds.length > 0) {
        const { data: currentMembers } = await supabase
          .from("ProjectMember")
          .select("*")
          .eq("idProject", idProject);

        const currentMembersList = currentMembers || [];

        // Converte qualquer identificador recebido no idUser (UUID)
        const resolvedUserIds = membrosIds
          .map((id) => {
            if (typeof id === "string" && id.includes("-")) return id;
            const match = currentMembersList.find(
              (m) => String(m.idProjectMember) === String(id) || m.idUser === id,
            );
            return match?.idUser || id;
          })
          .filter(Boolean);

        for (const userId of resolvedUserIds) {
          // Se o usuário tem uma linha com idDepartment nulo, atualiza essa linha
          const rowWithNull = currentMembersList.find(
            (m) => m.idUser === userId && !m.idDepartment,
          );

          if (rowWithNull) {
            await supabase
              .from("ProjectMember")
              .update({ idDepartment: novoId })
              .eq("idProjectMember", rowWithNull.idProjectMember);
          } else {
            // Caso contrário, insere uma nova associação para manter o participante nos outros departamentos
            const existingRow = currentMembersList.find((m) => m.idUser === userId);
            const userCargo =
              existingRow?.cargo ||
              existingRow?.position ||
              (userId === donoProjetoId ? "Proprietário" : "Participante");

            await supabase
              .from("ProjectMember")
              .insert([
                {
                  idProject,
                  idUser: userId,
                  idDepartment: novoId,
                  cargo: userCargo,
                  position: userCargo,
                },
              ]);
          }
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
  // Permite que um mesmo colaborador participe de mais de um departamento
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

      // 2. Busca todas as linhas de ProjectMember deste projeto
      const { data: allMembersData } = await supabase
        .from("ProjectMember")
        .select("*")
        .eq("idProject", idProject);

      const allMembers = allMembersData || [];

      // Converte qualquer identificador recebido no idUser (UUID) com resiliência
      const resolvedUserIds = membrosIds
        .map((id) => {
          if (typeof id === "string" && id.includes("-")) return id;
          const match = allMembers.find(
            (m) => String(m.idProjectMember) === String(id) || m.idUser === id,
          );
          return match?.idUser || id;
        })
        .filter(Boolean);

      // Membros que estavam vinculados a este departamento antes
      const rowsDesteDept = allMembers.filter(
        (m) => m.idDepartment && String(m.idDepartment) === String(idDepartment),
      );
      const userIdsAntes = Array.from(
        new Set(rowsDesteDept.map((m) => m.idUser).filter(Boolean)),
      );

      // 3. Membros a remover (estavam no departamento antes, mas foram desmarcados)
      const userIdsParaRemover = userIdsAntes.filter(
        (uid) => !resolvedUserIds.includes(uid),
      );

      for (const uid of userIdsParaRemover) {
        const rowsToRemove = rowsDesteDept.filter((r) => r.idUser === uid);
        const userOtherRows = allMembers.filter(
          (m) => m.idUser === uid && String(m.idDepartment) !== String(idDepartment),
        );

        if (userOtherRows.length > 0) {
          // O usuário já pertence a outro departamento ou tem outra linha: remove esta linha de vinculação
          for (const row of rowsToRemove) {
            await supabase
              .from("ProjectMember")
              .delete()
              .eq("idProjectMember", row.idProjectMember);
          }
        } else {
          // É a única linha do usuário no projeto: seta idDepartment como null para mantê-lo no projeto
          for (const row of rowsToRemove) {
            await supabase
              .from("ProjectMember")
              .update({ idDepartment: null })
              .eq("idProjectMember", row.idProjectMember);
          }
        }
      }

      // 4. Membros a adicionar (marcados agora, mas não pertenciam a este departamento)
      const userIdsParaAdicionar = resolvedUserIds.filter(
        (uid) => !userIdsAntes.includes(uid),
      );

      for (const uid of userIdsParaAdicionar) {
        // Se tem linha com idDepartment nulo, atualiza essa linha
        const rowWithNull = allMembers.find(
          (m) => m.idUser === uid && !m.idDepartment,
        );

        if (rowWithNull) {
          await supabase
            .from("ProjectMember")
            .update({ idDepartment })
            .eq("idProjectMember", rowWithNull.idProjectMember);
        } else {
          // Insere nova associação para este departamento, mantendo as associações anteriores
          const existingRow = allMembers.find((m) => m.idUser === uid);
          const userCargo =
            existingRow?.cargo ||
            existingRow?.position ||
            (uid === donoProjetoId ? "Proprietário" : "Participante");

          await supabase
            .from("ProjectMember")
            .insert([
              {
                idProject,
                idUser: uid,
                idDepartment,
                cargo: userCargo,
                position: userCargo,
              },
            ]);
        }
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

  // Exclui o departamento e desvincula os membros sem remover quem participa de outros departamentos
  const excluirDepartamento = async (idDepartment, nomeDept) => {
    if (!idDepartment) return;
    try {
      // 1. Busca todos os membros do projeto para tratar desvinculação
      const { data: allMembersData } = await supabase
        .from("ProjectMember")
        .select("*")
        .eq("idProject", idProject);

      const allMembers = allMembersData || [];
      const rowsDesteDept = allMembers.filter(
        (m) => m.idDepartment && String(m.idDepartment) === String(idDepartment),
      );

      for (const row of rowsDesteDept) {
        const uid = row.idUser;
        const otherRows = allMembers.filter(
          (m) => m.idUser === uid && m.idProjectMember !== row.idProjectMember,
        );

        if (otherRows.length > 0) {
          // O usuário já possui outra linha (outro departamento ou nulo); deleta esta linha
          await supabase
            .from("ProjectMember")
            .delete()
            .eq("idProjectMember", row.idProjectMember);
        } else {
          // Única linha do usuário: define idDepartment como null para manter o membro no projeto
          await supabase
            .from("ProjectMember")
            .update({ idDepartment: null })
            .eq("idProjectMember", row.idProjectMember);
        }
      }

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
