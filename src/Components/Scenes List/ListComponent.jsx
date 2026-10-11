import { StyleSheet, TouchableOpacity, View } from 'react-native'
import CustomText from '../Text/CustomText'
import StatusSceneDrop from './StatusSceneDrop'
import { ClosedCaption, X } from 'lucide-react-native'

const ListComponent = ({ item, deleteScene }) => {

    return (
        <View style={styles.compList}>
            <View style={styles.detailsScene}>
                <CustomText style={styles.sceneNum}>
                    {item.sceneNumber}
                </CustomText>
                <CustomText style={styles.scenePlan}>
                    {item.scenePlan}
                </CustomText>
            </View>
            <View style={styles.detailsScene}>
                <View style={{flexDirection: 'row', display: 'flex', justifyContent: 'space-around'}}>
                    <CustomText style={styles.titleScene}>
                        {item.sceneDetails}
                    </CustomText>
                    <TouchableOpacity
                        onPress={() => deleteScene(item.idScenes)}
                        >
                        <X size={24} color={'#313131'} />
                    </TouchableOpacity>
                </View>
                <CustomText
                    style={styles.subtitleScene}
                    >
                    {item.sceneNote}
                </CustomText>
                <StatusSceneDrop id={item.idScenes} status={item.sceneStatus} />
            </View>
        </View>
    )
}

export default ListComponent

const styles = StyleSheet.create({
    compList: {
        flex: 1,
        height: 'auto',
        display: 'flex',
        alignItems: 'flex-start',
        flexDirection: 'row',
        backgroundColor: '#DAD0B7',
        borderRadius: 15,
        paddingVertical: 10,
        paddingHorizontal: 10,
        gap: 20,
        marginBottom: 10
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
        width: '100%',
        color: '#313131',
        fontSize: 16,
        textAlign: 'center',
        paddingTop: 5
    },
    titleScene: {
        flex: 1,
        color: '#313131',
        fontSize: 16,
    },
    subtitleScene: {
        width: 330,
        color: '#313131',
        fontSize: 12,
        fontWeight: '100',
        letterSpacing: 2
    },


})