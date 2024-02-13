import { NavLink } from "react-router-dom";
import classes from "./Card.module.scss";
import { CardFooter, CardHeader, CardText } from "react-bootstrap";
import { useLazyImage } from "../hooks/useLazyImage";
import { useEffect } from "react";
import { ImageItem } from "../store/images-store";

/**
 * @template T
 * @typedef {Object} CardProps
 * @property {number | undefined} itemIndex
 * @property {T} stateToListenTo
 */

/**
 * @template T
 * @param {CardProps<T> & ImageItem} props
 */

type CardProps<T> = {
  itemIndex: number | undefined;
  stateToListenTo: T;
} & ImageItem;

function Card<T>(props: CardProps<T>) {
  const { title, id } = props;

  const [lazyImageComponent, reobserve] = useLazyImage({title, id, size: "medium"});

  useEffect(() => {
    reobserve();
  }, [props.stateToListenTo])

  return (
    <NavLink to={`/views?id=${id}`} className={`card text-center ${classes.card}`}>
      <CardHeader className={classes.header}>
        <h2>{props.title}</h2>
      </CardHeader>

      {lazyImageComponent}

      <CardFooter className={classes.footer}>
        <CardText className={classes.category}>Category: {props.category}</CardText>
      </CardFooter>
    </NavLink>
  );
}

export default Card;