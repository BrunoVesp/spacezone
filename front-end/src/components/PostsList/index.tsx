import './postsList.scss';
import type { Posts } from '../../types/Posts';
import { useEffect, useState } from 'react';
import PostCard from '../PostCard';
import postImage from '../../assets/images/post.jpg'; //temporário enquanto não tem imagem na api
import { http } from '../../http/http';

interface PostsListProps {
    postsListTitle?: string;
}

const PostsList = ({ postsListTitle }: PostsListProps) => {
    const [posts, setPosts] = useState<Posts[]>([]);

    async function fetchPosts() {
        await http<Posts[]>("/posts")
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        fetchPosts();
    }, [])

    return (
        <div className='postsList'>
            <h2 className='postsListTitle'>{postsListTitle}</h2>
            <ul>
                {posts.map((post, index) =>
                    <li key={index}>
                        <PostCard
                            image={postImage}
                            // aqui está de forma estática por enquanto
                            tags={
                                ["Estrelas", "Galaxias"]
                            }
                            title={post.title}
                            subtitle={post.subtitle}
                            author={post.author?.nickname ?? "Usuário deletado"}
                            createdAt={post.createdAt}
                        />
                    </li>
                )}
            </ul>
        </div>
    );
}

export default PostsList;