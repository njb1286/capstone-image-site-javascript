import classes from "./SearchBar.module.scss";
import { categories } from "../types/category";
import { InputGroup, Spinner } from "react-bootstrap";
import DropDown from "./DropDown";
import { ChangeEvent, useRef, useState } from "react";

import * as Category from "../types/category";
import * as Sort from "../types/sortBy";

const searchBarCategories = [Category.ALL, ...categories] as const;

const searchBarSorts = [Sort.DATE, Sort.TITLE, Sort.CATEGORY] as const;

type SearchBarSort = typeof searchBarSorts[number];
type SearchBarCategory = typeof searchBarCategories[number];

/**
 * @param {{
 *  onChange?: (value: string) => void;
 *  onSelectCategory?: (category: SearchBarCategory) => void;
 *  onSelectSort?: (sort: SearchBarSort) => void;
 * }} props 
 */

type SearchBarProps = {
  onChange?: (value: string) => void;
  onSelectCategory?: (category: SearchBarCategory) => void;
  onSelectSort?: (sort: SearchBarSort) => void;
}

function SearchBar({ onChange, onSelectCategory, onSelectSort }: Readonly<SearchBarProps>) {
  const [isSearching, setIsSearching] = useState(false);
  // Use a ref so I can clear the timeout on each keystroke
  const timeout = useRef<number | undefined>(undefined);

  /**
   * @param {Category} category 
   */
  const categorySelectHandler = (category: SearchBarCategory) => {
    onSelectCategory?.(category);
  }

  /**
   * @param {SearchBarSort} sort 
   */
  const sortSelectHandler = (sort: SearchBarSort) => {
    onSelectSort?.(sort);
  }

  /**
   * @param {ChangeEvent<HTMLInputElement>} event 
   */
  const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeout.current);

    setIsSearching(true);
    timeout.current = setTimeout(() => {
      onChange?.(event.target.value);
      setIsSearching(false);
    }, 350);
  }

  return (
    <div className={classes["search-bar-wrapper"]}>
      <InputGroup className={classes["search-section"]}>
        <input onChange={inputHandler} type="text" className={`form-control ${classes["search-input"]}`} placeholder="Search..." />
        <DropDown title="Sort by" onSelect={sortSelectHandler} categories={searchBarSorts} defaultValue="Date" />
        <DropDown title="Filter" onSelect={categorySelectHandler} categories={searchBarCategories} defaultValue="All" />
      </InputGroup>
      {isSearching && (
        <div className={classes["spinner-wrapper"]}>
          <Spinner animation="border" variant="primary" />
        </div>
      )}
    </div>
  )
}

export default SearchBar;