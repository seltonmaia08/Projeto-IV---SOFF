import { View, StyleSheet } from 'react-native';

import CustomText from '../Text/CustomText';

const styles = StyleSheet.create({
    button: { 
        paddingHorizontal: 20, 
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