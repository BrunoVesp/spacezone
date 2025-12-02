import z from "zod";
import { allowedTags } from "../data/tags";

export const newPostSchema = z.object({
    title: z.string().min(1, "O Título é obrigatório"),
    subtitle: z.string().min(1, "O Subtítulo é obrigatório"),
    body: z.string().min(1, "O Corpo é obrigatório"),

    image: z
        .array(z.instanceof(File))
        .optional(),

    tags: z.array(z.enum(allowedTags)).optional()
});

export type NewPostSchema = z.infer<typeof newPostSchema>;
