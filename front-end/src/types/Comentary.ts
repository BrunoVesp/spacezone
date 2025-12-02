export type ComentaryType = {
    id: number;
    content: string;
    createdAt: string;
    isUpdated: boolean;
    user: {
        id: number;
        nickname: string;
        profileImage: string;
    }
}