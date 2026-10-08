import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import CustomText from '../Text/CustomText';
import AnotacoesPopUp from './AnotacoesPopUp';

function Anotacoes() {

    const [anotacoesVisivel, setAnotacoesVisivel] = useState(false);
    const [textoAnotacao, setTextoAnotacao] = useState("");

    const handleFechar = () => {setAnotacoesVisivel(false)}
    const handleSalvar = (novoTexto) => {
        setTextoAnotacao(novoTexto);
        setAnotacoesVisivel(false);
    }

    return(
        <View style={styles.geral}>

            <CustomText style={styles.titulo}>Anotações Gerais</CustomText>

            <TouchableOpacity activeOpacity={0.8} onPress={() => setAnotacoesVisivel(true)}>
            <View style={styles.escopo}>
                
                <View style={styles.campoTexto}>
                    <CustomText style={styles.texto}>{textoAnotacao}</CustomText>
                </View>
                
            </View>
            </TouchableOpacity>
            <AnotacoesPopUp
                visivel = {anotacoesVisivel}
                textoInicial = {textoAnotacao}
                aoFechar = {handleFechar}
                aoSalvar= {handleSalvar}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    geral: {flex: 1, gap: 10},
    titulo: {fontSize: 18},
    escopo: {
        width: '100%',
        borderRadius: 15, 
        borderColor: "#EF5625", 
        borderWidth: 2, 
        overflow: "hidden",
        padding: 10
    },
    campoTexto: {backgroundColor: "#F0EADE", height: 400, borderRadius: 15, padding: 20},
    texto: {fontSize: 12, color: "#313131", textAlign: "justify"}
});

export default Anotacoes;