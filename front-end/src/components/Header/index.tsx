import { Link } from "react-router-dom";
import './header.scss';
import Input from "../Input";
import Container from "../Container";
import Logo from "../Logo";

const Header = () => {
    return (
        <header className="header">
            <Container>
                <div className="headerContainer">
                    <Logo />
                    <div className="search">
                        <Input variant="search" />
                    </div>
                    <nav className="nav-header">
                        <ul>
                            <li>
                                <Link to="/">Início</Link>
                            </li>
                            <li>
                                <Link to="/posts">Notícias</Link>
                            </li>
                            <li>
                                <Link to="/sobre-nos">Sobre Nós</Link>
                            </li>
                            <li>
                                <Link to="/login">Entrar</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </Container>
        </header>
    )
}

export default Header;