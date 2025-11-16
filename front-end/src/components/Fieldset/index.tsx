import './fieldset.scss';

interface FieldsetProps {
    children: React.ReactNode;
}

const Fieldset = ({ children }: FieldsetProps) => {
    return (
        <fieldset className='fieldset'>{children}</fieldset>
    );
}

export default Fieldset;