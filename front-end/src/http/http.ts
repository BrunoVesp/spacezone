import axios from "axios";

export const baseUrl = "http://localhost:3000";

export const http = axios.create({
    baseURL: baseUrl,
});

// Interceptor para adicionar o token automaticamente
http.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

