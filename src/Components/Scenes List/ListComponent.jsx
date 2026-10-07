import { StyleSheet, View } from 'react-native'
import CustomText from '../Text/CustomText'
import StatusSceneDrop from './StatusSceneDrop'

const ListComponent = ({ item }) => {
    
    return (
        <View style={styles.compList}>
            <View style={styles.detailsScene}>
                <CustomText style={styles.sceneNum}>
                   { item.sceneNumber }
                </CustomText>
                <CustomText style={styles.scenePlan}>
                    { item.scenePlan }
                </CustomText>
            </View>
            <View style={styles.detailsScene}>
                <CustomText style={styles.titleScene}>
                    { item.sceneDetails }
                </CustomText>
                <CustomText style={styles.subtitleScene}>
                    { item.sceneNote }
                </CustomText>
                <StatusSceneDrop id={item.idScenes} status={item.sceneStatus}/>
            </View>
        </View>
    )
}

export default ListComponent

const styles = StyleSheet.create({
    compList: {
        width: '100%',
        height: 97,
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'row',
        backgroundColor: '#F0EADE',
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 20,
    },
    detailsScene: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    sceneNum: {
        width: 58,
        height: 50,
        fontSize: 26,
        fontWeight: '800',
        backgroundColor: '#313131',
        borderRadius: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    scenePlan: {
        color: '#313131',
        fontSize: 16,
    },
     titleScene: {
        color: '#313131',
        fontSize: 16,
    },
    subtitleScene: {
        color: '#313131',
        fontSize: 12,
        fontWeight: '100',
        letterSpacing: 2
    },


})