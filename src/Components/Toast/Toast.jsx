import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import CustomText from "../Text/CustomText";

let ouvinteGlobal = null;

const Toast = () => {
  const insets = useSafeAreaInsets();

  const [mensagem, setMensagem] = useState("");

  const opacidade = useRef(new Animated.Value(0)).current;
  const deslocamento = useRef(new Animated.Value(-20)).current;

  const temporizador = useRef(null);
  const animacaoAtual = useRef(null);
  const animar = (opacidadeFinal, deslocamentoFinal, duracao, aoTerminar) => {
    animacaoAtual.current?.stop();

    animacaoAtual.current = Animated.parallel([
      Animated.timing(opacidade, {
        toValue: opacidadeFinal,
        duration: duracao,
        useNativeDriver: true,
      }),
      Animated.timing(deslocamento, {
        toValue: deslocamentoFinal,
        duration: duracao,
        useNativeDriver: true,
      }),
    ]);

    animacaoAtual.current.start(aoTerminar);
  };

  useEffect(() => {
    ouvinteGlobal = (texto, tempoNaTela) => {
      clearTimeout(temporizador.current);

      setMensagem(texto);

      animar(1, 0, 200);

      temporizador.current = setTimeout(() => {
        animar(0, -20, 250);
      }, tempoNaTela);
    };

    return () => {
      ouvinteGlobal = null;
      clearTimeout(temporizador.current);
      animacaoAtual.current?.stop();
    };
  }, []);

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={[
        styles.container,
        {
          top: insets.top + 10,
          opacity: opacidade,
          transform: [{ translateY: deslocamento }],
        },
      ]}
    >
      <CustomText style={styles.texto} numberOfLines={2}>
        {mensagem}
      </CustomText>
    </Animated.View>
  );
};

Toast.mostrar = (mensagem, tempoNaTela = 2000) => {
  if (ouvinteGlobal) {
    ouvinteGlobal(mensagem, tempoNaTela);
  } else {
    console.log("Toast não montado. Mensagem:", mensagem);
  }
};

export default Toast;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    maxWidth: "90%",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 15,
    backgroundColor: "#1B8F65",
    zIndex: 9999,
    elevation: 9999,
  },
  texto: {
    color: "#DAD0B7",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
