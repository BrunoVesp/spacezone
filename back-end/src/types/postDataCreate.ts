import z from "zod";
import { postCreateSchema } from "../schemas/postSchema";

export type PostDataCreateType = z.infer<typeof postCreateSchema>