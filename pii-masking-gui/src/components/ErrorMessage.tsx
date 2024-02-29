interface Props {
    message: String;
}

const ErrorMessage= ({ message }: Props) => (
    <p>{message}</p>
);

export default ErrorMessage;