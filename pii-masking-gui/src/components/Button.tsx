interface Props {
    children: string;
    type ?: any;
    onClick: () => void; 
}

const Button = ({children, type, onClick}: Props) => {
    return (
        <button onClick={onClick} type={type}>{children}</button>
    )

}

export default Button;