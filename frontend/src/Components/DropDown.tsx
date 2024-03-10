import { Dropdown } from "react-bootstrap"

import classes from "./DropDown.module.scss"
import { useState } from "react";

type DropDownProps<T extends readonly string[]> = {
  categories: T;
  defaultValue: T[number];
  onSelect?: (category: T[number]) => void;
  title?: string;
  className?: string;
}

function DropDown<T extends readonly string[]>({ categories, defaultValue, onSelect, title, className }: Readonly<DropDownProps<T>>) {
  const [category, setCategory] = useState<T[number]>(defaultValue);

  const selectCategory = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    const element = event.target as HTMLButtonElement;

    setCategory(element.textContent as T[number]);

    onSelect?.(element.textContent as T[number]);
  }

  return (
    <Dropdown className={`${classes.dropdown} ${className ?? ""}`}>
      <Dropdown.Toggle className={classes.categories}>
        {title && `${title}: `}{category}
      </Dropdown.Toggle>

      <Dropdown.Menu className={`dropdown-menu ${classes.menu}`}>
        {categories.map(categoryItem => {
          return <Dropdown.Item className={`${classes["category-item"]} ${category.toLowerCase() === categoryItem.toLowerCase() ? classes.active : ""}`} as={"button"} onClick={selectCategory} key={`category_${categoryItem}`}>{categoryItem}</Dropdown.Item>
        })}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default DropDown;