import { z } from "zod";

export const registerSchema = z
    .object({
        nickname: z
            .string()
            .min(1, "O campo é obrigatório")
            .max(20, "O nickname deve ter no máximo 20 caracteres."),

        email: z
            .string()
            .min(1, "O e-mail é obrigatório")
            .email("Formato de e-mail inválido"),

        password: z
            .string()
            .min(6, "A senha deve ter no mínimo 6 caracteres"),

        confirmPassword: z.string().min(1, "Confirme sua senha")
    })
    .refine(
        (data) => data.password === data.confirmPassword,
        {
            message: "As senhas não coincidem",
            path: ["confirmPassword"],
        }
    );

export type RegisterSchema = z.infer<typeof registerSchema>;