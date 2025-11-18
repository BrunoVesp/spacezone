import './button.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

const Button = ({ children, ...rest }: ButtonProps) => {
    return <button {...rest} className="button">{children}</button>;
};

export default Button;
