import z from "zod";

export const promoteSchema = z.object({
  email: z.string().email("Email inválido"),
  nickname: z.string().min(1, "Nickname é obrigatório"),
});
