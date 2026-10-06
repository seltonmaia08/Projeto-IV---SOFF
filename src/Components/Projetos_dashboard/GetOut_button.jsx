import { View, StyleSheet } from 'react-native';

import CustomText from '../Text/CustomText';

const styles = StyleSheet.create({
    button: { 
        paddingHorizontal: 20, 
        paddingVertical: 10, 
        backgroundColor: "#5F5F5F", 
        borderRadius: 15,
        alignItems: "center"
    },
    textButton: {fontSize: 14, color: "#F0EADE", fontWeight: "bold"}
});

const GetOut_button = ({acao}) => {

    return(
        <View style={styles.button}>
            <CustomText style={styles.textButton}>{acao}</CustomText>
        </View>
    )
}

export default GetOut_button;