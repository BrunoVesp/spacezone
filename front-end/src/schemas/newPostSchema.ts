import z from "zod";

export const newPostSchema = z.object({
    title: z
        .string()
        .min(1, "O Título é obrigatório"),
    subtitle: z
        .string()
        .min(1, "O Subtítulo é obrigatório"),
    body: z
        .string()
        .min(1, "O Corpo é obrigatório"),
    image: z.any().optional(),
})

export type NewPostSchema = z.infer<typeof newPostSchema>