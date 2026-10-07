import { View, StyleSheet } from 'react-native'

import Container from '../../Components/Container/Container'
import ScenesList from '../../Components/Scenes List/ScenesList';
import Anotacoes from '../../Components/Anotacoes/Anotacoes';
import { useProjectContext } from '../../Context/ProjectContext';
import CustomText from "../../Components/Text/CustomText";
import StatusFilmagem from "../../Components/StatusFilmagem/StatusFilmagem";
import ChamarAlguem from "../../Components/ChamarAlguem/ChamarAlguem";

const Home = ({ route }) => {
  const { idProject } = route?.params || {};
  console.log(idProject);
  return (
      <Container>
        <StatusFilmagem />
        <ScenesList />
        {/*<Anotacoes/>*/}
        <ChamarAlguem />
      </Container>
  );
};

/*const styles = StyleSheet.create({
    escopo: {alignItems: "center", gap: 20},
    topSpace: {marginTop: 20}
});*/

export default Home;
