import { FaGithub, FaMapMarkerAlt } from "react-icons/fa";
import './teamCard.scss';

type Team = {
    name?: string;
    login: string;
    avatar_url?: string;
    html_url?: string;
    location?: string;
    bio?: string;
    defaultName?: string;
}

type Props = {
    team: Team;
}

const TeamCard = ({ team }: Props) => {
    const avatar = team.avatar_url || `https://github.com/${team.login}.png`;
    const name = team.name || team.defaultName || team.login;
    const profileUrl = team.html_url || `https://github.com/${team.login}`;

    return (
        <article className="team-card" aria-label={name}>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="avatar-link">
                <img src={avatar} alt={`${name} avatar`} className="avatar" />
            </a>
            <div className="team-info">
                <a href={profileUrl} target="_blank" rel="noopener noreferrer" className="team-name">
                    {name}
                    <FaGithub className="github-icon" />
                </a>
                {team.location && (
                    <div className="team-location">
                        <FaMapMarkerAlt /> <span>{team.location}</span>
                    </div>
                )}
                {team.bio && <p className="team-bio">{team.bio}</p>}
            </div>
        </article>
    );
}

export default TeamCard;