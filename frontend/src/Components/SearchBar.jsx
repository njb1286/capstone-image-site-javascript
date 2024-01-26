import classes from "./SearchBar.module.scss";
import { categories } from "../store/images-store";
import { InputGroup, Spinner } from "react-bootstrap";
import DropDown from "./DropDown";
import { useEffect, useState } from "react";

const searchBarCategories = ["All", ...categories];

const searchBarSorts = ["Date", "Title", "Category"];

function  SearchBar(props) {
  const [isSearching, setIsSearching] = useState(false);
  const [value, setValue] = useState("");


  useEffect(() => {
    setIsSearching(true);

    const timeout = setTimeout(() => {
      props.onChange?.(value);
      setIsSearching(false);
    }, 350)

    return () => {
      clearTimeout(timeout);
      setIsSearching(false);
    }
  }, [value]);

  const categoryHandler = (category) => {
    props.onSelectCategory?.(category);
  }

  const sortHandler = (sort) => {
    props.onSelectSort?.(sort);
  }

  const inputHandler = (event) => {
    setValue(event.target.value);
  }

  return (
    <div className={classes["search-bar-wrapper"]}>
      <InputGroup className={classes["search-section"]}>
        <input onChange={inputHandler} type="text" className={`form-control ${classes["search-input"]}`} placeholder="Search..." />
        <DropDown title="Sort by" onSelect={sortHandler} categories={searchBarSorts} default="Date" />
        <DropDown title="Filter" onSelect={categoryHandler} categories={searchBarCategories} default="All" />
      </InputGroup>
      {isSearching && <div className={classes["spinner-wrapper"]}><Spinner animation="border" variant="primary" /></div>}
    </div>
  )
}

export default SearchBar;