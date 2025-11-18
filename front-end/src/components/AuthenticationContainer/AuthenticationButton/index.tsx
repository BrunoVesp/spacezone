import './authenticationButton.scss';

interface AuthenticationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const AuthenticationButton = ({ children, ...rest }: AuthenticationButtonProps) => {
    return <button {...rest} className="authenticationButton">{children}</button>;
};

export default AuthenticationButton;
