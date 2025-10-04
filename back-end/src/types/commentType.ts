import z from "zod";
import { commentSchema } from "../schemas/commentSchema";

export type commentType = z.infer<typeof commentSchema>;