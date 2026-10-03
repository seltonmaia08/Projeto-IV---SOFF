import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    button: {paddingHorizontal: 20, paddingVertical: 10, backgroundColor: "#5F5F5F", borderRadius: 15},
    textButton: {fontSize: 14, color: "#F0EADE", fontWeight: "bold"}
});

const GetOut_button = ({acao}) => {

    return(
        <View style={styles.button}>
            <Text style={styles.textButton}>{acao}</Text>
        </View>
    )
}

export default GetOut_button;