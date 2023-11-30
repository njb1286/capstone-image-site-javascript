import classes from "./Header.module.scss";
import HeaderLink from "./HeaderLink";

function Header() {
  return <div className={classes["header-wrapper"]}>
    <div className={classes.header}>
      <h1>Image Viewer</h1>
    </div>

    <div className={classes.navigation}>
      <HeaderLink path="/" title="Home" />
      <HeaderLink path="/about" title="About" />
    </div>
  </div>;
}

export default Header;