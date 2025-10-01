import z from "zod";
import { createUserSchema, updateUserSchema } from "../schemas/userSchema";

export type UserDataCreateType = z.infer<typeof createUserSchema>

export type UserDataUpdateType = z.infer<typeof updateUserSchema>