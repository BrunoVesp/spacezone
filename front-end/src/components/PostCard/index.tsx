import type { Tag } from '../../types/Posts';
import { formatTimeAgo } from '../../utils/formatTimeAgo';
import './postCard.scss';

interface PostCardProps {
    image: string;
    tags: Tag[];
    title: string;
    subtitle: string;
    author: string;
    createdAt: string;
}

const PostCard = ({ image, tags, title, subtitle, author, createdAt }: PostCardProps) => {
    return (
        <div className="postCard">
            <figure className="ImageContainer">
                <img src={image} alt="Post" />
            </figure>
            <div className='infos'>
                <div className="textContainer">
                    <div className="tags">
                        <ul>
                            {tags.map((tag, index) =>
                                <li key={index}>{tag}</li>
                            )}
                        </ul>
                    </div>
                    <h3 className="title">{title}</h3>
                    <h4 className="subtitle">{subtitle}</h4>
                </div>
                <div className='dateAndAuthor'>
                    <p>Por: {author}</p>
                    <p>{formatTimeAgo(createdAt)}</p>
                </div>
            </div>
        </div>
    );
}

export default PostCard;