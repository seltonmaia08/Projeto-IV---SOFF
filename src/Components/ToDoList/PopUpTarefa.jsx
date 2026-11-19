import { Modal, StyleSheet, TextInput, View } from 'react-native'
import CustomText from '../Text/CustomText'
import ButtonCancel from '../Buttons/ButtonCancel'
import ButtonSave from '../Buttons/ButtonSave'
import { BlurView } from 'expo-blur'
import { useState } from 'react'

import { toDoListService } from '../../Services/api'
import AlertaGeral from '../Alerta/AlertaGeral'

const PopUpTarefa = ({ setIsActive, refetch, idProject, idDepartment }) => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)

    const createToDo = async () => {
        try {
            setLoading(true)
            const newToDo = await toDoListService.create({
                taskTitle: title,
                taskText: text,
                idProject: idProject,
                idDepartment: idDepartment
            })
            refetch()

        } catch (error) {
            console.error('Erro ao criar tarefa:', error)
            AlertaGeral.alert('Erro', 'Não foi possível criar a tarefa. Tente novamente.')
        } finally {
            setTimeout(() => {
                    setIsActive(false)
                }, 500)
        }


        setIsActive(false)
    }


    return (

        <Modal
            transparent={true}
            animationType='fade'
            onRequestClose={() => setIsActive(false)}
        >
            <BlurView style={styles.overlay} intensity={40} tint='dark'>
                <View style={styles.container}>
                    <View>
                        <CustomText style={styles.label}>Título</CustomText>
                        <TextInput
                            style={styles.input_two}
                            placeholder='Ex.: Título da tarefa'
                            placeholderTextColor={'#5F5F5F'}
                            keyboardType='default'
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>
                    <View>
                        <CustomText style={styles.label}>Descrição</CustomText>
                        <TextInput
                            style={styles.input_three}
                            placeholder='Escreva uma descrição para essa cena. Maxímo 50 caracteres'
                            placeholderTextColor={'#5F5F5F'}
                            keyboardType='default'
                            value={text}
                            onChangeText={setText}
                            multiline={true}
                            maxLength={200}
                        />
                    </View>
                    <View style={styles.buttons}>
                        <ButtonCancel onPress={() => setIsActive(false)} />
                        <ButtonSave onPress={createToDo} loading={loading}/>
                    </View>
                </View>
            </BlurView>
        </Modal >
    )
}

export default PopUpTarefa

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)", // preto com 60% de opacidade,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: '90%',
        height: 'auto',
        minHeight: 58,
        borderRadius: 15,
        backgroundColor: '#313131',
        paddingVertical: 20,
        paddingHorizontal: 20,
        gap: 10,
    },
    line: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 10
    },
    containerInput: {
        width: '48.3%',
    },
    input_one: {
        height: 54,
        padding: 10,
        backgroundColor: '#DAD0B7',
        borderRadius: 15

    },
    input_two: {
        width: '100%',
        height: 54,
        padding: 10,
        backgroundColor: '#DAD0B7',
        borderRadius: 15

    },
    input_three: {
        width: '100%',
        height: 100,
        padding: 10,
        backgroundColor: '#DAD0B7',
        borderRadius: 15

    },
    caption: {
        fontSize: 12,
        fontWeight: 'light',
        textAlign: 'center',
        marginTop: 5
    },
    buttons: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 10
    }

})