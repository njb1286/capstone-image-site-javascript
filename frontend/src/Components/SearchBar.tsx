import { useDispatch } from "react-redux";
import classes from "./SearchBar.module.scss";
import { ImageActions, categories } from "../store/images-store";
import { InputGroup } from "react-bootstrap";
import CategoriesDropdown from "./CategoriesDropdown";

function SearchBar() {
  const dispatch = useDispatch();

  const searchBarCategories = [...categories, "All"] as const;

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    const payload = event.target.value;

    dispatch<ImageActions>({
      type: "SET_SEARCH_VALUE",
      payload,
    })
  }

  return (
    <InputGroup className={classes["search-section"]}>
      <input onChange={inputHandler} type="text" className={`form-control ${classes["search-input"]}`} placeholder="Search..." />
      <CategoriesDropdown categories={searchBarCategories} default="All" />
    </InputGroup>
  )
}

export default SearchBar;