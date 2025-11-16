import { Link } from "react-router-dom"
import './logo.scss';

const Logo = () => {
    return (
        <div className="logo">
            <Link to="/">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/2449px-NASA_logo.svg.png" alt="Logo" />
                <h1>SpaceZone</h1>
            </Link>
        </div>
    )
}

export default Logo;