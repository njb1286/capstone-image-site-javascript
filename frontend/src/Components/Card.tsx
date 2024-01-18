import { NavLink } from "react-router-dom";
import classes from "./Card.module.scss";
import { ImageItem } from "../store/images-store";
import { backendUrl } from "../store/backend-url";
import { CardFooter, CardHeader, CardText } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";

function Card({ title, id, category }: Readonly<ImageItem>) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageWrapperClass = classes["image-wrapper"];

  const imageLoadHandler = useCallback(() => {
    setImageLoaded(true);
  }, [setImageLoaded]);
  useEffect(() => {
    const image = document.createElement("img");
    image.src = `${backendUrl}/get-image?id=${id}`;
    image.onload = imageLoadHandler;

    return () => {
      image.onload = null;
    }
  }, [id, backendUrl, imageLoadHandler]);

  return (
    <NavLink to={`/views?id=${id}`} className={`card text-center ${classes.card}`}>
      <CardHeader className={classes.header}>
        <h2>{title}</h2>
      </CardHeader>

      <div id="image" className={imageWrapperClass}>

        <img
          loading="lazy"
          alt={title}
          src={`${backendUrl}/get-image?id=${id}`}
          className={`card-img ${classes.image} ${imageLoaded ? classes.loaded : ""}`}
        />
        <div className={classes["loading-img"]} style={{
          backgroundImage: `url(${backendUrl}/get-small-image?id=${id})`,
        }} />
      </div>

      <CardFooter className={classes.footer}>
        <CardText className={classes.category}>Category: {category}</CardText>
      </CardFooter>
    </NavLink>
  );
}

export default Card;