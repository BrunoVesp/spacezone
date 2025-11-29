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
import './dashboard.scss';

const Dashboard = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch
    } = useForm<NewPostSchema>({
        mode: "all",
        defaultValues: {
            title: "",
            subtitle: "",
            body: "",
            image: undefined,
            tags: []
        },
        resolver: zodResolver(newPostSchema)
    });

    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const selectedTags = watch("tags") ?? [];

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setValue(
                "tags",
                selectedTags.filter(t => t !== tag),
                { shouldValidate: true }
            );
        } else {
            setValue(
                "tags",
                [...selectedTags, tag],
                { shouldValidate: true }
            );
        }
    };

    const newPost = async (formData: NewPostSchema) => {
        setLoading(true);
        const data = new FormData();

        data.append("title", formData.title);
        data.append("subtitle", formData.subtitle);
        data.append("body", formData.body);
        formData.tags?.forEach(tag => data.append("tags[]", tag));

        if (formData.image && formData.image.length > 0) {
            data.append("image", formData.image[0]);
        }

        try {
            await http.post<NewPostSchema>("/posts", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            addToast("A publicação foi um sucesso", "success");
        } catch {
            addToast("Não foi possível publicar", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <div className="dashboard">
                <h1 style={{ color: 'white' }}>Dashboard</h1>

                <h2 style={{ color: 'white' }}>Novo post</h2>
                <form onSubmit={handleSubmit(newPost)}>
                    <Fieldset>
                        <label htmlFor="title">Título</label>
                        <Input
                            id="title"
                            {...register("title")}
                        />
                        {errors.title &&
                            <ErrorMessage>{errors.title.message}</ErrorMessage>}
                    </Fieldset>
                    <Fieldset>
                        <label htmlFor="subtitle">Subtítulo</label>
                        <Input
                            id="subtitle"
                            {...register("subtitle")}
                        />
                        {errors.subtitle &&
                            <ErrorMessage>{errors.subtitle.message}</ErrorMessage>}
                    </Fieldset>
                    <Fieldset>
                        <label htmlFor="body">Corpo</label>
                        <TextArea
                            id="body"
                            {...register("body")}
                        />
                        {errors.body &&
                            <ErrorMessage>{errors.body.message}</ErrorMessage>}
                    </Fieldset>
                    <Fieldset>
                        <label htmlFor="image">Imagem</label>
                        <input
                            type="file"
                            id="image"
                            {...register("image")}
                        />
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
                                            userSelect: "none"
                                        }}
                                    >
                                        {tag}
                                    </li>
                                );
                            })}
                        </ul>

                        {errors.tags && (
                            <ErrorMessage>{errors.tags.message}</ErrorMessage>
                        )}
                    </Fieldset>
                    {loading && <LoadingSpinner />}
                    <Button disabled={loading}>
                        {loading ? "Publicando..." : "Publicar"}
                    </Button>
                </form>
            </div>
        </Container>
    );
}

export default Dashboard;