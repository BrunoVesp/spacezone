import { useEffect } from "react";
import "./modal.scss";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {

    // Fechar com ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div className="modalOverlay" onClick={onClose}>
            <div
                className="modalContent"
                onClick={(e) => e.stopPropagation()} // impede fechamento ao clicar no conteúdo
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;