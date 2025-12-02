import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import "./profile.scss";
import { useToast } from "../../hooks/useToast";
import { useAuthUser } from "../../hooks/useAuthUser";
import profileDefault from "../../assets/images/profileDefault.png";
import FileInput from "../../components/FileInput";
import { useState, useEffect } from "react";
import Button from "../../components/Button";
import { baseUrl, http } from "../../http/http";
import type { AxiosError } from "axios";
import { FaEdit } from "react-icons/fa";
import Modal from "../../components/Modal";
import Fieldset from "../../components/Fieldset";
import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateUserSchema, type UpdateUserParams } from "../../schemas/updateUserSchema";
import ErrorMessage from "../../components/ErrorMessage";
import { MdDashboardCustomize } from "react-icons/md";

const Profile = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const user = useAuthUser();
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateUserParams>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            nickname: user?.nickname ?? undefined,
            email: user?.email ?? undefined,
            newPassword: undefined,
            confirmPassword: undefined,
        },
    });

    useEffect(() => {
        // Atualiza valores do formulário quando o usuário for carregado/atualizado
        reset({
            nickname: user?.nickname ?? undefined,
            email: user?.email ?? undefined,
            newPassword: undefined,
            confirmPassword: undefined,
        });
    }, [user, reset]);

    useEffect(() => {
        // Limpa URL criado para preview quando o componente desmonta ou quando o arquivo muda
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    function handleFile(selected: File | null) {
        setFile(selected);

        if (!selected) {
            setPreview(null);
            return;
        }

        const url = URL.createObjectURL(selected);
        setPreview(url);
    }

    async function handleUpdateProfile(values: UpdateUserParams) {
        if (!user) {
            addToast("Você precisa estar logado.", "error");
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            if (values.nickname) formData.append("nickname", values.nickname);
            if (values.email) formData.append("email", values.email);
            // enviar apenas a nova senha (não enviar confirmPassword)
            if (values.newPassword) formData.append("password", values.newPassword);
            if (file) formData.append("image", file);

            const { data: updatedUser } = await http.put(`/users/${user.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // salvar o usuário atualizado
            localStorage.setItem("user", JSON.stringify(updatedUser));
            addToast("Perfil atualizado com sucesso!", "success");

            // limpar estado local
            setPreview(null);
            setFile(null);

            // fechar modal
            setIsModalOpen(false);

            // reload suave para atualizar o restante da UI
            setTimeout(() => {
                window.location.reload();
            }, 700);

        } catch (err) {
            const error = err as AxiosError;
            console.error(error);
            addToast("Erro ao atualizar perfil.", "error");
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
                    <button
                        className="edit"
                        onClick={() => setIsModalOpen(true)}
                        aria-label="Editar perfil"
                    >
                        <FaEdit />
                    </button>
                </div>

                <Modal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                >
                    <h2>Editar Perfil</h2>
                    <form
                        className="fileInputContainer"
                        onSubmit={handleSubmit(handleUpdateProfile)}
                    >
                        <Fieldset>
                            <label htmlFor="nickname">Nickname</label>
                            <Input
                                id="nickname"
                                {...register("nickname")}
                                defaultValue={user?.nickname ?? ""}
                            />
                            {errors.nickname && (
                                <ErrorMessage>{errors.nickname.message}</ErrorMessage>
                            )}
                        </Fieldset>
                        <Fieldset>
                            <label htmlFor="email">Email</label>
                            <Input
                                id="email"
                                {...register("email")}
                                defaultValue={user?.email ?? ""}
                            />
                            {errors.email && (
                                <ErrorMessage>{errors.email.message}</ErrorMessage>
                            )}
                        </Fieldset>
                        <Fieldset>
                            <label htmlFor="newPassword">Mudar Senha</label>
                            <Input
                                id="newPassword"
                                type="password"
                                {...register("newPassword")}
                            />
                            {errors.newPassword && (
                                <ErrorMessage>{errors.newPassword.message}</ErrorMessage>
                            )}
                        </Fieldset>
                        <Fieldset>
                            <label htmlFor="confirmPassword">Confirmar Senha</label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                {...register("confirmPassword")}
                            />
                            {errors.confirmPassword && (
                                <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>
                            )}
                        </Fieldset>

                        <FileInput label="Alterar foto de perfil" onChange={handleFile} />

                        <div className="actions">
                            <Button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button disabled={loading} type="submit">
                                {loading ? "Salvando..." : "Salvar"}
                            </Button>
                        </div>
                    </form>
                </Modal>

                {user?.isRedator &&
                    <Link to="/dashboard" className="dashboardLink">
                        <Button>
                            <MdDashboardCustomize />
                            <span>Dashboard</span>
                        </Button>
                    </Link>}

                <button className="logout" onClick={handleLogout}>Sair da Conta</button>
            </div>
        </Container>
    );
};

export default Profile;