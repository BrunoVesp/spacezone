import type { Comentary } from "./Comentary";

export type Posts = {
    id: number;
    image?: string;
    title: string;
    subtitle: string;
    body: string;
    tags?: string[];
    createdAt: string;
    updateAt?: string;
    comentarys: Comentary[];
    author?: {
        nickname: string;
    } | null
}