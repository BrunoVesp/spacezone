export type Comentary = {
    id: number;
    content: string;
    createdAt: string;
    isUpdated: boolean;
    userImage: string;
    user: {
        nickname: string;
    }
}