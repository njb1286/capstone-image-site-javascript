import { NavLink } from "react-router-dom";
import classes from "./Card.module.scss";
import { ImageItem } from "../store/images-store";
import { CardFooter, CardHeader, CardText } from "react-bootstrap";
import LazyImage from "./LazyImage";

type CardProps = ImageItem & {
  itemIndex?: number;
}

function Card({ title, id, category }: Readonly<CardProps>) {

  return (
    <NavLink to={`/views?id=${id}`} className={`card text-center ${classes.card}`}>
      <CardHeader className={classes.header}>
        <h2>{title}</h2>
      </CardHeader>

      <LazyImage title={title} id={id} />

      <CardFooter className={classes.footer}>
        <CardText className={classes.category}>Category: {category}</CardText>
      </CardFooter>
    </NavLink>
  );
}

export default Card;