import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Info, Bell, Clapperboard, Play, Network } from "lucide-react-native";

const TAMANHO_ICONE = 24;
const TAMANHO_BOLA = 48;

// Cores
const COR_CLARA = "#DAD0B7";
const COR_ESCURA = "#313131";

const ABAS = {
  Detalhes: { Icone: Info, nome: "Detalhes do projeto" },
  Notificacoes: { Icone: Bell, nome: "Notificações e lembretes" },
  Home: { Icone: Clapperboard, nome: "Início" },
  Continuidade: { Icone: Play, nome: "Continuidade" },
  Departamentos: { Icone: Network, nome: "Departamentos" },
};

const MenuNavegacao = ({ state, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.area, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.barra}>
        {state.routes.map((route, index) => {
          const ativa = state.index === index;

          const { Icone, nome } = ABAS[route.name];

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(route.name)}
              accessibilityLabel={nome}
              style={[styles.item, ativa && styles.itemAtivo]}
            >
              <Icone
                size={TAMANHO_ICONE}
                color={ativa ? COR_ESCURA : COR_CLARA}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default MenuNavegacao;

const styles = StyleSheet.create({
  area: {
    paddingHorizontal: 8,
    paddingTop: 8,
    backgroundColor: "#242424",
  },
  barra: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COR_ESCURA,
    borderRadius: 40,
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
  item: {
    width: TAMANHO_BOLA,
    height: TAMANHO_BOLA,
    borderRadius: TAMANHO_BOLA / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  itemAtivo: {
    backgroundColor: COR_CLARA,
  },
});
