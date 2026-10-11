import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import CustomText from '../Text/CustomText';
import AnotacoesPopUp from './AnotacoesPopUp';
import AddSceneList from '../Buttons/AddSceneList';
import LerAnotacao from './LerAnotacao';

function Anotacoes() {

    const [listaAnotacoes, setListaAnotacoes] = useState([]);
    const [anotacoesVisivel, setAnotacoesVisivel] = useState(false);
    const [anotacaoSelecionada, setAnotacaoSelecionada] = useState(null);

    const handleFechar = () => {setAnotacoesVisivel(false)}
    const handleSalvar = (title, newNote) => {
        setListaAnotacoes([...listaAnotacoes, {titulo: title, anotacao: newNote}]);
        setAnotacoesVisivel(false);
    }

    const handleApagarAnotacao = (title) => {
        setListaAnotacoes(anteriores => anteriores.filter(item => item.titulo !== title));
        setAnotacaoSelecionada(null);
    }

    const atualizarNota = (oldTitle, newTitle, newNote) => {
        setListaAnotacoes(anteriores => 
            anteriores.map(cada => { // preencho minha lista retornando todos os antigos valores com map;
                if(cada.titulo === oldTitle){ return {titulo: newTitle, anotacao: newNote}} 
                // porém, ao achar o título antigo da anotação que eu quero alterar, eu
                // retorno ela com os novos valores
                return cada; // e se não achar, eu retorno simplesmente o que já era antes.
            })  
        )
        setAnotacaoSelecionada(null);
    }

    return(
        <View style={styles.geral}>

            <CustomText style={styles.titulo}>Anotações Gerais</CustomText>

            <View style={styles.escopo}>
                
                <View style={styles.cards}>
                    
                    {
                        listaAnotacoes.map((cada, index) => {
                            return(
                                <TouchableOpacity onPress={() => setAnotacaoSelecionada(cada)} key={index} activeOpacity={0.8}>
                                    <View style={styles.card}>
                                        <View style={styles.conteudo}>
                                            <CustomText style={styles.subtitulos}>{cada.titulo}</CustomText>
                                            <CustomText style={styles.texto}>{cada.anotacao}</CustomText>    
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })
                    }
                    
                </View>
                <AddSceneList title={"ADICIONAR ANOTAÇÃO"} onPress={() => setAnotacoesVisivel(true)}/>
            </View>
            <AnotacoesPopUp
                visivel = {anotacoesVisivel}
                aoFechar = {handleFechar}
                aoSalvar= {handleSalvar}
            />
            <LerAnotacao
                visivel = {anotacaoSelecionada != null}
                title = {anotacaoSelecionada?.titulo}
                note = {anotacaoSelecionada?.anotacao}
                aoFechar = {() => setAnotacaoSelecionada(null)}
                aoExcluir = {handleApagarAnotacao}
                aoSalvar = {atualizarNota}
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