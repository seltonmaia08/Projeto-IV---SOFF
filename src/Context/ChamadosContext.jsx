import { createContext, useContext, useState } from "react";

const ChamadosContext = createContext({});

export const ChamadosProvider = ({ children }) => {
  const [chamados, setChamados] = useState([]);

  const adicionarChamado = (remetente, mensagem) => {
    const novo = {
      id: String(Date.now()),
      remetente,
      mensagem,
      lido: false,
    };
    setChamados((atual) => [novo, ...atual]);
  };

  const marcarComoLido = (id) => {
    setChamados((atual) =>
      atual.map((chamado) =>
        chamado.id === id ? { ...chamado, lido: true } : chamado,
      ),
    );
  };

  const marcarTodosComoLidos = () => {
    setChamados((atual) =>
      atual.map((chamado) => ({ ...chamado, lido: true })),
    );
  };

  return (
    <ChamadosContext.Provider
      value={{
        chamados,
        adicionarChamado,
        marcarComoLido,
        marcarTodosComoLidos,
      }}
    >
      {children}
    </ChamadosContext.Provider>
  );
};

export const useChamados = () => useContext(ChamadosContext);
