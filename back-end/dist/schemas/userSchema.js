"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUserSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.createUserSchema = zod_1.default.object({
    nickname: zod_1.default
        .string()
        .min(3, "O nickname deve ter pelo menos 3 caracteres")
        .max(20, "O nickname deve ter no máximo 20 caracteres")
        .regex(/^[a-zA-Z0-9._]+$/, "O nickname só pode conter letras, números, pontos e underlines")
        .regex(/^(?!.*\.\.)/, "O nickname não pode ter dois pontos seguidos")
        .regex(/^(?!.*__)/, "O nickname não pode ter dois underlines seguidos")
        .regex(/^[a-zA-Z0-9]/, "O nickname deve começar com uma letra ou número")
        .regex(/[a-zA-Z0-9]$/, "O nickname deve terminar com uma letra ou número"),
    email: zod_1.default
        .string()
        .min(1, "O campo é obrigatório")
        .email("Email inválido"),
    password: zod_1.default
        .string()
        .min(6, "A senha deve ter no mínimo 6 caracteres"),
    profileImage: zod_1.default
        .string()
        .optional()
});
exports.updateUserSchema = zod_1.default.object({
    nickname: zod_1.default
        .string()
        .min(3, "O nickname deve ter pelo menos 3 caracteres")
        .max(20, "O nickname deve ter no máximo 20 caracteres")
        .regex(/^[a-zA-Z0-9._]+$/, "O nickname só pode conter letras, números, pontos e underlines")
        .regex(/^(?!.*\.\.)/, "O nickname não pode ter dois pontos seguidos")
        .regex(/^(?!.*__)/, "O nickname não pode ter dois underlines seguidos")
        .regex(/^[a-zA-Z0-9]/, "O nickname deve começar com uma letra ou número")
        .regex(/[a-zA-Z0-9]$/, "O nickname deve terminar com uma letra ou número")
        .optional(),
    email: zod_1.default
        .string()
        .min(1, "O campo é obrigatório")
        .email("Email inválido")
        .optional(),
    password: zod_1.default
        .string()
        .min(6, "A senha deve ter no mínimo 6 caracteres")
        .optional(),
    profileImage: zod_1.default
        .string()
        .optional()
});
exports.loginUserSchema = zod_1.default.object({
    email: zod_1.default.
        string()
        .min(1, "O campo é obrigatório")
        .email("Email inválido"),
    password: zod_1.default
        .string()
        .min(6, "A senha deve ter no mínimo 6 caracteres")
});
