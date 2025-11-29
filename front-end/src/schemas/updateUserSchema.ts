import z from "zod";

export const updateUserSchema = z
    .object({
        nickname: z
            .string()
            .min(3, "O nickname deve ter no mínimo 3 caracteres")
            .max(30, "O nickname deve ter no máximo 30 caracteres")
            .optional(),
        email: z.string().email("Email inválido").optional(),
        newPassword: z
            .string()
            .min(6, "A senha deve ter no mínimo 6 caracteres")
            .max(100, "A senha deve ter no máximo 100 caracteres")
            .optional(),
        confirmPassword: z.string().optional(),
    })
    .refine(
        (data) => {
            // Se estiver tentando alterar a senha, confirmarPassword deve existir e ser igual
            if (data.newPassword) {
                return data.confirmPassword === data.newPassword;
            }
            return true;
        },
        {
            message: "As senhas não conferem",
            path: ["confirmPassword"],
        }
    );

export type UpdateUserParams = z.infer<typeof updateUserSchema>;