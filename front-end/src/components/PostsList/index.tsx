import './postsList.scss';
import type { Posts } from '../../types/Posts';
import { useEffect, useState } from 'react';
import PostCard from '../PostCard';
import defaultImage from '../../assets/images/default-placeholder.png';
import type { GetPosts } from '../../types/GetPosts';
import { allowedTags } from '../../data/tags';
import LoadingSpinner from '../LoadingSpinner';
import Button from '../Button';
import { baseUrl, http } from '../../http/http';
import { Link, useSearchParams } from "react-router-dom";

interface PostsListProps {
    postsListTitle?: string;
}

const PostsList = ({ postsListTitle }: PostsListProps) => {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get("query") || "";

    const [posts, setPosts] = useState<Posts[]>([]);
    const [selectedTag, setSelectedTag] = useState<string>("");

    const [loading, setLoading] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);
    const limit = 6;
    const [totalPages, setTotalPages] = useState<number>(1);

    async function fetchPosts() {
        setLoading(true);

        const url = (() => {
            if (searchQuery) {
                return `/posts/search?query=${searchQuery}&page=${page}&limit=${limit}`;
            }

            if (selectedTag) {
                return `/posts/search?query=${selectedTag}&page=${page}&limit=${limit}`;
            }

            return `/posts?page=${page}&limit=${limit}`;
        })();

        await http<GetPosts>(url)
            .then(response => {
                const { data, totalPages } = response.data;
                setPosts(data);
                setTotalPages(totalPages);
            })
            .catch(console.log)
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        setPage(1);
    }, [searchQuery, selectedTag]);

    useEffect(() => {
        fetchPosts();
    }, [page, searchQuery, selectedTag]);


    // FILTRO DE TAGS
    const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTag(e.target.value);
    };

    // PAGINAÇÃO
    const handleNextPage = () => page < totalPages && setPage(prev => prev + 1);
    const handlePrevPage = () => page > 1 && setPage(prev => prev - 1);

    return (
        <div className='postsList'>
            <header>
                <h2 className='postsListTitle'>{postsListTitle}</h2>

                <div className="filterContainer">
                    <label className="filterLabel">Filtrar por tag:</label>
                    <select
                        className="filterSelect"
                        value={selectedTag}
                        onChange={handleTagChange}
                    >
                        <option value="">Todas</option>
                        {allowedTags.map(tag => (
                            <option key={tag} value={tag}>
                                {tag}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            {loading && <LoadingSpinner />}

            {posts.length > 0 ? (
                <ul className='list'>
                    {posts.map((post, index) => (
                        <li key={index}>
                            <Link to={`/posts/${post.id}`}>
                                <PostCard
                                    image={post.image ? `${baseUrl}${post.image}` : defaultImage}
                                    tags={post.tags ?? []}
                                    title={post.title}
                                    subtitle={post.subtitle}
                                    author={post.author?.nickname ?? "Usuário deletado"}
                                    createdAt={post.createdAt}
                                />
                            </Link>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <h3 className='emptyPosts'>Não há postagens no momento</h3>
            )}

            <footer>
                <div className="pagination">
                    {page > 1 && (
                        <Button onClick={handlePrevPage} disabled={loading}>
                            Anterior
                        </Button>
                    )}

                    {posts.length > 0 && (
                        <span>Página {page} de {totalPages}</span>
                    )}

                    {page < totalPages && (
                        <Button onClick={handleNextPage} disabled={loading}>
                            Próxima
                        </Button>
                    )}
                </div>
            </footer>
        </div>
    );
};

export default PostsList;