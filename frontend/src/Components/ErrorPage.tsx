type ErrorPageProps = {
  message: string;
}

const ErrorPage = (props: ErrorPageProps) => {
  return <p>{props.message}</p>
}

export default ErrorPage;