import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Posts } from "../../types/Posts";
import { baseUrl, http } from "../../http/http";
import LoadingSpinner from "../../components/LoadingSpinner";
import Container from "../../components/Container";
import { formatTimeAgo } from "../../utils/formatTimeAgo";
import "./post.scss";
import { useAuthUser } from "../../hooks/useAuthUser";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import TextArea from "../../components/TextArea";
import Fieldset from "../../components/Fieldset";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import {
    newCommentSchema,
    editCommentSchema,
    type NewComment,
    type EditComment
} from "../../schemas/commentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../components/ErrorMessage";
import { useToast } from "../../hooks/useToast";
import type { AxiosError } from "axios";
import Comentary from "./Comentary";
import defaultProfile from "../../assets/images/profileDefault.png";
import Modal from "../../components/Modal";
import type { ComentaryType } from "../../types/Comentary";

const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState<Posts | null>();
    const [loading, setLoading] = useState<boolean>(false);
    const { addToast } = useToast();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingComment, setEditingComment] = useState<ComentaryType | null>(null);

    const user = useAuthUser();

    /** FORM PARA NOVOS COMENTÁRIOS */
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<NewComment>({
        resolver: zodResolver(newCommentSchema),
        defaultValues: {
            newComment: ""
        }
    });

    /** FORM PARA EDITAR COMENTÁRIO */
    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        formState: { errors: errorsEdit }
    } = useForm<EditComment>({
        resolver: zodResolver(editCommentSchema),
        defaultValues: {
            editComment: ""
        }
    });

    async function fetchPost() {
        setLoading(true);
        try {
            const response = await http.get<Posts>(`/posts/${id}`);
            setPost(response.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (id) fetchPost();
    }, [id]);

    /** NOVO COMENTÁRIO */
    async function createNewComment(formData: NewComment) {
        if (!id) return;

        try {
            const response = await http.post(`/comments/${id}`, {
                content: formData.newComment
            });

            setPost((prev) =>
                prev
                    ? {
                        ...prev,
                        comentarys: [...prev.comentarys, response.data]
                    }
                    : prev
            );

            addToast("Comentário adicionado!", "success");
            reset();

        } catch (error: unknown) {
            const err = error as AxiosError;

            if (err.response?.status === 401) {
                addToast("Você precisa entrar para comentar.", "error");
                return;
            }

            addToast("Erro ao enviar comentário.", "error");
        }
    }

    /** ABRIR MODAL DE EDIÇÃO */
    function openEditModal(comment: ComentaryType) {
        setEditingComment(comment);
        resetEdit({ editComment: comment.content });
        setIsModalOpen(true);
    }

    /** ATUALIZAR UM COMENTÁRIO */
    async function updateComment(formData: EditComment) {
        if (!editingComment) return;

        try {
            const response = await http.put(`/comments/${editingComment.id}`, {
                content: formData.editComment
            });

            setPost((prev) =>
                prev
                    ? {
                        ...prev,
                        comentarys: prev.comentarys.map((c) =>
                            c.id === editingComment.id ? response.data : c
                        )
                    }
                    : prev
            );

            addToast("Comentário atualizado!", "success");
            setIsModalOpen(false);

        } catch (e) {
            console.error(e);
            addToast("Erro ao atualizar comentário.", "error");
        }
    }

    if (loading) return <LoadingSpinner />;

    if (!post)
        return <h2 className="notFoundPostTitle">Post não encontrado.</h2>;

    const imageSrc = post.image ? `${baseUrl}${post.image}` : null;

    return (
        <Container>
            <div className="postPage">
                {user?.isRedator && (
                    <div className="redatorOptions">
                        <button className="edit"><FaEdit /></button>
                        <button className="delete"><MdDelete /></button>
                    </div>
                )}

                <header>
                    <h1>{post.title}</h1>
                    <h2>{post.subtitle}</h2>
                </header>

                <div className="infos">
                    <span>Publicado {formatTimeAgo(post.createdAt)}</span>
                    {post.updateAt && post.updateAt !== post.createdAt && (
                        <span>Atualizado {formatTimeAgo(post.updateAt)}</span>
                    )}
                    <span>Por: {post.author?.nickname ?? "Usuário deletado"}</span>
                </div>

                <div className="content">
                    <figure>{imageSrc && <img src={imageSrc} alt={post.title} />}</figure>
                    <p className="body">{post.body}</p>

                    <div className="tagsContainer">
                        <h3>Tags</h3>
                        <ul>
                            {post.tags?.map((tag, i) => (
                                <li key={i}>{tag}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* NOVO COMENTÁRIO */}
                <div className="newComment">
                    <form onSubmit={handleSubmit(createNewComment)}>
                        <Fieldset>
                            <label htmlFor="newComment">Comentar</label>
                            <TextArea id="newComment" maxHeight={100} {...register("newComment")} />
                        </Fieldset>

                        {errors.newComment && (
                            <ErrorMessage>{errors.newComment.message}</ErrorMessage>
                        )}

                        <Button>Comentar</Button>
                    </form>
                </div>

                {/* LISTA DE COMENTÁRIOS */}
                <div className="comments">
                    <h3>Comentários</h3>

                    {post.comentarys.length === 0 ? (
                        <p className="noComments">Nenhum comentário ainda.</p>
                    ) : (
                        <ul>
                            {post.comentarys.map((c) => (
                                <li key={c.id}>
                                    <Comentary
                                        userImage={
                                            c.user.profileImage
                                                ? `${baseUrl}${c.user.profileImage}`
                                                : defaultProfile
                                        }
                                        nickname={c.user.nickname}
                                        content={c.content}
                                        createdAt={c.createdAt}
                                        isUpdate={c.isUpdated}
                                        userId={c.user.id}
                                        onEdit={() => openEditModal(c)}
                                        onDelete={() => console.log("excluir", c.id)}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* MODAL DE EDIÇÃO */}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <form className="commentEditModal" onSubmit={handleSubmitEdit(updateComment)}>
                        <h2>Editar comentário</h2>

                        <Fieldset>
                            <TextArea maxHeight={100} {...registerEdit("editComment")} />

                            {errorsEdit.editComment && (
                                <ErrorMessage>{errorsEdit.editComment.message}</ErrorMessage>
                            )}
                        </Fieldset>

                        <div className="modalButtons">
                            <Button>Salvar</Button>
                            <Button type="button" onClick={() => setIsModalOpen(false)}>
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Container>
    );
};

export default Post;