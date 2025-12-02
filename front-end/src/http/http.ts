import axios from "axios";

export const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const http = axios.create({
    baseURL: baseUrl,
});

// Adiciona o token em todas as requisições
http.interceptors.request.use(config => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptar respostas com erro
http.interceptors.response.use(
    response => response,
    error => {
        // token inválido ou expirado
        if (
            error.response?.status === 401 &&
            (error.response.data?.message === "Token inválido ou expirado" ||
                error.response.data?.message === "Token expirado")
        ) {
            // remove tudo
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");

            // redireciona para login
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);