import { Link, useNavigate } from "react-router-dom";
import Container from "../../components/Container";
import './profile.scss';
import { useToast } from "../../hooks/useToast";
import { useAuthUser } from "../../hooks/useAuthUser";

const Profile = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const user = useAuthUser();

    const handleLogout = () => {
        localStorage.removeItem("authToken");  // remove o token
        localStorage.removeItem("user");
        addToast("Você saiu da conta.", "success");
        navigate("/login"); // redireciona para login
    };

    return (
        <Container>
            <div>
                <h1 style={{ color: 'white' }}>Olá, {user?.nickname ?? "Usuário"}</h1>

                <button
                    onClick={handleLogout}
                >
                    Sair da Conta
                </button>

                {user?.isRedator && <Link to="/dashboard">Dashboard</Link>}
            </div>
        </Container>
    );
}

export default Profile;