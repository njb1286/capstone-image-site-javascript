import classes from "./Header.module.scss";
import HeaderLink from "./HeaderLink.tsx";

function Header() {
  return <div className={classes["header-wrapper"]}>
    <div className={classes.header}>
      <h1>Image Viewer</h1>
    </div>

    <div className={classes.navigation}>
      <HeaderLink path="/" title="Home" />
      <HeaderLink path="/about" title="About" />
      <HeaderLink path="/upload" title="Upload" />
      <HeaderLink path="/generate-password" title="Generate Password" />
    </div>
  </div>;
}

export default Header;