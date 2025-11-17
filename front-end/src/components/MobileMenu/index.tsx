import { Link } from "react-router-dom";
import './mobileMenu.scss';
import { FaHome, FaNewspaper, FaSignInAlt, FaRegUser } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { useIsAuthenticated } from "../../hooks/useIsAuthenticated";

const MobileMenu = () => {
    const { isAuthenticated } = useIsAuthenticated();

    return (
        <nav className="mobileMenu">
            <ul>
                <li>
                    <Link to="/">
                        <FaHome />
                        <span>Início</span>
                    </Link>
                </li>
                <li>
                    <Link to="/posts">
                        <FaNewspaper />
                        <span>Notícias</span>
                    </Link>
                </li>
                <li>
                    <Link to="/sobre-nos">
                        <FaUserGroup />
                        <span>Sobre Nós</span>
                    </Link>
                </li>
                {!isAuthenticated &&
                    <li>
                        <Link to="/login">
                            <FaSignInAlt />
                            <span>Entrar</span>
                        </Link>
                    </li>}
                {isAuthenticated &&
                    <li>
                        <Link to="/perfil">
                            <FaRegUser />
                            <span>Perfil</span>
                        </Link>
                    </li>}
            </ul>
        </nav>
    );
}

export default MobileMenu;