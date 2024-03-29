import { NavLink } from "react-router-dom";
import classes from "./Card.module.scss";
import { CardFooter, CardHeader, CardText } from "react-bootstrap";
import { useLazyImage } from "../hooks/useLazyImage";
import { useEffect } from "react";
import { ImageItem } from "../store/images-store";

interface CardProps<T> extends ImageItem {
  /**
   * The state to listen to for changes. If the state
   * changes, the image will be re-observed
   */
  stateToListenTo: T;
}

function Card<T>(props: Readonly<CardProps<T>>) {
  const { title, id } = props;

  const [lazyImageComponent, reobserve] = useLazyImage(id, title, { size: "medium" });

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