import classes from "./SearchBar.module.scss";
import { categories } from "../types/category";
import { InputGroup, Spinner } from "react-bootstrap";
import DropDown from "./DropDown";
import { ChangeEvent, useEffect, useState } from "react";

import * as Category from "../types/category";
import * as Sort from "../types/sortBy";

const searchBarCategories = [Category.ALL, ...categories];

const searchBarSorts = [Sort.DATE, Sort.TITLE, Sort.CATEGORY];

/**
 * @param {{
 *  onChange?: (value: string) => void;
 * onSelectCategory?: (category: SearchBarCategory) => void;
 * onSelectSort?: (sort: SearchBarSort) => void;
 * }} props 
 */

function SearchBar(props) {
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

  /**
   * @param {Category} category 
   */
  const categoryHandler = (category) => {
    props.onSelectCategory?.(category);
  }

  /**
   * @param {SearchBarSort} sort 
   */
  const sortHandler = (sort) => {
    props.onSelectSort?.(sort);
  }

  /**
   * @param {ChangeEvent<HTMLInputElement>} event 
   */
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