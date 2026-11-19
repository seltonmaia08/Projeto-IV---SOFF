import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Pencil, Trash } from "lucide-react-native";

import CustomText from "../Text/CustomText";
import StatusTarefaDrop from "./StatusTarefaDrop";

const CORES_STATUS = {
  1: "#242424",
  2: "#DA9304",
  3: "#28D593",
};

const CardTarefa = ({
  tarefa,
  selecionada,
  aoTocar,
  aoMudarStatus,
  aoEditar,
  aoExcluir,
}) => {
  return (
    <View style={styles.espaco}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={aoTocar}
      >
        <View
          style={[
            styles.faixa,
            { backgroundColor: CORES_STATUS[tarefa.status] },
          ]}
        />

        <View style={styles.conteudo}>
          <CustomText
            style={styles.texto}
            numberOfLines={selecionada ? undefined : 1}
          >
            {tarefa.texto}
          </CustomText>

          <StatusTarefaDrop status={tarefa.status} aoMudar={aoMudarStatus} />
        </View>
      </TouchableOpacity>

      {selecionada && (
        <View style={styles.areaPilula} pointerEvents="box-none">
          <View style={styles.pilula}>
            <TouchableOpacity
              onPress={aoEditar}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Editar tarefa"
            >
              <Pencil size={18} color="#DAD0B7" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={aoExcluir}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Excluir tarefa"
            >
              <Trash size={18} color="#DAD0B7" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default CardTarefa;

const styles = StyleSheet.create({
  espaco: {
    paddingBottom: 18,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#DAD0B7",
    borderRadius: 15,
    overflow: "hidden",
  },
  faixa: {
    width: 14,
  },
  conteudo: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 8,
  },
  texto: {
    fontSize: 14,
    color: "#242424",
  },
  areaPilula: {
    position: "absolute",
    bottom: 2,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  pilula: {
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
    backgroundColor: "#242424",
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 18,
    elevation: 8,
  },
});
