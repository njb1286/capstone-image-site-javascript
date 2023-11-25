import { NavLink } from "react-router-dom";
import classes from "./Header.module.scss";
import { FormEvent } from "react";
import HeaderLink from "./Helpers/HeaderLink";

// import { motion } from "framer-motion";

function Header() {
  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    console.log("Submit");
  }

  return <div className={classes["header-wrapper"]}>
    <div className={classes.header}>
      <h1>Image Viewer</h1>
    </div>

    <div className={classes["search-section"]}>
      <form className="input-group" onSubmit={submitHandler}>
        <input type="text" className={`form-control ${classes["search-input"]}`} placeholder="Search..." />

        <div className="input-group-append">
          <button type="submit" className={`input-group-text btn btn-primary ${classes["search-btn"]}`} id="">Search</button>
        </div>
      </form>
    </div>

    <div className={classes.navigation}>
      <HeaderLink path="/" title="Home" />
      <HeaderLink path="/about" title="About" />
      <HeaderLink path="/how-to-install" title="How To Install" />
    </div>
  </div>;
}

export default Header;