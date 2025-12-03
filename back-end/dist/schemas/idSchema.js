"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.idSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.idSchema = zod_1.default.object({
    id: zod_1.default
        .string()
        .regex(/^\d+$/, "O ID deve ser um número inteiro positivo")
        .transform((val) => Number(val))
        .refine((val) => val > 0, "O ID deve ser maior que 0"),
});
