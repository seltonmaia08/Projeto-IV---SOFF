import {
    StyleSheet,
    View,
    TouchableOpacity,
    Modal,
    FlatList,
    ActivityIndicator
} from "react-native";
import { useEffect } from "react";
import { BlurView } from "expo-blur";
import CustomText from '../../Components/Text/CustomText'
import ListNotificacao from "../../Components/Notificacao/ListNotificacao";
import ButtonAdd from "../../Components/Buttons/ButtonAdd";
import { useProjectContext } from "../../Context/ProjectContext";
import { useState } from "react";
import CardNovoLembrete from "../../Components/Notificacao/CardNovoLembrete";
import { useNotification } from "../../Hook/useNotification";
const ViewNotificacao = () => {

    const [isActive, setIsActive] = useState(false)
    const [create, setCreate] = useState(false)
    const [selected, setSelected] = useState(null)

    const toggleModal = () => setIsActive((prev) => !prev);
    const { idProject } = useProjectContext();
    const { notification, loading, refetch } = useNotification(idProject)
    const semNotificacao = notification.length === 0


    const fecharModal = () => {
        setCreate(false);
        setSelected(null);
    };

    const handleDelete = (id) => {
            setContinuityToDelete(id);
            setIsModalVisible(true);
        };
    
        const confirmarDelecao = async () => {
            if (!continuityToDelete) return;
    
            try {
                await continuityService.delete(continuityToDelete, 'idContinuity');
                refetch();
            } catch (err) {
                console.log("Erro ao deletar cena:", err);
            } finally {
                setIsModalVisible(false);
                setContinuityToDelete(null);
            }
        };
    
        const cancelarDelecao = () => {
            setIsModalVisible(false);
            setContinuityToDelete(null);
        };
    
        useEffect(() => {
            refetch();
        }, [idProject]);
    

    return (    
        <View style={styles.container}>

            <ButtonAdd isActive={isActive} onPress={toggleModal} />

            {
                // loading ? (
                //     <View style={[styles.card, { justifyContent: 'center', alignItems: 'center', gap: 10 }]}>
                //         <ActivityIndicator size={"large"} color={"#EF5625"} />
                //         <CustomText>Carregando...</CustomText>
                //     </View>
                // ) :

                    semNotificacao ?
                        (<CustomText style={{ textAlign: 'center', margin: 10 }}>Sem lembretes no momento.</CustomText>)
                        :
                        (
                            <FlatList
                                style={{ width: '100%', minHeight: 40, borderRadius: 15 }}
                                data={notification}
                                renderItem={({ item }) => <ListNotificacao
                                    item={item}
                                    refetch={refetch}
                                    onPress={() => setSelected(item)}
                                    deleteNotification={() => handleDelete(item.IdReminder)} />}
                                keyExtractor={(item) => item.idReminder}
                                scrollEnabled={true}
                            />
                        )
            }

            {
                isActive ?
                    (<View style={styles.menuUp}>
                        <TouchableOpacity
                            onPress={() => {
                                setIsActive(false)
                                setCreate(true)
                            }}
                            style={styles.buttonAddNota}>
                            <CustomText style={{ color: '#242424' }}>Novo Lembrete</CustomText>
                        </TouchableOpacity>
                    </View>)
                    :
                    (<></>)
            }

            {
                create || selected !== null ?
                    (
                        <Modal
                            visible={create || selected !== null}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={fecharModal}
                        >
                            <BlurView style={styles.overlay} intensity={40} tint="dark">
                                <CardNovoLembrete
                                    closeCard={fecharModal}
                                    refetch={refetch}
                                    idProject={idProject}
                                    idContinuity={selected?.idContinuity}
                                    titleContinuity={selected ? selected.continuityTitle : ''}
                                    textContinuity={selected ? selected.continuityText : ''}
                                />
                            </BlurView>
                        </Modal>
                    )
                    :
                    ''
            }

        </View>
    )
}

export default ViewNotificacao

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },
    menuUp: {
        backgroundColor: "#313131",
        padding: 10,
        borderRadius: 10,
        gap: 10,
        position: 'absolute',
        bottom: 100,
        right: 50,
        borderColor: '#EF5625',
        borderWidth: 2
    },
    buttonAddNota: {
        height: 58,
        width: "100%",
        backgroundColor: "#DAD0B7",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
        padding: 10
    },
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
})