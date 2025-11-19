import type { TextareaHTMLAttributes } from 'react';
import './textArea.scss';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextArea = (props: TextAreaProps) => {
    return <textarea autoComplete='off' className="textArea" {...props} />;
};

export default TextArea;