"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = deleteFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function deleteFile(fileName) {
    // Remove o prefixo "/uploads/" se existir
    const cleanName = fileName.replace(/^\/?uploads\//, "");
    // Caminho completo até a pasta de uploads
    const filePath = path_1.default.join(__dirname, "../../uploads", cleanName);
    fs_1.default.unlink(filePath, (err) => {
        if (err) {
            console.error("Erro ao deletar arquivo:", err);
        }
        else {
            console.log("Arquivo deletado:", filePath);
        }
    });
}
