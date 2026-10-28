import { View, StyleSheet, TouchableOpacity } from 'react-native'

import CustomText from '../Text/CustomText'
import { X } from 'lucide-react-native'

const RenderItemContinuity = ({ item, deleteContinuity, onPress }) => {
    
    return (
        <TouchableOpacity
            onPress={onPress} 
            style={styles.cardContinuity}>
            <View style={{flex: 1}}>
                <CustomText style={styles.title} numberOfLines={2}>
                    {item.continuityTitle}
                </CustomText>
                <CustomText style={styles.subtitle} numberOfLines={2} ellipsizeMode={'tail'}>
                    {item.continuityText}
                </CustomText>
            </View>
            <TouchableOpacity
                onPress={() => deleteContinuity(item.idContinuity)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <X size={20} color={'#313131'} />
            </TouchableOpacity>
        </TouchableOpacity >
    )
}

export default RenderItemContinuity

const styles = StyleSheet.create({
    cardContinuity: {
        width: '100%',
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#DAD0B7',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 12,
        gap: 12,
        marginBottom: 12,
    },
    title: {
        flex: 1,
        color: '#313131',
        fontSize: 18,
        fontWeight: '700',
        marginRight: 8,
    },
    subtitle: {
        width: '100%',
        color: '#555555',
        fontSize: 12,
        fontWeight: '400',
        marginBottom: 8,
    },
})