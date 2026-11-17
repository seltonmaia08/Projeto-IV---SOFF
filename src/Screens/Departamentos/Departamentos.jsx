import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';

import CustomText from '../../Components/Text/CustomText';
import Top from '../TopAba/Top';
import ButtonAdd from '../../Components/Buttons/ButtonAdd';
import NovoDepartamento from './NovoDepartamento';

const Departamentos = () => {

    const [addDepart, setAddDepart] = useState(false);
    const [departamentos, setDepartamentos] = useState([
        {nome: "áudio", membros: ["Samuel Moreno", "Selton Maia"]},
        {nome: "vídeo", membros: ["Clenda Uchoa", "Tiago"]},
        {nome: "arte", membros: ["John Kelvy", "João", "Pedro"]},
    ]);

    function adicionarDepartamentos(objetoDepartMembros) {
        setDepartamentos(anteriores => [...anteriores, objetoDepartMembros])
    }

    return(
        <View>
            <Top abaName={"Departamentos"} voltar={false}/>
            <View style={styles.departamentos}>

                {
                    departamentos.map((cada, index) =>
                        <TouchableOpacity activeOpacity={0.7} key={index}>
                            <View style={styles.depart}>
                                <CustomText style={styles.textoDepart}>{cada.nome.toUpperCase()}</CustomText>
                            </View>
                        </TouchableOpacity>
                    )
                }
                
                <ButtonAdd style={styles.botaoAdd} onPress={() => setAddDepart(true)}/>
                <NovoDepartamento
                    visivel={addDepart}
                    aoFechar={() => setAddDepart(false)}
                    aoCriarDepart={adicionarDepartamentos}
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