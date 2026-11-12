import { View, StyleSheet, TouchableOpacity} from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

import CustomText from '../../Components/Text/CustomText';


function Top({abaName, voltar, voltarOn}) {

    return(
        <View>
            <View style={styles.topAba}>
                {
                    voltar?
                    <TouchableOpacity activeOpacity={0.5} onPress={voltarOn}>
                        <ChevronLeft style={styles.setinha}/>
                    </TouchableOpacity>
                    : 
                    ""
                }
                <CustomText style={styles.tituloAba}>{abaName}</CustomText>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    topAba: {
        backgroundColor: "#313131",
        height: 120, 
        paddingHorizontal: 20,
        paddingTop: 60,
        flexDirection: "row",
        gap: 10,
        justifyContent: 'flex-start',
        alignItems: "center"
    },
    tituloAba: {fontSize: 18, fontWeight: "bold", color: "#DAD0B7"},
    setinha: {color: "#DAD0B7"}
});

export default Top;