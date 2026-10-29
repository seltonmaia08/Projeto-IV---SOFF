import {
    StyleSheet,
    View,
    TouchableOpacity,
} from "react-native";
import CustomText from '../../Components/Text/CustomText'
import { useState } from "react";
import ViewNotificacao from "../../Components/Notificacao/ViewNotification";
import ChamadoRecebido from "../../Components/ChamadoRecebido/ChamadoRecebido";
const Notificacao = () => {

    const [isActiveNotification, setIsActiveNotification] = useState(true)
    const [isActiveCalled, setIsActiveCalled] = useState(false)

    return (

        <View style={styles.container}>
            <View style={styles.tabButtons}>
                <TouchableOpacity style={[
                    styles.btnTabs,
                    isActiveNotification && styles.active
                ]}
                    onPress={() => {
                        setIsActiveCalled(false)
                        setIsActiveNotification(true)
                    }}
                >
                    <CustomText style={isActiveNotification && {color: '#DA9304'}}>Lembretes</CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.btnTabs,
                        isActiveCalled && styles.active
                    ]}
                    onPress={() => {
                        setIsActiveCalled(true)
                        setIsActiveNotification(false)
                    }}
                >
                    <CustomText style={isActiveCalled && {color: '#DA9304'}}>Chamados</CustomText>
                </TouchableOpacity>
            </View>

            <View style={{flex: 1, padding: 20}}>
                    {
                        isActiveNotification
                        &&
                        <ViewNotificacao />
                    }
                    {
                        isActiveCalled
                        &&
                        <CustomText>Implementação futura... Não precisa ficar ansioso...</CustomText>
                    }
            </View>

        </View>
    )
}

export default Notificacao

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    tabButtons: {
        width: '100%',
        height: 50,
        flexDirection: 'row'
    },
    btnTabs: {
        height: '100%',
        width: '50%',
        backgroundColor: '#313131',
        alignItems: 'center',
        justifyContent: 'center'
    },
    active: {
        backgroundColor: '#242424',
    }

})