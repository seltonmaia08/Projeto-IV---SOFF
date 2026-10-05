import CustomText from '../../Components/Text/CustomText'
import Container from '../../Components/Container/Container'
import ScenesList from '../../Components/Scenes List/ScenesList';


const Home = ({ route }) => {

    const { idProject } = route?.params || {}
    console.log(idProject)
    return (
        <Container>
            <ScenesList />
        </Container>
    )
}

export default Home;