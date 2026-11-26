import { View, StyleSheet } from 'react-native';

import CustomText from '../Text/CustomText';

const styles = StyleSheet.create({
    button: { 
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        backgroundColor: "#F68E49", 
        borderRadius: 15,
        alignItems: "center"
    },
    textButton: {fontSize: 14, color: "#242424", fontWeight: "bold"}
});

const GetIn_button = ({acao}) => {

    return(
        <View style={styles.button}>
            <CustomText style={styles.textButton}>{acao}</CustomText>
        </View>
    )
}

export default GetIn_button;