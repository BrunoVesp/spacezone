import { profile } from "console";
import z from "zod";

export const createUserSchema = z.object({
    nickname: z
        .string()
        .min(3, "O nickname deve ter pelo menos 3 caracteres")
        .max(20, "O nickname deve ter no máximo 20 caracteres")
        .regex(
            /^[a-zA-Z0-9._]+$/,
            "O nickname só pode conter letras, números, pontos e underlines"
        )
        .regex(/^(?!.*\.\.)/, "O nickname não pode ter dois pontos seguidos")
        .regex(/^(?!.*__)/, "O nickname não pode ter dois underlines seguidos")
        .regex(/^[a-zA-Z0-9]/, "O nickname deve começar com uma letra ou número")
        .regex(/[a-zA-Z0-9]$/, "O nickname deve terminar com uma letra ou número"),
    email: z
        .string()
        .min(1, "O campo é obrigatório")
        .email("Email inválido"),
    password: z
        .string()
        .min(6, "A senha deve ter no mínimo 6 caracteres"),
    profileImage: z
        .string()
        .optional()
});

export const updateUserSchema = z.object({
    nickname: z
        .string()
        .min(3, "O nickname deve ter pelo menos 3 caracteres")
        .max(20, "O nickname deve ter no máximo 20 caracteres")
        .regex(
            /^[a-zA-Z0-9._]+$/,
            "O nickname só pode conter letras, números, pontos e underlines"
        )
        .regex(/^(?!.*\.\.)/, "O nickname não pode ter dois pontos seguidos")
        .regex(/^(?!.*__)/, "O nickname não pode ter dois underlines seguidos")
        .regex(/^[a-zA-Z0-9]/, "O nickname deve começar com uma letra ou número")
        .regex(/[a-zA-Z0-9]$/, "O nickname deve terminar com uma letra ou número")
        .optional(),
    email: z
        .string()
        .min(1, "O campo é obrigatório")
        .email("Email inválido")
        .optional(),
    password: z
        .string()
        .min(6, "A senha deve ter no mínimo 6 caracteres")
        .optional(),
    profileImage: z
        .string()
        .optional()
});

export const loginUserSchema = z.object({
    email: z.
        string()
        .min(1, "O campo é obrigatório")
        .email("Email inválido"),
    password: z
        .string()
        .min(6, "A senha deve ter no mínimo 6 caracteres")
});