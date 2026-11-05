import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import CustomText from '../../Components/Text/CustomText';
import Top from '../TopAba/Top';
import ButtonAdd from '../../Components/Buttons/ButtonAdd';
import NovoDepartamento from './NovoDepartamento';

const Departamentos = () => {

    const [addDepart, setAddDepart] = useState(false);

    return(
        <View>
            <Top abaName={"Departamentos"} voltar={false}/>

            <View style={styles.departamentos}>

                <TouchableOpacity activeOpacity={0.7}>
                    <View style={styles.depart}>
                        <CustomText style={styles.textoDepart}>ÁUDIO</CustomText>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7}>
                    <View style={styles.depart}>
                        <CustomText style={styles.textoDepart}>VÍDEO</CustomText>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7}>
                    <View style={styles.depart}>
                        <CustomText style={styles.textoDepart}>ARTE</CustomText>
                    </View>
                </TouchableOpacity>
                
                <ButtonAdd style={styles.botaoAdd} onPress={() => setAddDepart(true)}/>
                <NovoDepartamento
                    visivel={addDepart}
                    aoFechar={() => setAddDepart(false)}
                />

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    departamentos: {alignItems: "center", marginTop: 50, gap: 20},
    depart: {backgroundColor: "#DAD0B7", width: 280, padding: 20, borderRadius: 15},
    textoDepart: {fontWeight: "bold", fontSize: 20, color: "#242424", textAlign: "center"},
    botaoAdd: {position: "absolute", bottom: 20, right: 20} // e esse botão bugado? 
})

export default Departamentos;