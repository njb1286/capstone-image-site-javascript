import { Dropdown } from "react-bootstrap"

import classes from "./DropDown.module.scss"
import { useState } from "react";

/**
 * @template T
 * @template U
 * @typedef DropDownProps
 * @property {T} categories
 * @property {U} default
 * @property {(category: T[number]) => void} [onSelect]
 * @property {string} [title]
 * @property {string} [className]
 */

/**
 * @template T
 * @template U
 * @param {DropDownProps<T, U>} props 
 */

function DropDown(props) {
  /**
   * @type {[T[number], (category: T[number]) => void}
   */
  const [category, setCategory] = useState(props.default);

  /**
   * @param {ReactMouseEvent<HTMLButtonElement>} event 
   */
  const selectCategory = (event) => {
    event.preventDefault();

    /**
     * @type {HTMLButtonElement}
     */
    const element = event.target;

    setCategory(element.textContent);

    props.onSelect?.(element.textContent);
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