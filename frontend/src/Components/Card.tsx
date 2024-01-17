import { NavLink } from "react-router-dom";
import classes from "./Card.module.scss";
import { ImageItem } from "../store/images/images-store";
import { backendUrl } from "../store/backend-url";

function Card({ title, description, id }: Readonly<ImageItem>) {
  return (
    <NavLink to={`/views?id=${id}`} className={`card text-center ${classes.card}`}>
      <div className={`card-header ${classes.header}`}>
        <h2>{title}</h2>
      </div>
      <img alt={title} src={`${backendUrl}/get-image?id=${id}`} className={`card-img ${classes.image}`} />
      <div className="card-body">
        <p className="card-text text-start">{description.substring(0, 200)}{description.length > 200 ? "..." : ""}</p>
      </div>
    </NavLink>
  );
}

export default Card;