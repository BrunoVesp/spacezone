import { Link } from "react-router-dom";
import './mobileMenu.scss';
import { FaHome, FaNewspaper, FaSignInAlt } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

const MobileMenu = () => {
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
                <li>
                    <Link to="/login">
                        <FaSignInAlt />
                        <span>Entrar</span>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default MobileMenu;