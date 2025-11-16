export type Tag = "Galaxias" | "Planetas" | "Estrelas";

export type Posts = {
    id: number;
    image?: string;
    title: string;
    subtitle: string;
    body: string;
    tags: Tag[];
    createdAt: string;
    updateAt?: string;
    author?: {
        nickname: string;
    } | null
}