import { TouchableOpacity, StyleSheet, Alert, View, ScrollView, Image } from "react-native";
import { Camera, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from 'expo-image-picker'
import ImageViewerModal from './ImageViewerModal'

const CameraPicker = ({ images, setImages }) => {

    const [viewerVisible, setViewerVisible] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const tirarFoto = async () => {
        const { granted } = await ImagePicker.requestCameraPermissionsAsync()
        if (!granted) {
            Alert.alert("Permissão necessária", "É necessário permitir o acesso à câmera.")
            return
        }

        const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
        })

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImages((prev) => [...prev, result.assets[0].uri])
        }
    }

    const escolherGaleria = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsMultipleSelection: true,
            quality: 0.8,
        })

        if (!result.canceled && result.assets) {
            const novosUris = result.assets.map(asset => asset.uri)
            setImages((prev) => [...prev, ...novosUris])
        }

    }

    const selecionarOrigemFoto = () => {
        Alert.alert(
            "Adicionar Foto",
            "De onde você quer obter a foto?",
            [
                { text: 'Camera', onPress: tirarFoto },
                { text: 'Galeria', onPress: escolherGaleria },
                { text: 'Cancelar', style: 'cancel' }
            ]
        )
    }

    const removerFoto = (indexRemover) => {
        setImages(prev => prev.filter((_, index) => index !== indexRemover));
    };

    const abrirVisualizador = (index) => {
        setSelectedImageIndex(index);
        setViewerVisible(true);
    };

    return (
        <View style={styles.ViewPhotos}>
            {/* Botão que abre as opções */}
            <TouchableOpacity style={styles.buttonCam} onPress={selecionarOrigemFoto}>
                <Camera size={28} color={'#DAD0B7'} />
            </TouchableOpacity>
            {/* Área de Preview com as fotos adicionadas */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.preview}>
                {Array.isArray(images) && images.map((uri, index) => (
                    <View key={index} style={styles.containerFotoMini}>
                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => abrirVisualizador(index)}
                        >
                            <Image
                                source={{ uri }}
                                style={styles.fotoMini}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.botaoRemoverFoto}
                            onPress={() => removerFoto(index)}
                        >
                            <X size={14} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <ImageViewerModal
                visible={viewerVisible}
                images={images}
                initialIndex={selectedImageIndex}
                onClose={() => setViewerVisible(false)}
            />
        </View>
    )
}



export default CameraPicker

const styles = StyleSheet.create({
    ViewPhotos: {
        width: '100%',
        height: 200,
        alignItems: 'center',
        marginTop: 20
    },
    containerFotoMini: {
        position: 'relative',
        height: 'auto',
        marginRight: 8,
        marginTop: 10
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
    fotoMini: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    botaoRemoverFoto: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#EF5625',
        borderRadius: 10,
        padding: 2,
    }
})