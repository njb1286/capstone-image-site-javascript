import { NavLink } from "react-router-dom";
import classes from "./Card.module.scss";
import { ImageItem } from "../store/images-store";
import { backendUrl } from "../store/backend-url";

function Card({ title, id }: Readonly<ImageItem>) {
  return (
    <NavLink to={`/views?id=${id}`} className={`card text-center ${classes.card}`}>
      <div className={`card-header ${classes.header}`}>
        <h2>{title}</h2>
      </div>
      <div className={classes["image-wrapper"]}>
      <img alt={title} src={`${backendUrl}/get-image?id=${id}`} className={`card-img ${classes.image}`} />
      </div>
    </NavLink>
  );
}

export default Card;