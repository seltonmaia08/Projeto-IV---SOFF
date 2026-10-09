import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import CustomText from '../Text/CustomText';
import AnotacoesPopUp from './AnotacoesPopUp';
import AddSceneList from '../Buttons/AddSceneList';

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

            <View style={styles.escopo}>
                
                <View style={styles.cards}>
                    <View style={styles.card}>
                        <View style={styles.conteudo}>
                            <CustomText style={styles.subtitulos}>Anotação 1</CustomText>
                            <CustomText style={styles.texto}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odio labore sunt eveniet quibusdam debitis quae amet reprehenderit explicabo, aut deserunt eius excepturi dolorum at veritatis velit iusto maiores. Veniam, dolore.</CustomText>    
                        </View>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.conteudo}>
                            <CustomText style={styles.subtitulos}>Anotação 1</CustomText>
                            <CustomText style={styles.texto}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odio labore sunt eveniet quibusdam debitis quae amet reprehenderit explicabo, aut deserunt eius excepturi dolorum at veritatis velit iusto maiores. Veniam, dolore.</CustomText>    
                        </View>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.conteudo}>
                            <CustomText style={styles.subtitulos}>Anotação 1</CustomText>
                            <CustomText style={styles.texto}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odio labore sunt eveniet quibusdam debitis quae amet reprehenderit explicabo, aut deserunt eius excepturi dolorum at veritatis velit iusto maiores. Veniam, dolore.</CustomText>    
                        </View>
                    </View>
                </View>

                <AddSceneList title={"ADICIONAR ANOTAÇÃO"} onPress={() => setAnotacoesVisivel(true)}/>


            </View>
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
        overflow: "hidden",
        padding: 10,
        gap: 50
    },
    cards: {gap: 10},
    card: {
        backgroundColor: "#DAD0B7",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 15,
    },
    conteudo: {height: 55, overflow: "hidden", gap: 5},
    subtitulos: {fontSize: 16, color: "#313131"},
    texto: {fontSize: 12, color: "#313131", textAlign: "justify", letterSpacing: 1.15}
});

export default Anotacoes;