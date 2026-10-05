import { Modal, StyleSheet, TextInput, View } from 'react-native'
import CustomText from '../Text/CustomText'
import ButtonCancel from '../Buttons/ButtonCancel'
import ButtonSave from '../Buttons/ButtonSave'
import { BlurView } from 'expo-blur'

const CreateItemList = ({ setIsActive }) => {
    return (
        <Modal
            transparent={true}
            animationType='fade'
            onRequestClose={() => setIsActive(false)}
        >
            <BlurView style={styles.overlay} intensity={40} tint='dark'>
                <View style={styles.container}>
                    <View style={styles.line}>
                        <TextInput
                            style={styles.input_one}
                            placeholder='Cena'
                            placeholderTextColor={'#5F5F5F'}
                        />
                        <TextInput
                            style={styles.input_one}
                            placeholder='plano'
                            placeholderTextColor={'#5F5F5F'}
                        />
                    </View>
                    <View>
                        <TextInput
                            style={styles.input_two}
                            placeholder='Ex: EXT. Fazenda - DIA'
                            placeholderTextColor={'#5F5F5F'}
                        />
                        <CustomText style={styles.caption}>Coloque EXT/INT e DIA/TARDE/NOITE no título.</CustomText>
                    </View>
                    <TextInput
                        style={styles.input_three}
                        placeholder='Faça uma anotação'
                        placeholderTextColor={'#5F5F5F'}
                    />
                    <View style={styles.buttons}>
                        <ButtonCancel onPress={() => setIsActive(false)} />
                        <ButtonSave onPress={() => console.log('Ação salva...')} />
                    </View>
                </View>
            </BlurView>
        </Modal>
    )
}

export default CreateItemList

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
        borderColor: '#EF5625',
        borderWidth: 2,
        borderRadius: 15,
        backgroundColor: '#313131',
        paddingVertical: 20,
        paddingHorizontal: 20,
        gap: 10,
    },
    line: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    input_one: {
        width: 140,
        height: 54,
        padding: 10,
        backgroundColor: '#F0EADE',
        borderRadius: 15

    },
    input_two: {
        width: '100%',
        height: 54,
        padding: 10,
        backgroundColor: '#F0EADE',
        borderRadius: 15

    },
    input_three: {
        width: '100%',
        height: 183,
        padding: 10,
        backgroundColor: '#F0EADE',
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