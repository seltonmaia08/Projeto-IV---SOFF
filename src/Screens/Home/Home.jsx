import { View, ScrollView } from 'react-native';

import Container from '../../Components/Container/Container'
import ScenesList from '../../Components/Scenes List/ScenesList';
import Anotacoes from '../../Components/Anotacoes/Anotacoes';
import { useProjectContext } from '../../Context/ProjectContext';

import StatusFilmagem from "../../Components/StatusFilmagem/StatusFilmagem";
import ChamarAlguem from "../../Components/ChamarAlguem/ChamarAlguem";

const Home = () => {

  const { idProject, projectName } = useProjectContext();

  return (
    <Container>
      {/* View envolve tudo para que o position: absolute do botão
          seja relativo à tela, não ao conteúdo rolável */}
      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ gap: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <StatusFilmagem />
          <ScenesList />
          <Anotacoes />
        </ScrollView>

        {/* Fora do ScrollView → fica fixo na tela */}
        <ChamarAlguem />
      </View>
    </Container>
  );
};

/*const styles = StyleSheet.create({
    escopo: {alignItems: "center", gap: 20},
    topSpace: {marginTop: 20}
});*/

export default Home;
