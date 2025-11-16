import z from "zod";

export const postCreateSchema = z.object({
    title: z
    .string()
    .min(1, "O título é obrigatório")
    .max(500, "O título deve ter no máximo 500 caracteres"),

    subtitle: z
    .string()
    .min(1, "O subtítulo é obrigatório")
    .max(500, "O subtítulo deve ter no máximo 500 caracteres"),

    body: z
    .string()
    .min(1, "O corpo do post é obrigatório"),

    image: z
    .string()
    .nullable()
    .optional()
});

export const postUpdateSchema = z.object({
    title: z
    .string()
    .min(1, "O título é obrigatório")
    .max(500, "O título deve ter no máximo 500 caracteres")
    .optional(),

    subtitle: z
    .string()
    .min(1, "O subtítulo é obrigatório")
    .max(500, "O subtítulo deve ter no máximo 500 caracteres")
    .optional(),

    body: z
    .string()
    .min(1, "O corpo do post é obrigatório")
    .optional(),
    image: z
    .string()
    .optional()
});