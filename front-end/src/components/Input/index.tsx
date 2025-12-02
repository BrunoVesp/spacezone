import { CiSearch } from 'react-icons/ci';
import { MdOutlineMail } from "react-icons/md";
import { FiLock } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import './input.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'search' | 'email' | 'password' | 'user';
}

const Input = ({ variant, ...rest }: InputProps) => {
    return (
        <div className="inputContainer">
            {variant === 'search' && (
                <div className="iconWrapper">
                    <CiSearch className="icon" />
                </div>
            )}

            {variant === 'user' && (
                <div className="iconWrapper">
                    <FaRegUser className="icon" />
                </div>
            )}

            {variant === 'email' && (
                <div className="iconWrapper">
                    <MdOutlineMail className="icon" />
                </div>
            )}

            {variant === 'password' && (
                <div className="iconWrapper">
                    <FiLock className="icon" />
                </div>
            )}

            <input {...rest} autoComplete='off' />
        </div>
    );
};

export default Input;