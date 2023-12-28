import { NavLink } from "react-router-dom";
import classes from "./Card.module.scss";
import { ImageItem } from "../store/images-store";

function Card({title, description, id, img}: ImageItem) {
  return (
    <NavLink to={`/views?id=${id}`} className={`card text-center ${classes.card}`}>
      <h3 className="card-header">{title}</h3>
      <img alt={title} src={img} className={`card-img ${classes.image}`}></img>
      <div className="card-body">
        <p className="card-text text-start">{description.substring(0, 200)}{description.length > 200 ? "..." : ""}</p>
      </div>
    </NavLink>
  );
}

export default Card;