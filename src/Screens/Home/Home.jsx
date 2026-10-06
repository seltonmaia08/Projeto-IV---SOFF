import { View, StyleSheet } from 'react-native'

import CustomText from '../../Components/Text/CustomText'
import Container from '../../Components/Container/Container'
import ScenesList from '../../Components/Scenes List/ScenesList';
import Anotacoes from '../../Components/Anotacoes/Anotacoes';


const Home = ({ route }) => {

    const { idProject } = route?.params || {}
    console.log(idProject)
    return (
        <Container>
            <View style={styles.escopo}>
                <Anotacoes/>
                <ScenesList />
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    escopo: {alignItems: "center", gap: 20}
});

export default Home;