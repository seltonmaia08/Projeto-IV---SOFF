import { View, Text, StyleSheet } from 'react-native';

import CustomText from '../src/Components/Text/CustomText';

const styles = StyleSheet.create({
    button: {
        width: 114, 
        paddingHorizontal: 10, 
        paddingVertical: 10, 
        backgroundColor: "#EF5625", 
        borderRadius: 15,
        alignItems: "center"
    },
    textButton: {fontSize: 14, color: "#F0EADE", fontWeight: "bold"}
});

const GetIn_button = ({acao}) => {

    return(
        <View style={styles.button}>
            <CustomText style={styles.textButton}>{acao}</CustomText>
        </View>
    )
}

export default GetIn_button;