import { useEffect, useState } from "react";

export const useIsAuthenticated = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("authToken")
    );

    useEffect(() => {
        const update = () => {
            setIsAuthenticated(!!localStorage.getItem("authToken"));
        };

        window.addEventListener("storage", update);
        return () => window.removeEventListener("storage", update);
    }, []);

    return { isAuthenticated };
};