import Container from "../../components/Container";
import TeamCard from "../../components/TeamCard";
import './aboutUs.scss';
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";

type Team = {
    name?: string;
    login: string;
    avatar_url?: string;
    html_url?: string;
    location?: string;
    bio?: string;
    defaultName?: string;
}

const teamList = [
    { login: "BrunoVesp", defaultName: "Bruno Hebert" },
    { login: "CaioJ12", defaultName: "Caio Justino" },
    { login: "marllonbrenno", defaultName: "Marllon Brenno" },
    { login: "Paulo0675", defaultName: "Paulo Neto" },
];

const AboutUs = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;
        async function fetchGitHubProfiles() {
            setLoading(true);
            setError(null);
            try {
                const requests = teamList.map(t =>
                    axios.get<Team>(`https://api.github.com/users/${t.login}`)
                );
                const responses = await Promise.all(requests);

                const fetched = responses.map((res, idx) => ({
                    ...res.data,
                    login: res.data.login || teamList[idx].login,
                    defaultName: teamList[idx].defaultName,
                }));

                if (mounted) setTeams(fetched);
            } catch (err) {
                console.error("Error fetching GitHub profile:", err);
                if (mounted) setError("Não foi possível carregar a lista de contribuidores do GitHub.");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchGitHubProfiles();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <Container>
            <div className="aboutUs">
                <h1>Nossa Equipe</h1>
                {loading && <LoadingSpinner />}
                {error && <p className="error">{error}</p>}
                <ul className="team-grid">
                    {teams.map(team => (
                        <li key={team.login}>
                            <TeamCard team={team} />
                        </li>
                    ))}
                </ul>
            </div>
        </Container>
    );
}

export default AboutUs;