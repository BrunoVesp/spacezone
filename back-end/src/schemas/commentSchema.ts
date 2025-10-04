import z from "zod";

export const commentSchema = z.object({
    content: z
        .string()
        .min(1, "O campo é obrigatório")
        .max(255, "Deve ter no máximo 255 caracteres")
})