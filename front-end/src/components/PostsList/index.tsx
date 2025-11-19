import './postsList.scss';
import type { Posts } from '../../types/Posts';
import { useEffect, useState } from 'react';
import PostCard from '../PostCard';
import defaultImage from '../../assets/images/default-placeholder.png';
import { baseUrl, http } from '../../http/http';
import type { GetPosts } from '../../types/getPosts';
interface PostsListProps {
    postsListTitle?: string;
}

const PostsList = ({ postsListTitle }: PostsListProps) => {
    const [posts, setPosts] = useState<Posts[]>([]);

    async function fetchPosts() {
        await http<GetPosts>("/posts")
            .then(response => {
                setPosts(response.data.data);
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
                            image={post.image ? `${baseUrl}${post.image}` : defaultImage}
                            tags={post.tags ?? []}
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