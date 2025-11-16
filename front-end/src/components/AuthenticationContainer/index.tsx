import type { FormEvent } from "react";
import Logo from "../Logo";
import './authenticationContainer.scss';
import { Link } from "react-router-dom";

interface AuthenticationContainerProps {
    isLogin?: boolean;
    title?: string;
    description?: string;
    children: React.ReactNode;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const AuthenticationContainer = ({ title, description, children, onSubmit, isLogin = true }: AuthenticationContainerProps) => {
    return (
        <div className="authenticationContainer">
            <header>
                <Logo />
                <h2>{title}</h2>
                <p>{description}</p>
            </header>

            <main>
                <form onSubmit={onSubmit}>
                    {children}
                </form>
            </main>

            <footer>
                {isLogin ?
                    <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link></p> :
                    <p>Já tem uma conta? <Link to="/login">Entre</Link></p>}
            </footer>
        </div>
    );
}

export default AuthenticationContainer;