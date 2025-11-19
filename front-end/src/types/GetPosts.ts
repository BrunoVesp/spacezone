import type { Posts } from "./Posts";

export type GetPosts = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    nextPage: string | null;
    prevPage: string | null;
    data: Posts[];
}