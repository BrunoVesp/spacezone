import z from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email("Formato de e-mail inválido")
        .min(1, "O e-mail é obrigatório"),
    password: z
        .string()
        .min(6, "A senha deve ter no mínino 6 caracteres")
});

export type LoginSchema = z.infer<typeof loginSchema>;