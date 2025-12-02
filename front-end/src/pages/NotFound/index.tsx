import { Link } from "react-router-dom";
import Container from "../../components/Container";
import "./notFound.scss";
import Button from "../../components/Button";

const NotFound = () => {
    return (
        <div className="notFound-page">
            <Container>
                <main className="notFound">
                    <div className="content">
                        <div className="code">404</div>
                        <h1>Página não encontrada</h1>
                        <div className="textAndLink">
                            <p>
                                A página que você procura não existe ou foi movida.
                                Verifique a URL ou volte para a página inicial.
                            </p>
                            <Link to="/" aria-label="Voltar para Home">
                                <Button>Voltar para o início</Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </Container>
        </div>
    );
};

export default NotFound;