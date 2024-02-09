import { NavLink } from "react-router-dom";
import classes from "./PageNotFound.module.scss";
import { FaSearch } from "react-icons/fa";

/**
 * 
 * @param {{ message: string, hasLink?: boolean }} props 
 * @returns 
 */
const PageNotFound = ({ message, hasLink }) => {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <FaSearch className={classes.icon} />
        <p className={classes.message}>{message}</p>
        {hasLink && <NavLink className={classes.link} to="/">Return to home</NavLink>}
      </div>
    </div>
  )
}

export default PageNotFound;