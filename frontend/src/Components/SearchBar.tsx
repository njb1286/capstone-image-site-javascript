import type { FormEvent } from "react";
import classes from "./SearchBar.module.scss";

function SearchBar() {
  const submitHandler = (event: FormEvent) => {
    event.preventDefault();
    console.log("Submit");
  }

  return (
    <div className={classes["search-section"]}>
      <form className="input-group" onSubmit={submitHandler}>
        <input type="text" className={`form-control ${classes["search-input"]}`} placeholder="Search..." />

        <div className="input-group-append">
          <button type="submit" className={`input-group-text btn btn-primary ${classes["search-btn"]}`} id="">Search</button>
        </div>
      </form>
    </div>
  )
}

export default SearchBar;