import { Alert } from "react-native";
import * as Print from "expo-print"; // converte HTML em pdf
import * as Sharing from "expo-sharing"; // abre o menu "salvar/compartilhar"
import { File, Paths } from "expo-file-system"; //biblioteca para mexer em arquivos

import { scenesListService } from "../Services/api";
const STATUS = {
  1: { nome: "Pendente", cor: "#5F5F5F" },
  2: { nome: "Em andamento", cor: "#EF5625" },
  3: { nome: "Concluído", cor: "#1B8F65" },
};

const escapar = (texto) => {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

const montarHtml = (cenas, nomeProjeto) => {
  const blocos = cenas
    .map((cena) => {
      const status = STATUS[String(cena.sceneStatus ?? "1")] || STATUS["1"];
      const plano = cena.scenePlan ? ` · ${escapar(cena.scenePlan)}` : "";
      const nota = cena.sceneNote
        ? `<div class="descricao">${escapar(cena.sceneNote)}</div>`
        : "";

      return `
            <div class="cena">
                <div class="linha-topo">
                    <span class="numero">Cena ${escapar(cena.sceneNumber)}${plano}</span>
                    <span class="status" style="color: ${status.cor};">${status.nome}</span>
                </div>
                <div class="titulo">${escapar(cena.sceneDetails)}</div>
                ${nota}
            </div>
        `;
    })
    .join("");

  const data = new Date().toLocaleDateString("pt-BR");

  const titulo = nomeProjeto
    ? `Lista de cenas · ${escapar(nomeProjeto)}`
    : "Lista de cenas";

  return `
        <html>
            <head>
                <meta charset="utf-8" />
                <style>
                    body { font-family: Helvetica, Arial, sans-serif; color: #313131; }
                    h1 { color: #EF5625; margin-bottom: 4px; }
                    .data { color: #5F5F5F; font-size: 12px; margin-bottom: 20px; }
                    .cena {
                        border-left: 6px solid #EF5625;
                        background: #F0EADE;
                        border-radius: 8px;
                        padding: 12px 16px;
                        margin-bottom: 12px;
                        page-break-inside: avoid; /* não corta uma cena no meio entre duas páginas */
                    }
                    .linha-topo { display: flex; justify-content: space-between; font-size: 12px; }
                    .numero { font-weight: bold; color: #EF5625; }
                    .status { font-weight: bold; }
                    .titulo { font-size: 18px; font-weight: bold; margin-top: 6px; }
                    .descricao { font-size: 14px; margin-top: 4px; }
                </style>
            </head>
            <body>
                <h1>${titulo}</h1>
                <div class="data">Gerado em ${data}</div>
                ${blocos}
            </body>
        </html>
    `;
};

export const gerarPdfCenas = async (idProject, nomeProjeto) => {
  try {
    const cenas = await scenesListService.getAllColumn("idProject", idProject);
    if (cenas.length === 0) {
      Alert.alert(
        "Nenhuma cena cadastrada",
        "Adicione pelo menos uma cena para gerar o PDF.",
      );
      return;
    }

    const ordenadas = [...cenas].sort(
      (a, b) => Number(a.sceneNumber) - Number(b.sceneNumber),
    );
    const html = montarHtml(ordenadas, nomeProjeto);

    const { base64 } = await Print.printToFileAsync({
      html,
      base64: true,
      width: 595,
      height: 842,
      margins: { left: 40, top: 40, right: 40, bottom: 40 },
    });

    const pdf = new File(Paths.cache, "lista-de-cenas.pdf");

    pdf.create({ overwrite: true });

    pdf.write(base64, { encoding: "base64" });

    console.log("pdf:", pdf.uri, "existe?", pdf.exists, "tamanho:", pdf.size);

    const podeCompartilhar = await Sharing.isAvailableAsync();
    if (!podeCompartilhar) {
      Alert.alert(
        "Atenção",
        "Este aparelho não permite compartilhar arquivos.",
      );
      return;
    }

    await Sharing.shareAsync(pdf.uri, {
      mimeType: "application/pdf",
      UTI: ".pdf",
      dialogTitle: "Compartilhar lista de cenas",
    });
  } catch (erro) {
    console.log("Erro ao gerar PDF:", erro);
    Alert.alert("Erro", String(erro?.message ?? erro));
  }
};
