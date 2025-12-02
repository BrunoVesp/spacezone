import { useForm } from "react-hook-form";
import Container from "../../components/Container";
import Fieldset from "../../components/Fieldset";
import Input from "../../components/Input";
import TextArea from "../../components/TextArea";
import Button from "../../components/Button";
import { zodResolver } from "@hookform/resolvers/zod";
import { newPostSchema, type NewPostSchema } from "../../schemas/newPostSchema";
import ErrorMessage from "../../components/ErrorMessage";
import { http } from "../../http/http";
import { useToast } from "../../hooks/useToast";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useState } from "react";
import { allowedTags } from "../../data/tags";
import "./dashboard.scss";
import FileInput from "../../components/FileInput";
import type { AxiosError } from "axios";

// Se você tiver um contexto de auth, substitua isso
const mockLoggedUserId = 1;

const Dashboard = () => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
    } = useForm<NewPostSchema>({
        mode: "all",
        defaultValues: {
            title: "",
            subtitle: "",
            body: "",
            image: undefined,
            tags: [],
        },
        resolver: zodResolver(newPostSchema),
    });

    const { addToast } = useToast();

    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const selectedTags = watch("tags") ?? [];

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setValue(
                "tags",
                selectedTags.filter((t) => t !== tag),
                { shouldValidate: true }
            );
        } else {
            setValue("tags", [...selectedTags, tag], { shouldValidate: true });
        }
    };

    const newPost = async (formData: NewPostSchema) => {
        setLoading(true);
        const data = new FormData();

        data.append("title", formData.title);
        data.append("subtitle", formData.subtitle);
        data.append("body", formData.body);
        formData.tags?.forEach((tag) => data.append("tags[]", tag));

        if (formData.image && formData.image.length > 0) {
            data.append("image", formData.image[0]);
        }

        try {
            await http.post("/posts", data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            addToast("A publicação foi um sucesso", "success");
        } catch {
            addToast("Não foi possível publicar", "error");
        } finally {
            setLoading(false);
        }
    };

    // PROMOVER REDATOR
    const [promoteForm, setPromoteForm] = useState<{
        email: string;
        nickname: string;
    }>({
        email: "",
        nickname: "",
    });

    const promoteRedator = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await http.put("/redatores/promote", promoteForm);
            addToast("Usuário promovido com sucesso!", "success");
        } catch (error: unknown) {
            const err = error as AxiosError<{ message?: string }>;
            addToast(err.response?.data?.message ?? "Erro ao promover usuário", "error");
        }
    };

    // DESPROMOVER
    const demoteRedator = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await http.put(`/redatores/demote/${mockLoggedUserId}`);
            addToast("Você foi despromovido com sucesso.", "success");
        } catch (error: unknown) {
            const err = error as AxiosError<{ message?: string }>;
            addToast(err.response?.data?.message ?? "Erro ao despromover", "error");
        }
    };

    return (
        <Container>
            <div className="dashboard">
                <h1>Dashboard</h1>
                <div className="newPostAndRedator">
                    <form
                        className="newPostForm"
                        onSubmit={handleSubmit(newPost)}
                    >
                        <h2>Novo post</h2>
                        <Fieldset>
                            <label htmlFor="title">Título</label>
                            <Input id="title" {...register("title")} />
                            {errors.title && <ErrorMessage>{errors.title.message}</ErrorMessage>}
                        </Fieldset>
                        <Fieldset>
                            <label htmlFor="subtitle">Subtítulo</label>
                            <Input id="subtitle" {...register("subtitle")} />
                            {errors.subtitle && <ErrorMessage>{errors.subtitle.message}</ErrorMessage>}
                        </Fieldset>
                        <Fieldset>
                            <label htmlFor="body">Corpo</label>
                            <TextArea id="body" {...register("body")} />
                            {errors.body && <ErrorMessage>{errors.body.message}</ErrorMessage>}
                        </Fieldset>
                        <Fieldset>
                            <label htmlFor="image">Imagem</label>
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Prévia"
                                    style={{
                                        width: "200px",
                                        height: "auto",
                                        marginBottom: "1rem",
                                        borderRadius: "8px",
                                        border: "1px solid #444",
                                    }}
                                />
                            )}
                            <FileInput
                                label="Adicionar Imagem"
                                onChange={(file: File | null) => {
                                    if (file) {
                                        setValue("image", [file], { shouldValidate: true });
                                        setPreview(URL.createObjectURL(file));
                                    } else {
                                        setValue("image", undefined, { shouldValidate: true });
                                        setPreview(null);
                                    }
                                }}
                            />
                            {errors.image && <ErrorMessage>{errors.image.message}</ErrorMessage>}
                        </Fieldset>
                        <Fieldset>
                            <label htmlFor="tags">Selecione as Tags</label>
                            <ul style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {allowedTags.map((tag) => {
                                    const isSelected = selectedTags.includes(tag);
                                    return (
                                        <li
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                                border: "1px solid white",
                                                background: isSelected ? "#4caf50" : "transparent",
                                                color: "white",
                                                userSelect: "none",
                                            }}
                                        >
                                            {tag}
                                        </li>
                                    );
                                })}
                            </ul>
                            {errors.tags && <ErrorMessage>{errors.tags.message}</ErrorMessage>}
                        </Fieldset>
                        {loading && <LoadingSpinner />}
                        <Button disabled={loading}>
                            {loading ? "Publicando..." : "Publicar"}
                        </Button>
                    </form>
                    {/* REDATOR */}
                    <div className="redator">
                        <div className="promoteRedator">
                            <h2>Promover usuário</h2>
                            <form
                                onSubmit={promoteRedator}
                                className="promoteRedatorForm"
                            >
                                <Fieldset>
                                    <label>Email</label>
                                    <Input
                                        value={promoteForm.email}
                                        onChange={(e) =>
                                            setPromoteForm((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }))
                                        }
                                    />
                                </Fieldset>
                                <Fieldset>
                                    <label>Nickname</label>
                                    <Input
                                        value={promoteForm.nickname}
                                        onChange={(e) =>
                                            setPromoteForm((prev) => ({
                                                ...prev,
                                                nickname: e.target.value,
                                            }))
                                        }
                                    />
                                </Fieldset>
                                <Button>Promover</Button>
                            </form>
                        </div>
                        <div className="demoteRedator">
                            <h2>Despromover usuário (somente você)</h2>
                            <form onSubmit={demoteRedator}>
                                <p>Você será despromovido e perderá permissões de redator.</p>
                                <Button>Despromover-se</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default Dashboard;