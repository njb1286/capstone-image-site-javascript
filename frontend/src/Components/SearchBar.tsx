import { useDispatch } from "react-redux";
import classes from "./SearchBar.module.scss";
import { Dispatch } from "@reduxjs/toolkit";
import { ImageActions } from "../store/images-store";

function SearchBar() {
  const dispatch = useDispatch<Dispatch<ImageActions>>();

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const payload = event.target.value;

    console.log("New value is", payload);

    dispatch({
      type: "SET_SEARCH_VALUE",
      payload,
    })
  }

  return (
    <div className={classes["search-section"]}>
        <input onChange={inputHandler} type="text" className={`form-control ${classes["search-input"]}`} placeholder="Search..." />
    </div>
  )
}

export default SearchBar;