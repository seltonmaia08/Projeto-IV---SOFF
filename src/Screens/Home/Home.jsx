import CustomText from '../../Components/Text/CustomText'
import Container from '../../Components/Container/Container'
import ScenesList from '../../Components/Scenes List/ScenesList';
import { useProjectContext } from '../../Context/ProjectContext';


const Home = () => {

    const { idProject, projectName } = useProjectContext()
    console.log(idProject)
    return (
        <Container>
            <ScenesList />
        </Container>
    )
}

export default Home;