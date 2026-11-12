import { useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import CustomText from "../Text/CustomText";
import CardChamado from "./CardChamado";
import { useChamados } from "../../Context/ChamadosContext";

const ViewCalled = () => {
  const { chamados, marcarComoLido, marcarTodosComoLidos } = useChamados();

  useFocusEffect(
    useCallback(() => {
      return () => marcarTodosComoLidos();
    }, []),
  );

  return (
    <View style={styles.container}>
      {chamados.length === 0 ? (
        <CustomText style={styles.vazio}>
          Nenhum chamado por enquanto.
        </CustomText>
      ) : (
        <FlatList
          data={chamados}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CardChamado chamado={item} aoLer={() => marcarComoLido(item.id)} />
          )}
        />
      )}
    </View>
  );
};

export default ViewCalled;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  vazio: {
    textAlign: "center",
    margin: 10,
  },
});
