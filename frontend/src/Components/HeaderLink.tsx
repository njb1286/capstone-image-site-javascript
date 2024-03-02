import { NavLink } from "react-router-dom";

import classes from "./HeaderLink.module.scss";

type HeaderLinkProps = {
  title: string;
  path: string;
}

function HeaderLink(props: Readonly<HeaderLinkProps>) {
  const linkClass = classes.link;

  return <div className={classes["link-wrapper"]}>
    <NavLink className={({ isActive }) => isActive ? `${classes.active} ${linkClass}` : linkClass} to={props.path}>{props.title}</NavLink>
  </div>
}

export default HeaderLink;