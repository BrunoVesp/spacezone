import { Link, useNavigate } from "react-router-dom";
import './header.scss';
import Input from "../Input";
import Container from "../Container";
import Logo from "../Logo";
import { useIsAuthenticated } from "../../hooks/useIsAuthenticated";
import { useState } from "react";

const Header = () => {
    const { isAuthenticated } = useIsAuthenticated();
    const [search, setSearch] = useState<string>("");
    const navigate = useNavigate();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (search.trim() !== "") {
                navigate(`/posts?query=${encodeURIComponent(search)}`);
            }
        }
    }

    return (
        <header className="header">
            <Container>
                <div className="headerContainer">
                    <Logo />
                    <div className="search">
                        <Input
                            variant="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
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
                            {isAuthenticated ?
                                <li>
                                    <Link to="/perfil">Perfil</Link>
                                </li>
                                :
                                <li>
                                    <Link to="/login">Entrar</Link>
                                </li>}
                        </ul>
                    </nav>
                </div>
            </Container>
        </header>
    )
}

export default Header;