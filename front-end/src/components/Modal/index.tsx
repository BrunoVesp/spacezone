import { useEffect, useRef } from "react";
import "./modal.scss";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
    const closeBtnRef = useRef<HTMLButtonElement | null>(null);

    // Fechar com ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    // Focar botão de fechar quando abrir
    useEffect(() => {
        if (isOpen) {
            closeBtnRef.current?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modalOverlay" onClick={onClose} role="dialog" aria-modal="true">
            <div
                className="modalContent"
                onClick={(e) => e.stopPropagation()} // impede fechamento ao clicar no conteúdo
            >
                {/* Botão de fechar (X) */}
                <header className="modalHeader">
                    <button
                        ref={closeBtnRef}
                        className="modalCloseButton"
                        type="button"
                        onClick={onClose}
                        aria-label="Fechar modal"
                        title="Fechar"
                    >
                        <IoMdClose />
                    </button>
                </header>

                {children}
            </div>
        </div>
    );
};

export default Modal;