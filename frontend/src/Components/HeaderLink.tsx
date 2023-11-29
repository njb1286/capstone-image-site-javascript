import { NavLink } from "react-router-dom";

import classes from "./HeaderLink.module.scss";

type HeaderLinkProps = {
  title: string;
  path: string;
}

function HeaderLink({ title, path }: Readonly<HeaderLinkProps>) {
  const linkClass = classes.link;

  return <div className={classes["link-wrapper"]}>
    <NavLink className={({ isActive }) => isActive ? `${classes.active} ${linkClass}` : linkClass} to={path}>{title}</NavLink>
  </div>
}

export default HeaderLink;