import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import Comentary from "./Comentary";
import defaultProfile from "../../assets/images/profileDefault.png";
import Modal from "../../components/Modal";
import type { ComentaryType } from "../../types/Comentary";
import Input from "../../components/Input";
import FileInput from "../../components/FileInput";
import defaultImage from '../../assets/images/default-placeholder.png';

const Post = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState<Posts | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const { addToast } = useToast();
    const [preview, setPreview] = useState<string | null>(null);

    const user = useAuthUser();

    /** MODAL EDITAR POST */
    const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
    const [editPostData, setEditPostData] = useState({
        title: "",
        subtitle: "",
        body: "",
        image: null as File | null
    });

    /** MODAL EXCLUIR POST */
    const [isDeletePostModalOpen, setIsDeletePostModalOpen] = useState(false);
    const [deletePostLoading, setDeletePostLoading] = useState(false);

    /** MODAIS DE EDITAR/EXCLUIR COMENTÁRIO */
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingComment, setEditingComment] = useState<ComentaryType | null>(null);

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingComment, setDeletingComment] = useState<ComentaryType | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    /** FORM NOVO COMENTÁRIO */
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<NewComment>({
        resolver: zodResolver(newCommentSchema),
        defaultValues: { newComment: "" }
    });

    /** FORM EDITAR COMENTÁRIO */
    const {
        register: registerEdit,
        handleSubmit: handleSubmitEdit,
        reset: resetEdit,
        formState: { errors: errorsEdit }
    } = useForm<EditComment>({
        resolver: zodResolver(editCommentSchema),
        defaultValues: { editComment: "" }
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

    /** CRIAR NOVO COMENTÁRIO */
    async function createNewComment(formData: NewComment) {
        if (!id) return;

        try {
            const response = await http.post(`/comments/${id}`, {
                content: formData.newComment
            });

            setPost((prev) =>
                prev ? { ...prev, comentarys: [...prev.comentarys, response.data] } : prev
            );

            addToast("Comentário adicionado!", "success");
            reset();
        } catch {
            addToast("Erro ao enviar comentário.", "error");
        }
    }

    /** ABRIR MODAL EDITAR POST */
    function openEditPostModal() {
        if (!post) return;

        setEditPostData({
            title: post.title,
            subtitle: post.subtitle,
            body: post.body,
            image: null
        });

        // mostrar a imagem atual do post no preview
        setPreview(post.image ? `${baseUrl}${post.image}` : null);

        setIsEditPostModalOpen(true);
    }

    /** SALVAR ALTERAÇÕES DO POST */
    async function updatePost() {
        if (!id) return;

        try {
            const formData = new FormData();
            formData.append("title", editPostData.title);
            formData.append("subtitle", editPostData.subtitle);
            formData.append("body", editPostData.body); // envia o body também
            if (editPostData.image) formData.append("image", editPostData.image);

            const response = await http.put(`/posts/${id}`, formData);

            // response pode não trazer todos os campos (ex.: comentarys).
            // preserva comentarys caso o backend não retorne.
            setPost((prev) => {
                if (!prev) return response.data;
                return {
                    ...prev,
                    ...response.data,
                    comentarys: response.data.comentarys ?? prev.comentarys ?? []
                };
            });
            setIsEditPostModalOpen(false);
            // limpar preview e arquivo após salvar
            setPreview(null);
            // limpar imagem selecionada no estado de edição
            setEditPostData((prev) => ({ ...prev, image: null }));
            addToast("Post atualizado!", "success");

        } catch (e) {
            console.error(e);
            addToast("Erro ao atualizar post.", "error");
        }
    }

    /** ABRIR MODAL EXCLUIR POST */
    function openDeletePostModal() {
        setIsDeletePostModalOpen(true);
    }

    /** CONFIRMAR EXCLUSÃO DO POST */
    async function deletePost() {
        if (!id) return;

        setDeletePostLoading(true);

        try {
            await http.delete(`/posts/${id}`);

            addToast("Post excluído!", "success");
            navigate("/");

        } catch (e) {
            console.error(e);
            addToast("Erro ao excluir post.", "error");
        } finally {
            setDeletePostLoading(false);
        }
    }

    /** ABRIR MODAL EDITAR COMENTÁRIO */
    function openEditModal(comment: ComentaryType) {
        setEditingComment(comment);
        resetEdit({ editComment: comment.content });
        setIsModalOpen(true);
    }

    /** SALVAR COMENTÁRIO EDITADO */
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

    /** ABRIR MODAL EXCLUIR COMENTÁRIO */
    function openDeleteModal(comment: ComentaryType) {
        setDeletingComment(comment);
        setIsDeleteModalOpen(true);
    }

    /** EXCLUIR COMENTÁRIO */
    async function deleteComment() {
        if (!deletingComment) return;

        setDeleteLoading(true);

        try {
            await http.delete(`/comments/${deletingComment.id}`);

            setPost((prev) =>
                prev
                    ? {
                        ...prev,
                        comentarys: prev.comentarys.filter((c) => c.id !== deletingComment.id)
                    }
                    : prev
            );

            addToast("Comentário excluído!", "success");
            setIsDeleteModalOpen(false);

        } catch {
            addToast("Erro ao excluir comentário.", "error");
        } finally {
            setDeleteLoading(false);
        }
    }

    function handleFile(selected: File | null) {

        // também guarda o arquivo no editPostData para envio no update
        setEditPostData((prev) => ({ ...prev, image: selected }));

        if (!selected) {
            setPreview(null);
            return;
        }

        const url = URL.createObjectURL(selected);
        setPreview(url);
    }

    if (loading) return <LoadingSpinner />;

    if (!post)
        return <h2 className="notFoundPostTitle">Post não encontrado.</h2>;

    const imageSrc = post.image ? `${baseUrl}${post.image}` : null;

    return (
        <Container>
            <div className="postPage">

                {/* BOTÕES DO REDATOR */}
                {user?.isRedator && (
                    <div className="redatorOptions">
                        <button className="edit" onClick={openEditPostModal}>
                            <FaEdit />
                        </button>
                        <button className="delete" onClick={openDeletePostModal}>
                            <MdDelete />
                        </button>
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

                    {(post.comentarys?.length ?? 0) === 0 ? (
                        <p className="noComments">Nenhum comentário ainda.</p>
                    ) : (
                        <ul>
                            {(post.comentarys ?? []).map((c) => (
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
                                        onDelete={() => openDeleteModal(c)}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* MODAL EDITAR COMENTÁRIO */}
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
                            <Button type="button" onClick={() => setIsModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button>Salvar</Button>
                        </div>
                    </form>
                </Modal>

                {/* MODAL EXCLUIR COMENTÁRIO */}
                <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                    <div className="deleteModal">
                        <h2>Excluir comentário</h2>
                        <p>Tem certeza que deseja excluir o comentário?</p>
                        <p className="smallText">Essa ação não pode ser desfeita.</p>

                        <div className="modalButtons">
                            <Button type="button" onClick={() => setIsDeleteModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                onClick={() => void deleteComment()}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "Excluindo..." : "Excluir"}
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* MODAL EDITAR POST */}
                <Modal isOpen={isEditPostModalOpen} onClose={() => { setIsEditPostModalOpen(false); setPreview(null); setEditPostData((prev) => ({ ...prev, image: null })); }}>
                    <div className="editPostModal">
                        <h2>Editar Post</h2>

                        <Fieldset>
                            <label>Título</label>
                            <Input
                                type="text"
                                value={editPostData.title}
                                onChange={(e) =>
                                    setEditPostData((prev) => ({ ...prev, title: e.target.value }))
                                }
                            />
                        </Fieldset>

                        <Fieldset>
                            <label>Subtítulo</label>
                            <Input
                                type="text"
                                value={editPostData.subtitle}
                                onChange={(e) =>
                                    setEditPostData((prev) => ({ ...prev, subtitle: e.target.value }))
                                }
                            />
                        </Fieldset>

                        <figure>
                            <img
                                src={
                                    preview ||
                                    (post?.image ? `${baseUrl}${post.image}` : defaultImage)
                                }
                                alt="Imagem do post"
                            />
                        </figure>

                        <Fieldset>
                            <label>Imagem</label>
                            <FileInput
                                onChange={handleFile}
                                label="Trocar Imagem"
                            />
                        </Fieldset>

                        <Fieldset>
                            <label>Corpo</label>
                            <TextArea
                                maxHeight={220}
                                value={editPostData.body}
                                onChange={(e) => setEditPostData((prev) => ({ ...prev, body: e.target.value }))
                                }
                            />
                        </Fieldset>

                        <div className="modalButtons">
                            <Button type="button" onClick={() => { setIsEditPostModalOpen(false); setPreview(null); setEditPostData((prev) => ({ ...prev, image: null })); }}>
                                Cancelar
                            </Button>
                            <Button type="button" onClick={() => void updatePost()}>
                                Salvar
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* MODAL EXCLUIR POST */}
                <Modal
                    isOpen={isDeletePostModalOpen}
                    onClose={() => setIsDeletePostModalOpen(false)}
                >
                    <div className="deleteModal">
                        <h2>Excluir Post</h2>
                        <p>Tem certeza que deseja excluir este post?</p>
                        <p className="smallText">Essa ação não pode ser desfeita.</p>

                        <div className="modalButtons">
                            <Button type="button" onClick={() => setIsDeletePostModalOpen(false)}>
                                Cancelar
                            </Button>
                            <Button
                                type="button"
                                onClick={() => void deletePost()}
                                disabled={deletePostLoading}
                            >
                                {deletePostLoading ? "Excluindo..." : "Excluir"}
                            </Button>
                        </div>
                    </div>
                </Modal>

            </div>
        </Container>
    );
};

export default Post;