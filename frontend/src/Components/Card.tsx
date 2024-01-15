import { NavLink } from "react-router-dom";
import classes from "./Card.module.scss";
import { ImageItem } from "../store/images-store";
import { backendUrl } from "../store/backend-url";

function Card({ title, description, id }: Readonly<ImageItem>) {
  return (
    <NavLink to={`/views?id=${id}`} className={`card text-center ${classes.card}`}>
      <h3 className="card-header">{title}</h3>
      <div className={classes["body-content"]}>
        <div className={classes["image-wrapper"]}>
          <img alt={title} src={`${backendUrl}/get-image?id=${id}`} className={`card-img ${classes.image}`} />
        </div>
        <div className="card-body">
          <p className="card-text text-start">{description.substring(0, 200)}{description.length > 200 ? "..." : ""}</p>
        </div>
      </div>
    </NavLink>
  );
}

export default Card;