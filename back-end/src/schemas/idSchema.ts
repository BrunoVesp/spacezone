import z from "zod";

export const idSchema = z.object({
    id: z
        .string()
        .regex(/^\d+$/, "O ID deve ser um número inteiro positivo")
        .transform((val) => Number(val))
        .refine((val) => val > 0, "O ID deve ser maior que 0"),
})