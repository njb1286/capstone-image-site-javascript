import classes from "./SearchBar.module.scss";
import { categories } from "../store/images-store";
import { InputGroup, Spinner } from "react-bootstrap";
import DropDown from "./DropDown";
import { ChangeEvent, useEffect, useState } from "react";

const searchBarCategories = ["All", ...categories] as const;
export type SearchBarCategory = typeof searchBarCategories[number];

const searchBarSorts = ["Date", "Title", "Category"] as const;
export type SearchBarSort = typeof searchBarSorts[number];

type SearchBarProps = {
  onChange?: (value: string) => void;
  onSelectCategory?: (category: SearchBarCategory) => void;
  onSelectSort?: (sort: SearchBarSort) => void;
}

function SearchBar(props: Readonly<SearchBarProps>) {
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

  const categoryHandler = (category: SearchBarCategory) => {
    props.onSelectCategory?.(category);
  }

  const sortHandler = (sort: SearchBarSort) => {
    props.onSelectSort?.(sort);
  }

  const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
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