import { useEffect, useRef, useState } from "react";
import { backendUrl } from "../store/backend-url";
import classes from "./LazyImage.module.scss";

type LazyImageProps = {
  id: number;
  title: string;
  wrapperClassName?: string;
  imageClassName?: string;
}

const LazyImage = ({ id, wrapperClassName, imageClassName, title }: LazyImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const elementRef = useRef<HTMLImageElement>(null);
  const [shouldRenderImage, setShouldRenderImage] = useState(false);

  const smallImageUrl = `${backendUrl}/get-small-image?id=${id}`;
  const imageUrl = `${backendUrl}/get-image?id=${id}`;

  useEffect(() => {
    const smallImage = new Image();
    smallImage.src = smallImageUrl;

    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      setImageLoaded(true);
    };
  }, [id]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShouldRenderImage(entry.isIntersecting),
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      // Clean up the observer when the component unmounts.
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, []);

  return (
    <div ref={elementRef} className={`${wrapperClassName} ${classes["image-wrapper"]}`}>
      <div
        style={{
          backgroundImage: `url(${smallImageUrl})`,
        }}
        className={classes["loading-img"]}
      />

      {shouldRenderImage && <img
        alt={title}
        src={imageUrl}
        loading="lazy"
        className={`${imageClassName} ${classes.image} ${imageLoaded ? classes.loaded : ""}`}
      />}
    </div>
  )
}

export default LazyImage;