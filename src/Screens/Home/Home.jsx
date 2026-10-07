import CustomText from '../../Components/Text/CustomText'
import Container from '../../Components/Container/Container'
import ScenesList from '../../Components/Scenes List/ScenesList';
import { useProjectContext } from '../../Context/ProjectContext';

import CustomText from "../../Components/Text/CustomText";
import Container from "../../Components/Container/Container";
import ScenesList from "../../Components/Scenes List/ScenesList";
import StatusFilmagem from "../../Components/StatusFilmagem/StatusFilmagem";
import ChamarAlguem from "../../Components/ChamarAlguem/ChamarAlguem";

const Home = () => {

    const { idProject, projectName } = useProjectContext()
    console.log(idProject)
    return (
        <Container>
            <ScenesList />
        </Container>
    )
}
const Home = ({ route }) => {
  const { idProject } = route?.params || {};
  console.log(idProject);
  return (
    <>
      <Container>
        <StatusFilmagem />
        <ScenesList />
      </Container>
      <ChamarAlguem />
    </>
  );
};

export default Home;
