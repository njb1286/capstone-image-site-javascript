import { useDispatch } from "react-redux";
import classes from "./SearchBar.module.scss";
import { Dispatch } from "@reduxjs/toolkit";
import { ImageActions } from "../store/images-store";
import { KeyboardEvent } from "react";

function SearchBar() {
  const dispatch = useDispatch<Dispatch<ImageActions>>();

  const inputHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    event.preventDefault();
  }

  return (
    <div className={classes["search-section"]}>
        <input onKeyUp={inputHandler} type="text" className={`form-control ${classes["search-input"]}`} placeholder="Search..." />
    </div>
  )
}

export default SearchBar;