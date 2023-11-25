import { NavLink } from "react-router-dom";
import classes from "./Card.module.scss";
import { ImageItem } from "../../store/images-store";

function Card({title, description, id: path}: ImageItem) {
  return (
    <NavLink to={path} className={`card text-center ${classes.card}`}>
      <h3 className="card-header">{title}</h3>
      <img src="https://placehold.co/1000x1000" className={`card-img ${classes.image}`}></img>
      <div className="card-body">
        <p className="card-text text-start">{description}</p>
      </div>
    </NavLink>
  );
}

export default Card;