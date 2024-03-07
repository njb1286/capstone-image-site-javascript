import classes from "./SearchBar.module.scss";
import { InputGroup, Spinner } from "react-bootstrap";
import DropDown from "./DropDown";
import { ChangeEvent, useRef, useState } from "react";
import { categories } from "../store/images-store";

const searchBarCategories = ["All", ...categories] as const;

const searchBarSorts = ["Date", "Title", "Category"] as const;

type SearchBarSort = typeof searchBarSorts[number];
type SearchBarCategory = typeof searchBarCategories[number];

type SearchBarProps = {
  onChange?: (value: string) => void;
  onSelectCategory?: (category: SearchBarCategory) => void;
  onSelectSort?: (sort: SearchBarSort) => void;
}

function SearchBar(props: Readonly<SearchBarProps>) {
  const [isSearching, setIsSearching] = useState(false);
  // Use a ref so I can clear the timeout on each keystroke
  const timeout = useRef<number | undefined>(undefined);

  const categorySelectHandler = (category: SearchBarCategory) => {
    props.onSelectCategory?.(category);
  }

  const sortSelectHandler = (sort: SearchBarSort) => {
    props.onSelectSort?.(sort);
  }

  const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(timeout.current);

    setIsSearching(true);
    timeout.current = setTimeout(() => {
      props.onChange?.(event.target.value);
      setIsSearching(false);
    }, 350);
  }

  return (
    <div className={classes["search-bar-wrapper"]}>
      <InputGroup className={classes["search-section"]}>
        <input 
          onChange={inputHandler} 
          type="text" 
          className={`form-control ${classes["search-input"]}`} 
          placeholder="Search..." 
        />
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