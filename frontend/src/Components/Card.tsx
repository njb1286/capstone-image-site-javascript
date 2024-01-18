import { NavLink } from "react-router-dom";
import classes from "./Card.module.scss";
import { ImageItem } from "../store/images-store";
import { backendUrl } from "../store/backend-url";
import { CardFooter, CardHeader, CardText, Image } from "react-bootstrap";

function Card({ title, id, category }: Readonly<ImageItem>) {
  return (
    <NavLink to={`/views?id=${id}`} className={`card text-center ${classes.card}`}>
      <CardHeader className={classes.header}>
        <h2>{title}</h2>
      </CardHeader>
      
      <div className={classes["image-wrapper"]}>
        <Image alt={title} src={`${backendUrl}/get-image?id=${id}`} className={`card-img ${classes.image}`} />
      </div>

      <CardFooter className={classes.footer}>
        <CardText className={classes.category}>Category: {category}</CardText>
      </CardFooter>
    </NavLink>
  );
}

export default Card;