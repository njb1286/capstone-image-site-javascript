import { NavLink } from "react-router-dom";
import classes from "./Card.module.scss";
import { ImageItem } from "../store/images-store";
import { CardFooter, CardHeader, CardText } from "react-bootstrap";
import { useLazyImage } from "../hooks/useLazyImage";
import { useEffect } from "react";

type CardProps<T> = ImageItem & {
  itemIndex?: number;
  stateToListenTo: T;
}

function Card<T>({ title, id, category, stateToListenTo }: Readonly<CardProps<T>>) {

  const [lazyImageComponent, reobserve] = useLazyImage({title, id, size: "medium"});

  useEffect(() => {
    reobserve();
  }, [stateToListenTo])

  return (
    <NavLink to={`/views?id=${id}`} className={`card text-center ${classes.card}`}>
      <CardHeader className={classes.header}>
        <h2>{title}</h2>
      </CardHeader>

      {lazyImageComponent}

      <CardFooter className={classes.footer}>
        <CardText className={classes.category}>Category: {category}</CardText>
      </CardFooter>
    </NavLink>
  );
}

export default Card;