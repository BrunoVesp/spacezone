import PostsList from "../../components/PostsList";
import Container from "../../components/Container";

const Home = () => {
    return (
        <div>
            <Container>
                <PostsList postsListTitle="Últimas Atualizações" />
            </Container>
        </div>
    );
}

export default Home;