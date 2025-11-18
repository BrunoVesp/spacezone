import z from "zod";

export const allowedTags = [
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
] as const;

const normalizeInput = (val: any): string[] => {
  // Caso seja array real
  if (Array.isArray(val)) {
    return val.map(v => String(v).trim());
  }

  // Caso seja form-data string
  if (typeof val === "string") {
    const cleaned = val
      .replace(/^\[/, "")   // Remove [
      .replace(/\]$/, "")   // Remove ]
      .split(",")           // Divide por vírgula
      .map(t => t.replace(/"/g, "").trim()); // Remove aspas
    return cleaned;
  }

  return [];
};

export const tagSchema = z
  .any()
  .transform(normalizeInput)
  .transform(arr =>
    [...new Set(arr.map(t => t.toUpperCase()))] // uppercase + remover duplicadas
  )
  .refine(arr => arr.every(t => allowedTags.includes(t as any)), {
    message: "Uma ou mais tags são inválidas.",
  });

export type AllowedTag = typeof allowedTags[number];

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

    tags: tagSchema,

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

    tags: tagSchema.optional(),

    image: z
    .string()
    .optional()
});