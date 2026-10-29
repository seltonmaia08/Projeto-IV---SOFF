import { StyleSheet, TouchableOpacity, View } from 'react-native'
import CustomText from '../Text/CustomText'
import StatusSceneDrop from './StatusSceneDrop'
import { ClosedCaption, X } from 'lucide-react-native'
import { useState } from 'react'

const ListComponent = ({ item, deleteScene }) => {
    const [status, setStatus] = useState(item.sceneStatus)
    const [isActive, setIsActive] = useState(false)

    const getBorderColor = () => {
        if (status === '2') return '#DA9304';
        if (status === '3') return '#1B8F65';
        return '#242424';
    };

    return (
        <TouchableOpacity style={[
            styles.compList,
            { borderColor: getBorderColor() }
        ]}
            onPress={() => setIsActive((prev) => !prev)}
        >

            <View style={styles.leftColumn}>
                <CustomText style={styles.sceneNum}>
                    {item.sceneNumber}
                </CustomText>
                <CustomText style={styles.scenePlan}>
                    {item.scenePlan}
                </CustomText>
            </View>

            <View style={styles.rightColumn}>
                <View style={styles.headerRow}>
                    <CustomText style={styles.titleScene} numberOfLines={2}>
                        {item.sceneDetails}
                    </CustomText>
                    <TouchableOpacity
                        onPress={() => deleteScene(item.idScenes)}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <X size={20} color={'#313131'} />
                    </TouchableOpacity>
                </View>

                {
                    isActive &&
                    <CustomText
                        style={styles.subtitleScene}
                    >
                        {item.sceneNote}
                    </CustomText>
                }

                <View style={styles.dropContainer}>
                    <StatusSceneDrop id={item.idScenes} status={item.sceneStatus} setStatus={setStatus} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default ListComponent

const styles = StyleSheet.create({
    compList: {
        width: '100%',
        height: 'auto',
        flexDirection: 'row',
        backgroundColor: '#DAD0B7',
        borderRadius: 15,
        paddingVertical: 12,
        paddingHorizontal: 12,
        gap: 12,
        marginBottom: 12,
        borderLeftWidth: 10,
    },
    leftColumn: {
        width: 60,
        alignItems: 'center',
    },
    rightColumn: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    headerRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    sceneNum: {
        width: 58,
        height: 50,
        fontSize: 22,
        fontWeight: '800',
        backgroundColor: '#313131',
        borderRadius: 12,
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: 50,
    },
    scenePlan: {
        width: '100%',
        color: '#313131',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 4,
    },
    titleScene: {
        flex: 1,
        color: '#313131',
        fontSize: 15,
        fontWeight: '700',
        marginRight: 8,
    },
    subtitleScene: {
        width: '100%',
        color: '#555555',
        fontSize: 12,
        fontWeight: '400',
        marginBottom: 8,
    },
    dropContainer: {
        width: '100%',
        marginTop: 4,
    }
})