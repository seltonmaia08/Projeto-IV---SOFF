import { FlatList, StyleSheet, View } from 'react-native'
import BackgroundGradient from '../BackgroundGradient/BackgroundGradient'
import ListComponent from './ListComponent'
import CustomText from '../Text/CustomText'
import AddSceneList from '../Buttons/AddSceneList'
import GerarPDF from '../Buttons/GerarPDF'
import CreateItemList from './CreateItemScene'
import { useState } from 'react'

const ScenesList = () => {
    const [isActive, setIsActive] = useState(false)
    console.log(isActive)

    const verifyStateActive = () => {
        console.log(isActive)
        if(!isActive){
            setIsActive(true)
        } else setIsActive(false)
    }

    const dadosDeTeste = [
        { id: '1', scene: '19', plan: 'Plano 4', title: 'Fazenda - EXT - DIA', subtitle: 'Precisa dos animais' },
        { id: '2', scene: '20', plan: 'Plano 1', title: 'Casa - INT - NOITE', subtitle: 'Luz apagada' }
    ]

    return (
        <View style={styles.container}>
            <CustomText style={styles.label}>Lista de Cenas</CustomText>
            {/* <BackgroundGradient> */}
            <View style={styles.card}>
                <FlatList
                    style={{ width: '100%' }}
                    data={dadosDeTeste}
                    renderItem={({ item }) => <ListComponent item={item} />}
                    keyExtractor={(item) => item.id}
                />
                <AddSceneList 
                    onPress={verifyStateActive}
                    onChange={setIsActive}
                    />
                <GerarPDF />
            </View>
            {

                isActive === true && <CreateItemList setIsActive={setIsActive}/>

            }
            {/* </BackgroundGradient> */}
        </View>
    )
}

export default ScenesList

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        width: '100%',
        backgroundColor: '#313131',
        borderColor: '#EF5625',
        borderWidth: 2,
        borderRadius: 15,
        padding: 10,
    },
    label: {
        marginBottom: 10,
        fontSize: 18
    },
    list: {
        width: '100%',
    }
})