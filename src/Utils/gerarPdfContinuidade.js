import { Alert } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { File, Paths } from "expo-file-system";

import { continuityService } from "../Services/api";

const escapar = (texto) => {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};

const fotoParaBase64 = async (url) => {
  try {
    const sufixo = Math.random().toString(36).substring(2, 8);
    const destino = new File(
      Paths.cache,
      `continuidade-foto-${Date.now()}-${sufixo}.jpg`,
    );

    const arquivo = await File.downloadFileAsync(url, destino);

    const base64 = await arquivo.base64();

    return `data:image/jpeg;base64,${base64}`;
  } catch (erro) {
    console.log("Erro ao baixar foto:", url, erro);
    return null;
  }
};

const montarHtml = (notas, nomeProjeto) => {
  const blocos = notas
    .map((nota) => {
      const texto = nota.continuityText
        ? `<div class="texto">${escapar(nota.continuityText)}</div>`
        : "";

      const fotos =
        nota.fotos.length > 0
          ? `<div class="fotos">${nota.fotos
              .map((foto) => `<img src="${foto}" />`)
              .join("")}</div>`
          : "";

      return `
        <div class="nota">
          <div class="titulo">${escapar(nota.continuityTitle)}</div>
          ${texto}
          ${fotos}
        </div>
      `;
    })
    .join("");

  const data = new Date().toLocaleDateString("pt-BR");

  const titulo = nomeProjeto
    ? `Continuidade · ${escapar(nomeProjeto)}`
    : "Continuidade";

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Helvetica, Arial, sans-serif; color: #313131; }
          h1 { color: #DA9304; margin-bottom: 4px; }
          .data { color: #5F5F5F; font-size: 12px; margin-bottom: 20px; }
          .nota {
            border-left: 6px solid #DA9304;
            background: #F0EADE;
            border-radius: 8px;
            padding: 12px 16px;
            margin-bottom: 12px;
            page-break-inside: avoid; 
          }
          .titulo { font-size: 18px; font-weight: bold; }
          .texto { font-size: 14px; margin-top: 6px; white-space: pre-wrap; } 
          .fotos { margin-top: 10px; }
          .fotos img {
            width: 140px;
            height: 140px;
            object-fit: cover; 
            border-radius: 6px;
            margin: 0 8px 8px 0;
          }
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

export const gerarPdfContinuidade = async (idProject, nomeProjeto) => {
  try {
    const notas = await continuityService.getAllColumn("idProject", idProject);

    if (notas.length === 0) {
      Alert.alert(
        "Nenhuma nota de continuidade cadastrada",
        "Adicione pelo menos uma nota para gerar o PDF.",
      );
      return;
    }

    const ordenadas = [...notas].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );

    const notasComFotos = [];
    for (const nota of ordenadas) {
      const links = Array.isArray(nota.continuityImages)
        ? nota.continuityImages
        : [];

      const fotos = [];
      for (const url of links) {
        const foto = await fotoParaBase64(url);
        if (foto) fotos.push(foto);
      }

      notasComFotos.push({ ...nota, fotos });
    }

    const html = montarHtml(notasComFotos, nomeProjeto);

    const { base64 } = await Print.printToFileAsync({
      html,
      base64: true,
      width: 595,
      height: 842,
      margins: { left: 40, top: 40, right: 40, bottom: 40 },
    });

    const pdf = new File(Paths.cache, "continuidade.pdf");
    pdf.create({ overwrite: true });
    pdf.write(base64, { encoding: "base64" });

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
      dialogTitle: "Compartilhar continuidade",
    });
  } catch (erro) {
    console.log("Erro ao gerar PDF de continuidade:", erro);
    Alert.alert(
      "Erro",
      "Não foi possível gerar o PDF.\n\n" + String(erro?.message ?? erro),
    );
  }
};
