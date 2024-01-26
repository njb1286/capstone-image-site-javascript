import { NavLink } from "react-router-dom";

import classes from "./HeaderLink.module.scss";

/**
 * @param {{
 *  title: string;
 *  path: string;
 * }} props
 */

function HeaderLink(props) {
  const linkClass = classes.link;

  return <div className={classes["link-wrapper"]}>
    <NavLink className={({ isActive }) => isActive ? `${classes.active} ${linkClass}` : linkClass} to={props.path}>{props.title}</NavLink>
  </div>
}

export default HeaderLink;