import { ArrowBigDownDash } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'

import { scenesListService } from '../../Services/api'

const data = [
    { label: 'Pendente', value: '1' },
    { label: 'Em andamento', value: '2' },
    { label: 'Concluído', value: '3' },
];

const StatusSceneDrop = ({ id, status, setStatus }) => {
    const [value, setValue] = useState(status ?? data[0].value)
    const [isFocus, setIsFocus] = useState(false)
    
    const updateStatus = async (newValue) => {
        try {
            await scenesListService.update(id, { sceneStatus: newValue }, 'idScenes')
            if (setStatus) setStatus(newValue)
        } catch (error) {
            console.error('Erro ao atualizar status:', error)
        }
    }

    return (
        <View style={styles.container}>
            <Dropdown
                style={[
                    styles.dropdown,
                    isFocus && { borderColor: '#28D593' },
                    value === '2' && styles.statusEmAndamento,
                    value === '3' && styles.statusConcluido
                ]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={[styles.selectedTextStyle, value === '2' && { color: '#313131' }, value === '3' && { color: '#313131' }]}
                data={data}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Escolha o item' : '...'}
                value={value}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                containerStyle={{ backgroundColor: '#313131', borderRadius: 15, borderWidth: 0, overflow: 'hidden' }}
                itemTextStyle={{ color: '#F0EADE' }}
                activeColor="#555555"
                iconColor={value === '2' || value === '3' ? '#313131' : '#F0EADE'}
                onChange={item => {
                    setValue(item.value);
                    setIsFocus(false);
                    updateStatus(item.value)
                }}
            />
        </View>
    )
}

export default StatusSceneDrop

const styles = StyleSheet.create({
    container: {
        width: 200,
        marginTop: 4,
    },
    dropdown: {
        height: 30,
        width: '100%',
        borderRadius: 15,
        paddingHorizontal: 8,
        backgroundColor: '#313131',
    },
    label: {
        fontSize: 14,
        marginBottom: 8,
        color: '#F0EADE',
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#F0EADE',
    },
    selectedTextStyle: {
        fontSize: 16,
        color: '#F0EADE',
        fontWeight: '500'
    },

    statusEmAndamento: {
        backgroundColor: '#EF5625'
    },
    statusConcluido: {
        backgroundColor: '#28D593',
    }
});