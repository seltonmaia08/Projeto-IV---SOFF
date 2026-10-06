import CustomText from "../../Components/Text/CustomText";
import Container from "../../Components/Container/Container";
import ScenesList from "../../Components/Scenes List/ScenesList";
import StatusFilmagem from "../../Components/StatusFilmagem/StatusFilmagem";

const Home = ({ route }) => {
  const { idProject } = route?.params || {};
  console.log(idProject);
  return (
    <Container>
      <StatusFilmagem />
      <ScenesList />
    </Container>
  );
};

export default Home;
