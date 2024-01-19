import classes from "./ErrorPage.module.scss";

type ErrorPageProps = {
  message: string;
}

const ErrorPage = (props: ErrorPageProps) => {
  return <p className={classes.error}>{props.message}</p>
}

export default ErrorPage;