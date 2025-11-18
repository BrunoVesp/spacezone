import { useEffect, useState } from "react";

type AuthUser = {
    id: number;
    nickname: string;
    email: string;
    isRedator: boolean;
    profileImage?: string | null;
}

export function useAuthUser() {
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return user;
}