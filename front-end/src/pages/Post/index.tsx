import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Posts } from "../../types/Posts";
import { baseUrl, http } from "../../http/http";
import LoadingSpinner from "../../components/LoadingSpinner";
import Container from "../../components/Container";
import { formatTimeAgo } from "../../utils/formatTimeAgo";
import './post.scss';
import { useAuthUser } from "../../hooks/useAuthUser";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import TextArea from "../../components/TextArea";
import Fieldset from "../../components/Fieldset";
import Button from "../../components/Button";
import { useForm } from "react-hook-form";
import { newCommentSchema, type NewComment } from "../../schemas/newCommentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "../../components/ErrorMessage";
import { useToast } from "../../hooks/useToast";
import type { AxiosError } from "axios";
import Comentary from "./Comentary";
import defaultProfile from '../../assets/images/profileDefault.png';

const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState<Posts | null>();
    const [loading, setLoading] = useState<boolean>(false);
    const { addToast } = useToast();
    const user = useAuthUser();
    const { register, handleSubmit, formState: { errors } } = useForm<NewComment>({
        mode: 'all',
        defaultValues: {
            newComment: ''
        },
        resolver: zodResolver(newCommentSchema)
    });

    async function fetchPost() {
        setLoading(true);

        await http.get<Posts>(`/posts/${id}`)
            .then(response => {
                setPost(response.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        if (id) fetchPost();
    }, [id]);

    async function createNewComment(formData: NewComment) {
        setLoading(true);
        if (!id) return;

        try {
            const response = await http.post(`/comments/${id}`, {
                content: formData.newComment
            });

            setPost(prev =>
                prev ? {
                    ...prev,
                    comentarys: [...prev.comentarys, response.data]
                } : prev
            );

            addToast("Comentário adicionado", "success");

        } catch (error: unknown) {
            const err = error as AxiosError;

            if (err.response?.status === 401) {
                addToast("Você precisa estar entrar para comentar.", "error");
                return;
            }

            console.error(err);
            addToast("Erro ao enviar comentário. Tente novamente.", "error");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <LoadingSpinner />;

    if (!post) {
        return <h2 className="notFoundPostTitle">Post não encontrado.</h2>;
    }

    const imageSrc = post.image ? `${baseUrl}${post.image}` : null;

    return (
        <Container>
            <div className="postPage">
                {user?.isRedator &&
                    <div className="redatorOptions">
                        <button className="edit"><FaEdit /></button>
                        <button className="delete"><MdDelete /></button>
                    </div>}
                <header>
                    <h1>teste</h1>
                    <h2>Subtítulo</h2>
                </header>
                <div className="infos">
                    <span>
                        Publicado {formatTimeAgo(post.createdAt)}
                    </span>
                    {post.updateAt && post.updateAt !== post.createdAt ?
                        <span>
                            Atualizado {formatTimeAgo(post.updateAt)}
                        </span> : null}
                    <span>Por: {post.author?.nickname ? post.author?.nickname : 'Usuário deletado'}</span>
                </div>
                <div className="content">
                    <figure>
                        {imageSrc &&
                            <img src={imageSrc} alt={post.title} />}
                    </figure>
                    <p className="body">{post.body}</p>
                    <div className="tagsContainer">
                        <h3>Tags</h3>
                        <ul>
                            {post.tags?.map((tag, index) =>
                                <li key={index}>{tag}</li>
                            )}
                        </ul>
                    </div>
                </div>
                <div className="newComment">
                    <form onSubmit={handleSubmit(createNewComment)}>
                        <Fieldset>
                            <label htmlFor="newComment">Comentar</label>
                            <TextArea
                                id="newComment"
                                maxHeight={100}
                                {...register('newComment')}
                            />
                        </Fieldset>
                        {errors.newComment &&
                            <ErrorMessage>{errors.newComment.message}</ErrorMessage>}
                        <Button>Comentar</Button>
                    </form>
                </div>
                <div className="comments">
                    <h3>Comentários</h3>
                    {post.comentarys.length === 0 ? (
                        <p className="noComments">Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                    ) : (
                        <ul>
                            {post.comentarys.map((comentary, index) =>
                                <li key={index}>
                                    <Comentary
                                        userImage={comentary.userImage ? comentary.userImage : defaultProfile}
                                        content={comentary.content}
                                        nickname={comentary.user.nickname}
                                        createdAt={comentary.createdAt}
                                        isUpdate={comentary.isUpdated}
                                    />
                                </li>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </Container>
    );
}

export default Post;