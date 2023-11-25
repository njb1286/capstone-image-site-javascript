import { FC } from "react";
import { NavLink } from "react-router-dom";

import classes from "./HeaderLink.module.scss";

interface HeaderLinkProps {
  title: string;
  path: string;
}

const HeaderLink: FC<HeaderLinkProps> = ({ title, path }) => {
  const linkClass = classes.link;

  return <div className={classes["link-wrapper"]}>
    <NavLink className={({ isActive }) => isActive ? `${classes.active} ${linkClass}` : linkClass} to={path}>{title}</NavLink>
  </div>
}

export default HeaderLink;