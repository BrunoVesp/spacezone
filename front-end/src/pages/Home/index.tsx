import Container from "../../components/Container";

import Button from "../../components/Button";
import './home.scss';
import PostsList from "../../components/PostsList";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <div className="backgroundImageContainer">
                <div className="shadow">
                    <div className="texts">
                        <h1><span>Explore</span> o Universo</h1>
                        <h2>Sua porta de entrada para as descobertas mais recentes da exploração espacial e a astronomia</h2>
                        <Link to="/posts">
                            <Button>Explore o Universo</Button>
                        </Link>
                    </div>
                </div>
            </div>
            <Container>
                <div className="gradientBackground">
                    <PostsList postsListTitle="Últimas Atualizações" />
                </div>
            </Container>
        </div>
    );
}

export default Home;