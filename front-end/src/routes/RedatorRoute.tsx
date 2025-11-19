import { Navigate } from "react-router-dom";

const RedatorRoute = ({ children }: { children: React.ReactNode }) => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("user");

    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    const parsedUser = JSON.parse(user);

    if (!parsedUser.isRedator) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RedatorRoute;
