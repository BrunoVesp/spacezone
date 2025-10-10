import axios from 'axios';
import type { Posts } from '../../types/Posts';
import { useEffect, useState } from 'react';

const PostsList = () => {
    const [posts, setPosts] = useState<Posts[]>([]);

    async function fetchPosts() {
        axios.get<Posts[]>("http://localhost:3000/posts")
            .then(response => {
                setPosts(response.data);
                console.log(response.data)
            })
            .catch(error => console.log(error));
    }

    useEffect(() => {
        fetchPosts();
    }, [])

    return (
        <ul>
            {posts.map(post =>
                <li key={post.id}>
                    <header>
                        <h1>{post.title}</h1>
                        <h2>{post.subtitle}</h2>
                    </header>
                    <main>
                        <p>
                            {post.body}
                        </p>
                    </main>
                </li>
            )}
        </ul>
    );
}

export default PostsList;