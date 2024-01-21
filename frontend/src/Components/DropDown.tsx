import { Dropdown } from "react-bootstrap"

import classes from "./DropDown.module.scss"
import { useState } from "react";

type DropDownProps<T extends readonly string[], U extends T[number]> = {
  categories: T;
  default: U;
  onSelect?: (category: T[number]) => void;
  title?: string;
  className?: string;
}

function DropDown<T extends readonly string[], U extends T[number]>(props: Readonly<DropDownProps<T, U>>) {
  const [category, setCategory] = useState<T[number]>(props.default);

  const selectCategory = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    const element = event.target as HTMLButtonElement;

    setCategory(element.textContent as T[number]);

    props.onSelect?.(element.textContent as T[number]);
  }

  return (
    <Dropdown className={`${classes.dropdown} ${props.className ?? ""}`}>
      <Dropdown.Toggle className={classes.categories}>
        {props.title && `${props.title}: `}{category}
      </Dropdown.Toggle>

      <Dropdown.Menu className={`dropdown-menu ${classes.menu}`}>
        {props.categories.map(categoryItem => {
          return <Dropdown.Item className={`${classes["category-item"]} ${category.toLowerCase() === categoryItem.toLowerCase() ? classes.active : ""}`} as={"button"} onClick={selectCategory} key={`category_${categoryItem}`}>{categoryItem}</Dropdown.Item>
        })}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default DropDown;