import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import CustomText from '../Text/CustomText'
import { Camera } from 'lucide-react-native'
import ButtonAdd from '../Buttons/ButtonAdd'
import ButtonSave from '../Buttons/ButtonSave'
import ButtonCancel from '../Buttons/ButtonCancel'
import { continuityService } from '../../Services/api'
import { useState } from 'react'
import { useProjectContext } from '../../Context/ProjectContext'
import CameraPicker from '../Camera/CameraPicker'
import { StorageService } from '../../Utils/StorageService'

const CardAddNote = ({
    closeNote,
    refetch,
    idProject,
    idContinuity,
    titleContinuity = '',
    textContinuity = '',
    continuityImages = []
}) => {

    const [title, setTitle] = useState(titleContinuity)
    const [note, setNote] = useState(textContinuity)
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState(Array.isArray(continuityImages) ? continuityImages : [])

     const isEditing = Boolean(idContinuity);


    const createNote = async () => {
        setLoading(true)
         try {

            let imageUrls = []
            if (images.length > 0){
                imageUrls = await StorageService.uploadImages(
                    images,
                    'continuity-images',
                    idProject
                )
            }

            if (isEditing) {
                // Atualizar nota existente
                await continuityService.update(idContinuity, {
                    continuityTitle: title,
                    continuityText: note,
                    continuityImages: imageUrls
                }, 'idContinuity');
            } else {
                // Criar nova nota
                await continuityService.create({
                    continuityTitle: title,
                    continuityText: note,
                    idProject: idProject,
                    continuityImages: imageUrls
                });
            }
            refetch();
            closeNote();
        } catch (error) {
            console.log("Erro ao salvar:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <CustomText>Cena</CustomText>
            <TextInput
                keyboardType='default'
                style={styles.inputNormal}
                placeholderTextColor={'#5F5F5F'}
                value={title}
                onChangeText={setTitle}
                placeholder='Take 3 Corrida de costas'
            />
            <CustomText>Nota</CustomText>
            <TextInput
                keyboardType='default'
                style={styles.inputTextArea}
                placeholderTextColor={'#5F5F5F'}
                multiline={true}
                value={note}
                onChangeText={setNote}
                placeholder='Anotações sobre como o cenário se encontra para a próxima cena'
            />
            <View style={styles.ViewPhotos}>
                <CameraPicker images={images} setImages={setImages}/>
            </View>
            <View style={styles.btns}>
                <ButtonCancel onPress={closeNote} />
                <ButtonSave onPress={createNote} loading={loading} />
            </View>
        </View>
    )
}

export default CardAddNote

const styles = StyleSheet.create({
    container: {
        height: '80%',
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
    }


})