import { StyleSheet, TouchableOpacity } from "react-native";
import CustomText from "../Text/CustomText";
import { LinearGradient } from "expo-linear-gradient";
import { Plus } from "lucide-react-native";

const GerarPDF = ({ onPress, desativado, carregando }) => {
  return (
    <TouchableOpacity
      style={[styles.button, desativado && styles.buttonDesativado]}
      onPress={onPress}
    >
      <CustomText
        style={[styles.textButton, desativado && styles.textDesativado]}
      >
        {carregando ? "Gerando..." : "Gerar PDF"}
      </CustomText>
    </TouchableOpacity>
  );
};

export default GerarPDF;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 58,
    borderRadius: 15,
    backgroundColor: "#F0EADE",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  textButton: {
    color: "#313131",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "bold",
  },
  buttonDesativado: {
    backgroundColor: "#5F5F5F",
  },
  textDesativado: {
    color: "#F0EADE",
  },
});
