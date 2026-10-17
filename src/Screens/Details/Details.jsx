import { backupDatabaseAsync } from 'expo-sqlite';
import { View, StyleSheet } from 'react-native'
import BackgroundGradient from '../../Components/BackgroundGradient/BackgroundGradient';

import CustomText from '../../Components/Text/CustomText';

function Details () {

    return (
        <View style={styles.escopo}>
            
            <View style={styles.topAba}>
                <CustomText style={styles.tituloAba}>Detalhes do Projeto</CustomText>
            </View>

            <View style={styles.conteudoTela}>
                <View style={styles.campoProjeto}>   

                    <View style={styles.campoProjetoItens}>
                        <CustomText style={styles.nomeProjeto}>Nome do Projeto</CustomText>
                        <View style={styles.campoTexto}>
                            <CustomText style={styles.nomeProjetoTexto}>Rosa dos Ventos</CustomText>
                        </View>
                    </View>

                    <View style={styles.campoProjetoItens}>
                        <CustomText style={styles.nomeProjeto}>Produtora</CustomText>
                        <View style={styles.campoTexto}>
                            <CustomText style={styles.nomeProjetoTexto}>LandoP</CustomText>
                        </View>
                    </View>

                </View>

                <View style={styles.outrosCampos}>
                    <View style={styles.campoMembros}>
                        <View>
                            <CustomText style={styles.textoMembros}>Membros</CustomText>
                        </View>
                    </View>

                    <View style={styles.campoMembros}>
                        <View>
                            <CustomText style={styles.textoMembros}>Links</CustomText>
                        </View>
                    </View>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    escopo: {backgroundColor: "#242424", flex: 1},
    topAba: {backgroundColor: "#313131", height: 105, padding: 20, justifyContent: "flex-end"},
    tituloAba: {fontSize: 18, fontWeight: "bold", color: "#DAD0B7"},
    conteudoTela: {padding: 20, gap: 30},
    campoProjeto: {
        backgroundColor: "#313131", 
        padding: 20, 
        borderRadius: 15,
        gap: 10
    },
    campoProjetoItens: {gap: 10},
    nomeProjeto: {fontSize: 14},
    campoTexto: {borderBottomColor: "#EF5625", borderBottomWidth: 2},
    nomeProjetoTexto: {fontSize: 16, marginLeft: 10, marginBottom: 10},
    outrosCampos: {gap: 10},
    campoMembros: {backgroundColor: "#313131", padding: 20, borderRadius: 15},
    textoMembros: {fontSize: "16"}
})

export default Details;