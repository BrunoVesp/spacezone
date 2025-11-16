import './errorMessage.scss';

interface ErrorMessageProps {
    children: React.ReactNode;
}

const ErrorMessage = ({ children }: ErrorMessageProps) => {
    return (
        <p className='errorMessage'>{children}</p>
    )
}

export default ErrorMessage;