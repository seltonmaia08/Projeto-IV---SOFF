import { StyleSheet, View, TouchableOpacity } from "react-native";
import CustomText from "../Text/CustomText";
import { Bell, BellRing } from "lucide-react-native";
import { useState } from "react";
import { reminderService } from "../../Services/api";

const monthName = [
    { num: '01', value: 'Janeiro' },
    { num: '02', value: 'Fevereiro' },
    { num: '03', value: 'Março' },
    { num: '04', value: 'Abril' },
    { num: '05', value: 'Maio' },
    { num: '06', value: 'Junho' },
    { num: '07', value: 'Julho' },
    { num: '08', value: 'Agosto' },
    { num: '09', value: 'Setembro' },
    { num: '10', value: 'Outubro' },
    { num: '11', value: 'Novembro' },
    { num: '12', value: 'Dezembro' }
]

const ListNotificacao = ({ item, refetch }) => {
    const [isActive, setIsActive] = useState(false)

    const read = async () => {

        setIsActive((prev) => !prev)

        const proximoEstado = !isActive;
        setIsActive(proximoEstado);

        
        if (!proximoEstado && !item.read) {
            try {
                await reminderService.update(item.idReminder, {
                    read: true
                }, 'idReminder');

                if (refetch) {
                    refetch();
                }
            } catch (error) {
                console.log("Erro ao atualizar o status de leitura:", error);
            }
        }
    }

    return (
        <TouchableOpacity style={[
            styles.BtnContainer,
            item.read ? { backgroundColor: '#5F5F5F' } : { backgroundColor: '#DAD0B7' },
            isActive && { backgroundColor: '#DAD0B7' }
        ]}
            onPress={() => {
                read()
                // if (!item.read) {
                //     setStatusRead()
                // }
            }}
        >
            <View style={[styles.iconContainer, item.read ? { backgroundColor: '#DAD0B7' } : { backgroundColor: '#313131' }]}>
                {
                    item.read ?
                        <Bell size={24} color={'#313131'} />
                        :
                        <BellRing size={24} color={'#EF5625'} />

                }
            </View>
            <View style={[styles.textContainer,
            isActive ? { height: 'auto', } : {}
            ]}>
                <View>
                    <CustomText style={[
                        styles.title,
                        item.read ? { color: '#DAD0B7' } : { color: '#313131' },
                        isActive && { color: '#313131' }
                    ]}>{item.reminderTitle}</CustomText>
                    <CustomText style={[
                        styles.time,
                        item.read ? { color: '#DAD0B7' } : { color: '#313131' },
                        isActive && { color: '#313131' }
                    ]}>{item.reminderDate}</CustomText>
                    {
                        isActive &&
                        <View>
                            <CustomText style={[
                                styles.title,
                                item.read ? { color: '#DAD0B7' } : { color: '#313131' },
                                isActive && { color: '#313131' }
                            ]}>{item.reminderText}</CustomText>
                        </View>
                    }
                </View>
                {
                    item.read ?
                        ''
                        :
                        <View style={{ backgroundColor: '#1B8F65', width: 12, height: 12, borderRadius: 100 }}></View>
                }
            </View>
        </TouchableOpacity >
    )
}

export default ListNotificacao

const styles = StyleSheet.create({
    BtnContainer: {
        width: '100%',
        minHeight: 65,
        height: 'auto',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 20,
        backgroundColor: '#5F5F5F',
        marginBottom: 10
    },
    textContainer: {
        width: 400,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 16,
    },
    textTag: {
        fontSize: 12
    },
    time: {
        fontSize: 12,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 15,
        backgroundColor: '#DAD0B7',
        alignItems: 'center',
        justifyContent: 'center'
    }
})