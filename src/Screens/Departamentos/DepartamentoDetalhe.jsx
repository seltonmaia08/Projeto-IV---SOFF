import { useState } from "react";
import {
  View,
  Modal,
  ScrollView,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Users, UserRoundPlus, Pencil } from "lucide-react-native";

import Top from "../TopAba/Top";
import CustomText from "../../Components/Text/CustomText";
import AnotacoesDepartamento from "../../Components/Anotacoes/AnotacoesDepartamento";
import ToDoList from "../../Components/ToDoList/ToDoList";

const DepartamentoDetalhe = ({
  visivel,
  departamento,
  aoFechar,
  aoEditarDepartamento,
}) => {
  const [membrosAberto, setMembrosAberto] = useState(false);

  const sair = () => {
    setMembrosAberto(false);
    aoFechar();
  };

  const membros = departamento?.membros || [];

  return (
    <Modal visible={visivel} animationType="slide" onRequestClose={sair}>
      <View style={styles.tela}>
        <View style={styles.topoContainer}>
          <Top abaName={departamento?.nome || "Departamento"} voltar={true} voltarOn={sair} />

          <View style={styles.botoesTopo}>
            {aoEditarDepartamento && (
              <TouchableOpacity
                style={styles.botaoAcaoTopo}
                activeOpacity={0.6}
                onPress={() => {
                  sair();
                  aoEditarDepartamento(departamento);
                }}
                accessibilityLabel="Editar departamento"
              >
                <Pencil size={20} color="#DAD0B7" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.botaoAcaoTopo}
              activeOpacity={0.6}
              onPress={() => setMembrosAberto(!membrosAberto)}
              accessibilityLabel="Ver colaboradores do departamento"
            >
              <Users size={24} color="#DAD0B7" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.conteudoScroll}>
          <ToDoList idDepartment={departamento?.idDepartment}/>
          <AnotacoesDepartamento idDepartment={departamento?.idDepartment} />
        </ScrollView>

        {membrosAberto && (
          <>
            <Pressable
              style={StyleSheet.absoluteFill}
              onPress={() => setMembrosAberto(false)}
            />

            <View style={styles.popUpMembros}>
              <CustomText style={styles.tituloPopUpMembros}>
                Colaboradores ({membros.length})
              </CustomText>

              <ScrollView style={{ maxHeight: 180 }} nestedScrollEnabled={true}>
                {membros.length > 0 ? (
                  membros.map((nome, index) => (
                    <View key={index} style={styles.itemMembro}>
                      <CustomText style={styles.nomeMembro}>{nome}</CustomText>
                    </View>
                  ))
                ) : (
                  <View style={styles.itemMembro}>
                    <CustomText
                      style={[
                        styles.nomeMembro,
                        { fontStyle: "italic", opacity: 0.7 },
                      ]}
                    >
                      Nenhum membro vinculado
                    </CustomText>
                  </View>
                )}
              </ScrollView>

              <TouchableOpacity
                style={styles.botaoAddMembro}
                activeOpacity={0.7}
                onPress={() => {
                  setMembrosAberto(false);
                  if (aoEditarDepartamento) {
                    sair();
                    aoEditarDepartamento(departamento);
                  }
                }}
              >
                <UserRoundPlus size={18} color="#242424" />
                <CustomText style={styles.textoAddMembro}>
                  Gerenciar membros
                </CustomText>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
};

export default DepartamentoDetalhe;

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: "#242424",
  },
  topoContainer: {
    position: "relative",
  },
  botoesTopo: {
    position: "absolute",
    right: 20,
    top: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    zIndex: 10,
  },
  botaoAcaoTopo: {
    padding: 4,
  },
  conteudoScroll: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 60,
  },
  popUpMembros: {
    position: "absolute",
    top: 126,
    right: 20,
    width: 260,
    backgroundColor: "#313131",
    borderRadius: 20,
    padding: 16,
    gap: 6,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#444",
    zIndex: 999,
  },
  tituloPopUpMembros: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#DAD0B7",
    marginBottom: 6,
  },
  itemMembro: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#242424",
  },
  nomeMembro: {
    fontSize: 14,
    color: "#DAD0B7",
  },
  botaoAddMembro: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 44,
    backgroundColor: "#DAD0B7",
    borderRadius: 22,
    marginTop: 10,
  },
  textoAddMembro: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#242424",
  },
});
