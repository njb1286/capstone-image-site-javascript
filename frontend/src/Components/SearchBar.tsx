import { useDispatch } from "react-redux";
import classes from "./SearchBar.module.scss";
import { ImageActions, categories } from "../store/images-store";
import { InputGroup } from "react-bootstrap";
import CategoriesDropdown from "./CategoriesDropdown";
import { Dispatch } from "@reduxjs/toolkit";

const searchBarCategories = ["All", ...categories] as const;
export type SearchBarCategory = typeof searchBarCategories[number];

function SearchBar() {
  const dispatch = useDispatch<Dispatch<ImageActions>>();


  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const payload = event.target.value;

    dispatch({
      type: "SET_SEARCH_VALUE",
      payload,
    })
  }

  const selectHandler = (category: SearchBarCategory) => {    
    dispatch({
      type: "SET_SELECTED_CATEGORY",
      payload: category,
    })
  }

  return (
    <InputGroup className={classes["search-section"]}>
      <input onChange={inputHandler} type="text" className={`form-control ${classes["search-input"]}`} placeholder="Search..." />
      <CategoriesDropdown onSelect={selectHandler} categories={searchBarCategories} default="All" />
    </InputGroup>
  )
}

export default SearchBar;