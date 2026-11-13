import { View, StyleSheet, Image } from 'react-native';

import CustomText from '../../Components/Text/CustomText';

const Perfil = () => {

    return (
        <View style={styles.escopo}> 

            <View style={styles.topo}>
                <Image style={styles.banner} source={{uri: "https://thmais.com.br/wp-content/uploads/2026/01/semana-do-cinema-retorna-em-fevereiro-com-ingressos-a-precos-populares.jpg"}}/>
                <View style={styles.fotoPerfilCampo}>
                    <Image style={styles.fotoPerfil} source={{uri: "https://i.pinimg.com/564x/df/8e/af/df8eaf796511ef2cf46570e9ec09a3ec.jpg"}} />
                </View>
            </View>

            <View style={styles.textos}>
                <CustomText style={styles.nomePerfil}>John Wick Kelvy</CustomText>
                <CustomText style={styles.emailPefil}>johnkelvy@gmail.com</CustomText>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    escopo: {flex: 1, alignItems: "center"},
    topo: {width: "100%", alignItems: "center"},
    banner: {width: "100%", height: 170, borderBottomLeftRadius: 30, borderBottomRightRadius: 30},
    fotoPerfilCampo: {
        width: 132, 
        height: 132, 
        borderRadius: 100, 
        overflow: "hidden", 
        position: "absolute", 
        top: 100,
        borderWidth: 5,
        borderColor: "#EF5625"
    },
    fotoPerfil: {width: "100%", height: "100%"},
    textos: {marginTop: 70, alignItems: "center", gap: 1},
    nomePerfil: {fontSize: 22},
    emailPefil: {fontSize: 12, letterSpacing: "15%"}
})

export default Perfil;