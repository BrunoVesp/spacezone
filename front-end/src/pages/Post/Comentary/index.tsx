import { useState, useRef, useEffect } from "react";
import { useAuthUser } from "../../../hooks/useAuthUser";
import { formatTimeAgo } from '../../../utils/formatTimeAgo';
import './comentary.scss';

interface ComentaryProps {
    nickname: string;
    content: string;
    createdAt: string;
    isUpdate: boolean;
    userImage: string;
    userId: number;
    onEdit?: () => void;
    onDelete?: () => void;
}

const Comentary = ({
    nickname,
    content,
    createdAt,
    isUpdate,
    userImage,
    userId,
    onEdit,
    onDelete
}: ComentaryProps) => {

    const authUser = useAuthUser();
    const isOwner = authUser?.id === userId;

    const [openMenu, setOpenMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Fecha ao clicar fora
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                </div>

                <p className='content'>{content}</p>
                {isUpdate && <span className='isUpdate'>(Editado)</span>}
            </div>

            {isOwner && (
                <div className="menuOptions" ref={menuRef}>
                    <button
                        className="menuButton"
                        onClick={() => setOpenMenu(prev => !prev)}
                    >
                        ⋮
                    </button>

                    {openMenu && (
                        <ul className="menuDropdown">
                            <li onClick={() => { setOpenMenu(false); onEdit?.(); }}>
                                Editar
                            </li>
                            <li onClick={() => { setOpenMenu(false); onDelete?.(); }}>
                                Excluir
                            </li>
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default Comentary;