import z from "zod";

export const newCommentSchema = z.object({
    newComment: z
        .string()
        .min(1, "O comentário não pode ser vazio")
})

export type NewComment = z.infer<typeof newCommentSchema>;