import { View } from "react-native";

import Container from "../../Components/Container/Container";
import CustomText from "../../Components/Text/CustomText";
const EmBreve = ({ route }) => {
  return (
    <Container>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        <CustomText style={{ fontSize: 20, fontWeight: "bold" }}>
          {route.name}
        </CustomText>
        <CustomText>Esta aba ainda será construída.</CustomText>
      </View>
    </Container>
  );
};

export default EmBreve;
