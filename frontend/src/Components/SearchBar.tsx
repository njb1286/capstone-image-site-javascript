import { useDispatch } from "react-redux";
import classes from "./SearchBar.module.scss";
import { categories, imageStore } from "../store/images-store";
import { InputGroup, Spinner } from "react-bootstrap";
import CategoriesDropdown from "./CategoriesDropdown";
import { useEffect, useRef, useState } from "react";
import { getByTitle } from "../store/images-actions";

const searchBarCategories = ["All", ...categories] as const;
export type SearchBarCategory = typeof searchBarCategories[number];

function SearchBar() {
  const dispatch = useDispatch<typeof imageStore.dispatch>();
  const [isSearching, setIsSearching] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isInitial, setIsInitial] = useState(true);

  useEffect(() => {
    if (isInitial) {
      setIsInitial(false);
      return;
    }

    setIsSearching(true);

    const timeout = setTimeout(async () => {
      if (searchValue) {
        await dispatch(getByTitle(searchValue));
      }

      dispatch({
        type: "SET_SEARCH_VALUE",
        payload: searchValue,
      });

      setIsSearching(false);
    }, 350);

    return () => {
      clearTimeout(timeout);
      setIsSearching(false);
    }
  }, [searchValue]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  }

  const selectHandler = (category: SearchBarCategory) => {
    dispatch({
      type: "SET_SELECTED_CATEGORY",
      payload: category,
    });
  }

  return (
    <div className={classes["search-bar-wrapper"]}>
      <InputGroup className={classes["search-section"]}>
        <input onChange={changeHandler} type="text" className={`form-control ${classes["search-input"]}`} placeholder="Search..." />
        <CategoriesDropdown title="Filter" onSelect={selectHandler} categories={searchBarCategories} default="All" />
      </InputGroup>
      {isSearching && <div className={classes["spinner-wrapper"]}><Spinner animation="border" variant="primary" /></div>}
    </div>
  )
}

export default SearchBar;