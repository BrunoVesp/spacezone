import { useState, useCallback } from "react";
import { ToastContext, type ToastItem, type ToastType } from "./ToastContext";
import "./toast.scss";

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {

    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const id = Date.now();

        setToasts(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3500);

    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}

            <div className="toastWrapper">
                {toasts.map(t => (
                    <div key={t.id} className={`toast ${t.type}`}>
                        {t.message}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}