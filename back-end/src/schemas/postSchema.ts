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

    tags: z
    .array(
            z.enum([
                "POLITICA",
                "ESPORTES",
                "ENTRETENIMENTO",
                "TECNOLOGIA",
                "ECONOMIA",
                "MUNDO",
                "SAUDE",
                "CULTURA",
                "CIENCIA",
                "OPINIAO",
                "ENTREVISTAS",
                "REPORTAGENS",
                "VIDEOS",
                "FOTOS",
                "PODCASTS",
                "EVENTOS",
                "LIFESTYLE",
                "VIAGENS"
            ])
    )
    .nonempty("É obrigatório incluir pelo menos 1 tag"),

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

    tags: z
    .array(
            z.enum([
                "POLITICA",
                "ESPORTES",
                "ENTRETENIMENTO",
                "TECNOLOGIA",
                "ECONOMIA",
                "MUNDO",
                "SAUDE",
                "CULTURA",
                "CIENCIA",
                "OPINIAO",
                "ENTREVISTAS",
                "REPORTAGENS",
                "VIDEOS",
                "FOTOS",
                "PODCASTS",
                "EVENTOS",
                "LIFESTYLE",
                "VIAGENS"
            ])
        )
    .optional(),

    image: z
    .string()
    .optional()
});