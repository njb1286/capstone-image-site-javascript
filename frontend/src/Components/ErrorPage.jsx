import classes from "./ErrorPage.module.scss";

const ErrorPage = (props) => {
  return <p className={classes.error}>{props.message}</p>
}

export default ErrorPage;