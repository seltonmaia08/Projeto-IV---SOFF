import { View, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { X } from 'lucide-react-native';

import CustomText from '../../Components/Text/CustomText';

function CargosPopUp({ visivel, aoFechar, aoSelecionar }) {

    const cargosProjeto = [
        "Diretor(a) Geral", 
        "Diretor(a) de Produção",
        "Diretor(a) de Fotografia",
        "Diretor(a) de Arte",
        "Assistente", 
        "Continuísta",
        "Produtor(a) de Locação",
        "Operador(a) de Câmera",
        "Foquista",
        "Figurinista",
        "Técnico(a) de Som",
        "Microfonista"
    ];

    function alterarEFechar(novoCargo) {
        aoSelecionar(novoCargo);
        aoFechar();
    }

    return (
        <Modal visible={visivel} animationType='fade' transparent={true} onRequestClose={aoFechar}>
            <BlurView style={styles.overlay} tint='dark' intensity={40}>
                <View style={styles.geral}>
                    <View style={styles.escopo}>
                        <View style={styles.card}>
                            <View style={styles.superior}>
                                <CustomText style={styles.titulo}>Escolha um Cargo</CustomText>
                                <TouchableOpacity style={styles.x} activeOpacity={0.5} onPress={aoFechar}>
                                    <X size={22} style={{ color: "#DAD0B7" }} />
                                </TouchableOpacity>
                            </View>

                            <ScrollView 
                                style={styles.scrollCargos} 
                                contentContainerStyle={styles.campoName}
                                showsVerticalScrollIndicator={false}
                            >
                                {
                                    cargosProjeto.map(cada => (
                                        <TouchableOpacity 
                                            key={cada}
                                            onPress={() => alterarEFechar(cada)} 
                                            style={styles.campoCargo} 
                                            activeOpacity={0.7}
                                        >
                                            <CustomText style={styles.cargos}>{cada}</CustomText>
                                        </TouchableOpacity>
                                    ))
                                }
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)", justifyContent: "center", alignItems: "center" },
    geral: { gap: 10, justifyContent: 'center', alignItems: 'center' },
    escopo: {
        width: 320,
        borderRadius: 15, 
        backgroundColor: "#313131",
        overflow: "hidden",
        padding: 16,
    },
    card: { gap: 16 },
    superior: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    titulo: { fontSize: 16, fontWeight: "bold", color: "#F0EADE" },
    scrollCargos: { maxHeight: 380},
    campoName: { gap: 8, paddingBottom: 10 },
    campoCargo: { backgroundColor: "#DAD0B7", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12 },
    cargos: { fontSize: 15, color: "#313131", fontWeight: "500" }
});

export default CargosPopUp;
