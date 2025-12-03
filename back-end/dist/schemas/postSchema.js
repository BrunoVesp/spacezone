"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUpdateSchema = exports.postCreateSchema = exports.tagSchema = exports.allowedTags = void 0;
const zod_1 = __importDefault(require("zod"));
exports.allowedTags = [
    "politica",
    "esportes",
    "entretenimento",
    "tecnologia",
    "economia",
    "mundo",
    "saude",
    "cultura",
    "ciencia",
    "opiniao",
    "entrevistas",
    "reportagens",
    "videos",
    "fotos",
    "podcasts",
    "eventos",
    "lifestyle",
    "viagens"
];
const normalizeInput = (val) => {
    // Caso seja array real
    if (Array.isArray(val)) {
        return val.map(v => String(v).trim());
    }
    // Caso seja form-data string
    if (typeof val === "string") {
        const cleaned = val
            .replace(/^\[/, "") // Remove [
            .replace(/\]$/, "") // Remove ]
            .split(",") // Divide por vírgula
            .map(t => t.replace(/"/g, "").trim()); // Remove aspas
        return cleaned;
    }
    return [];
};
exports.tagSchema = zod_1.default
    .any()
    .transform(normalizeInput)
    .transform(arr => [...new Set(arr.map(t => t.toLowerCase()))] // uppercase + remover duplicadas
)
    .refine(arr => arr.every(t => exports.allowedTags.includes(t)), {
    message: "Uma ou mais tags são inválidas.",
});
exports.postCreateSchema = zod_1.default.object({
    title: zod_1.default
        .string()
        .min(1, "O título é obrigatório")
        .max(500, "O título deve ter no máximo 500 caracteres"),
    subtitle: zod_1.default
        .string()
        .min(1, "O subtítulo é obrigatório")
        .max(500, "O subtítulo deve ter no máximo 500 caracteres"),
    body: zod_1.default
        .string()
        .min(1, "O corpo do post é obrigatório"),
    tags: exports.tagSchema,
    image: zod_1.default
        .string()
        .nullable()
        .optional()
});
exports.postUpdateSchema = zod_1.default.object({
    title: zod_1.default
        .string()
        .min(1, "O título é obrigatório")
        .max(500, "O título deve ter no máximo 500 caracteres")
        .optional(),
    subtitle: zod_1.default
        .string()
        .min(1, "O subtítulo é obrigatório")
        .max(500, "O subtítulo deve ter no máximo 500 caracteres")
        .optional(),
    body: zod_1.default
        .string()
        .min(1, "O corpo do post é obrigatório")
        .optional(),
    tags: exports.tagSchema.optional(),
    image: zod_1.default
        .string()
        .optional()
});
