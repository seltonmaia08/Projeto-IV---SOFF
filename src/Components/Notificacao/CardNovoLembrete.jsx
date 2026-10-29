import { View, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native'
import CustomText from '../Text/CustomText'
import ButtonSave from '../Buttons/ButtonSave'
import ButtonCancel from '../Buttons/ButtonCancel'
import { continuityService, reminderService } from '../../Services/api'
import { useState, useEffect } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker'
import { StorageService } from '../../Utils/StorageService'
import { setNotificationReminder } from '../../Utils/Notifications'

const CardNovoLembrete = ({
    closeCard,
    refetch,
    idProject,
    idReminder,
    reminderTitle = '',
    reminderText = '',
}) => {

    const [title, setTitle] = useState(reminderTitle)
    const [note, setNote] = useState(reminderText)
    const [loading, setLoading] = useState(false)
    const [date, setDate] = useState(new Date())
    const [time, setTime] = useState(new Date())
    const [showDate, setShowDate] = useState(false)
    const [showTime, setShowTime] = useState(false)

    const isEditing = Boolean(idReminder);

    const createNotification = async () => {
        try {
            setLoading(true)

            await reminderService.create({
                reminderTitle: title,
                reminderText: note,
                idProject: idProject,
                reminderDate: `${date.getFullYear()}-${Number(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`,
                reminderTime: `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`
            });

            // setNotificationReminder(title, formatDateTimeNotification())

            refetch()
            closeCard()
        } catch (error) {
            console.log("Erro ao salvar no banco de dados: ", error)
        } finally {
            setLoading(false)
        }
    }



    const formatDate = () => {
        const dd = date.getDate().toString().padStart(2, '0')
        const mm = Number(date.getMonth().toString().padStart(2, '0')) + 1
        const yy = date.getFullYear()
        return `${dd}/${mm}/${yy}`
    }

    const formatTime = () => {
        const h = time.getHours().toString().padStart(2, '0')
        const m = time.getMinutes().toString().padStart(2, '0')
        const ampm = h <= 12 ? 'AM' : 'PM'
        return `${h}:${m} ${ampm}`
    }

    const formatDateTimeNotification = () => {
        const dataFinal = new Date(date);
        if (time) {
            dataFinal.setHours(time.getHours());
            dataFinal.setMinutes(time.getMinutes());
            dataFinal.setSeconds(0);
            dataFinal.setMilliseconds(0);
        }

        return dataFinal;
    };

    return (
        <View style={styles.container}>
            <CustomText>Título</CustomText>
            <TextInput
                keyboardType='default'
                style={styles.inputNormal}
                placeholderTextColor={'#5F5F5F'}
                value={title}
                onChangeText={setTitle}
                placeholder='Take 3 Corrida de costas'
            />
            <CustomText>Aviso</CustomText>
            <TextInput
                keyboardType='default'
                style={styles.inputTextArea}
                placeholderTextColor={'#5F5F5F'}
                multiline={true}
                value={note}
                onChangeText={setNote}
                placeholder='Anotações sobre como o cenário se encontra para a próxima cena'
            />
            <View style={styles.containerDataHora}>
                <TouchableOpacity style={styles.btnPicker} onPress={() => setShowDate(true)}>
                    <CustomText style={styles.TextDateTime}>Data: <CustomText style={{ color: '#DA9304', letterSpacing: 2 }}>{formatDate()}</CustomText></CustomText>
                </TouchableOpacity>
                {
                    showDate && <DateTimePicker
                        testID='dateTimePicker'
                        value={date}
                        mode='date'
                        display='default'
                        onTouchCancelCapture={() => setShowDate(false)}
                        onValueChange={(event, selectedDate) => {
                            setShowDate(false);
                            if (selectedDate) {
                                setDate(selectedDate);
                            }
                        }}
                        onDismiss={() => {
                            setShowDate(false);
                        }}
                    />
                }
                <TouchableOpacity style={styles.btnPicker} onPress={() => setShowTime(true)}>
                    <CustomText style={styles.TextDateTime}>Horário: <CustomText style={{ color: '#DA9304', letterSpacing: 2 }}>{formatTime()}</CustomText></CustomText>
                    {
                        showTime && <DateTimePicker
                            testID='dateTimePicker'
                            value={time}
                            mode='time'
                            display='default'
                            onTouchCancelCapture={() => setShowTime(false)}
                            onValueChange={(event, selectedDate) => {
                                setShowTime(false);
                                if (selectedDate) {
                                    setTime(selectedDate);
                                }
                            }}
                            onDismiss={() => {
                                setShowTime(false);
                            }}
                        />
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.btns}>
                <ButtonCancel onPress={closeCard} />
                <ButtonSave onPress={createNotification} loading={loading} />
            </View>
        </View>
    )
}

export default CardNovoLembrete

const styles = StyleSheet.create({
    container: {
        height: '60%',
        width: "90%",
        backgroundColor: "#313131",
        padding: 20,
        borderRadius: 15,
        gap: 10,
        zIndex: 10
    },
    inputNormal: {
        width: '100%',
        height: 54,
        padding: 10,
        backgroundColor: '#DAD0B7',
        borderRadius: 15
    },
    inputTextArea: {
        width: '100%',
        height: '50%',
        padding: 10,
        textAlignVertical: 'top',
        backgroundColor: '#DAD0B7',
        borderRadius: 15
    },
    buttonCam: {
        width: '100%',
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#DAD0B7',
        borderWidth: 2,
        borderRadius: 15
    },
    btns: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    containerDataHora: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    TextDateTime: {
        fontSize: 16,
        fontWeight: '700',
    },
    btnPicker: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#5f5f5f60',
        borderRadius: 15,
        borderColor: '#5F5F5F90',
        borderWidth: 2
    }


})