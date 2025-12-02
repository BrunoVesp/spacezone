import Container from "../Container";
import './footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <Container>
                <div className="footerInfos">
                    <p>
                        &copy; 2025 SpaceZone. Todos os direitos reservados.
                    </p>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;