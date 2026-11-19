import { View, StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

const OPCOES = [
  { label: "Pendente", value: "1" },
  { label: "Em andamento", value: "2" },
  { label: "Concluído", value: "3" },
];

const StatusTarefaDrop = ({ status, aoMudar }) => {
  return (
    <View style={styles.caixa}>
      <Dropdown
        style={styles.dropdown}
        selectedTextStyle={styles.texto}
        data={OPCOES}
        labelField="label"
        valueField="value"
        value={status}
        onChange={(item) => aoMudar(item.value)}
        containerStyle={styles.lista}
        itemTextStyle={styles.textoItem}
        activeColor="#555555"
        iconColor="#DAD0B7"
        iconStyle={styles.icone}
      />
    </View>
  );
};

export default StatusTarefaDrop;

const styles = StyleSheet.create({
  caixa: {
    width: 130,
  },
  dropdown: {
    height: 26,
    backgroundColor: "#313131",
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  texto: {
    fontSize: 12,
    color: "#DAD0B7",
  },

  lista: {
    backgroundColor: "#313131",
    borderRadius: 15,
    borderWidth: 0,
    overflow: "hidden",
  },
  textoItem: {
    fontSize: 13,
    color: "#DAD0B7",
  },
  icone: {
    width: 18,
    height: 18,
  },
});
