import { useRef } from "react";
import "./fileInput.scss";
import { FaUpload } from "react-icons/fa";

interface FileInputProps {
    label?: string;
    onChange: (file: File | null) => void;
}

const FileInput = ({ label = "Selecionar imagem", onChange }: FileInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    function handleClick() {
        inputRef.current?.click();
    }

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] ?? null;
        onChange(file);
    }

    return (
        <div className="fileInput">
            <button type="button" className="fileButton" onClick={handleClick}>
                <FaUpload />
                {label}
            </button>

            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleFile}
                style={{ display: "none" }}
            />
        </div>
    );
};

export default FileInput;
