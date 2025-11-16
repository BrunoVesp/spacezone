import { createContext } from "react";

export type ToastType = "success" | "error";

export interface ToastItem {
    id: number;
    message: string;
    type: ToastType;
}

export interface ToastContextProps {
    addToast: (message: string, type: ToastType) => void;
}

export const ToastContext = createContext<ToastContextProps | null>(null);