import { Link } from "react-router-dom";
import Button from "../Button";
import Container from "../Container";
import './footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <Container>
                <div className="footerInfos">
                    <p>
                        &copy; 2025 SpaceZone. Todo os direitos reservados.
                    </p>
                    <Link to="adm-login">
                        <Button>
                            Adiministração
                        </Button>
                    </Link>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;