//import { useAuthUser } from '../../../hooks/useAuthUser';
import { formatTimeAgo } from '../../../utils/formatTimeAgo';
import './comentary.scss';

interface ComentaryProps {
    nickname: string;
    content: string;
    createdAt: string;
    isUpdate: boolean;
    userImage: string;
}

const Comentary = ({ nickname, content, createdAt, isUpdate, userImage }: ComentaryProps) => {
    //const user = useAuthUser();

    return (
        <div className='comentary'>
            <figure>
                <img src={userImage} alt={nickname} />
            </figure>
            <div className='texts'>
                <div className='comentaryHeader'>
                    <div className='name'>
                        <h4>@{nickname}</h4>
                        <span>{formatTimeAgo(createdAt)}</span>
                    </div>
                    {/* {<div className='edit'>
                    </div>} */}
                </div>
                <p className='content'>{content}</p>
                {isUpdate && <span className='isUpdate'>(Editado)</span>}
            </div>
        </div>
    );
}

export default Comentary;