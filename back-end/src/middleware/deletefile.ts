import fs from "fs";
import path from "path";

export function deleteFile(fileName: string) {
  // Remove o prefixo "/uploads/" se existir
  const cleanName = fileName.replace(/^\/?uploads\//, "");

  // Caminho completo até a pasta de uploads
  const filePath = path.join(__dirname, "../../uploads", cleanName);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Erro ao deletar arquivo:", err);
    } else {
      console.log("Arquivo deletado:", filePath);
    }
  });
}
