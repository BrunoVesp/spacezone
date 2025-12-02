import type { TextareaHTMLAttributes } from 'react';
import './textArea.scss';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    maxHeight?: number;
}

const TextArea = ({ maxHeight, ...rest }: TextAreaProps) => {
    return <textarea
        {...rest}
        style={{ maxHeight: `${maxHeight}px` }}
        autoComplete='off'
        className="textArea"
    />;
};

export default TextArea;