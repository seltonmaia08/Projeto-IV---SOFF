import Container from '../../Components/Container/Container'
import ScenesList from '../../Components/Scenes List/ScenesList';
import Anotacoes from '../../Components/Anotacoes/Anotacoes';
import { useProjectContext } from '../../Context/ProjectContext';

import StatusFilmagem from "../../Components/StatusFilmagem/StatusFilmagem";
import ChamarAlguem from "../../Components/ChamarAlguem/ChamarAlguem";

const Home = () => {

  const { idProject, projectName } = useProjectContext()

  return (
    <Container>
      <StatusFilmagem />
      <ScenesList />
      <ChamarAlguem />
      {/*<Anotacoes/>*/}
    </Container>
  )
}

export default Home;
