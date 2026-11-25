import { StyleSheet, TouchableOpacity, View } from 'react-native'
import CustomText from '../Text/CustomText'
import { X } from 'lucide-react-native'
import { useState, useEffect } from 'react'
import StatusTaskDrop from './StatusTaskDrop'

const CardTarefa = ({ item, deleteScene }) => {
    const rawStatus = item.taskStatus || item.status || '1'
    const [status, setStatus] = useState(rawStatus)
    const [isActive, setIsActive] = useState(false)

    useEffect(() => {
        setStatus(item.taskStatus || item.status || '1')
    }, [item.taskStatus, item.status])

    const getBorderColor = () => {
        const clean = String(status || '').replace(/'/g, '').trim()
        if (clean === '2') return '#F68E49'
        if (clean === '3') return '#1B8F65'
        return '#242424'
    }

    return (
        <TouchableOpacity style={[
            styles.compList,
            { borderColor: getBorderColor(), borderLeftColor: getBorderColor() }
        ]}
            onPress={() => setIsActive((prev) => !prev)}
        >
            <View style={styles.rightColumn}>
                <View style={styles.headerRow}>
                    <CustomText style={styles.titleScene} numberOfLines={2}>
                        {item.taskTitle}
                    </CustomText>
                    <TouchableOpacity
                        onPress={() => deleteScene(item.idTask)}
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
                        {item.taskText}
                    </CustomText>
                }

                <View style={styles.dropContainer}>
                    <StatusTaskDrop id={item.idTask} status={status} setStatus={setStatus} />
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default CardTarefa

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