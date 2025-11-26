import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import "./profile.scss";
import { useToast } from "../../hooks/useToast";
import { useAuthUser } from "../../hooks/useAuthUser";
import profileDefault from "../../assets/images/profileDefault.png";
import FileInput from "../../components/FileInput";
import { useState } from "react";
import Button from "../../components/Button";
import { baseUrl, http } from "../../http/http";
import type { AxiosError } from "axios";

const Profile = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const user = useAuthUser();
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    function handleFile(selected: File | null) {
        setFile(selected);

        if (!selected) {
            setPreview(null);
            return;
        }

        const url = URL.createObjectURL(selected);
        setPreview(url);
    }

    async function updateProfileImage() {
        if (!file) {
            addToast("Selecione uma imagem primeiro.", "error");
            return;
        }

        if (!user) {
            addToast("Você precisa estar logado.", "error");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("image", file);

            // backend já retorna o user atualizado
            const { data: updatedUser } = await http.put(`/users/${user.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // salva o usuário atualizado
            localStorage.setItem("user", JSON.stringify(updatedUser));

            addToast("Foto de perfil atualizada!", "success");

            // limpar estado local
            setPreview(null);
            setFile(null);

            // 🔥 reload suave após salvar
            setTimeout(() => {
                window.location.reload();
            }, 800);

        } catch (err) {
            const error = err as AxiosError;
            console.error(error);
            addToast("Erro ao atualizar foto de perfil.", "error");
        } finally {
            setLoading(false);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        addToast("Você saiu da conta.", "success");
        navigate("/login");
    };

    return (
        <Container>
            <div className="profile">
                <div className="imageAndName">
                    <figure>
                        <img
                            src={
                                preview ||
                                (user?.profileImage
                                    ? `${baseUrl}${user.profileImage}`
                                    : profileDefault)
                            }
                            alt="Profile"
                        />
                    </figure>
                    <h1 style={{ color: "white" }}>
                        Olá, {user?.nickname ?? "Usuário"}
                    </h1>
                </div>

                <form
                    className="fileInputContainer"
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateProfileImage();
                    }}
                >
                    <FileInput label="Alterar foto de perfil" onChange={handleFile} />

                    <Button disabled={loading}>
                        {loading ? "Salvando..." : "Salvar"}
                    </Button>
                </form>

                <button onClick={handleLogout}>Sair da Conta</button>

                {user?.isRedator && <Link to="/dashboard">Dashboard</Link>}
            </div>
        </Container>
    );
};

export default Profile;