import { useEffect, useRef, useState } from "react";
import { backendUrl } from "../store/backend-url";
import classes from "./LazyImage.module.scss";

type LazyImageProps = {
  id: number;
  title: string;
  wrapperClassName?: string;
  imageClassName?: string;
  size?: "small" | "medium" | "large";
}

const LazyImage = ({ id, wrapperClassName, imageClassName, title, size }: LazyImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const elementRef = useRef<HTMLImageElement>(null);
  const [shouldRenderImage, setShouldRenderImage] = useState(false);

  const smallImageUrl = `${backendUrl}/get-image?id=${id}&size=small`;
  const imageUrl = `${backendUrl}/get-image?id=${id}&size=${size ?? "large"}`;

  const imageRendered = useRef(false);

  useEffect(() => {
    if (imageRendered.current) return;

    const smallImage = new Image();
    smallImage.src = smallImageUrl;

    if (!shouldRenderImage) return;

    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      setImageLoaded(true);
    };

    imageRendered.current = true;
  }, [id, shouldRenderImage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setShouldRenderImage(entry.isIntersecting),
      {
        root: null,
        rootMargin: '0px',
        threshold: .4,
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

  let content: JSX.Element | null = <img
    alt={title}
    src={imageUrl}
    loading="lazy"
    className={`${imageClassName} ${classes.image} ${shouldRenderImage ? classes.visible : ""} ${imageLoaded ? classes.loaded : ""}`}
  />;

  if (!shouldRenderImage && !imageRendered.current) {
    content = null;
  }

  return (
    <div ref={elementRef} className={`${wrapperClassName} ${classes["image-wrapper"]}`}>
      <div
        style={{
          backgroundImage: `url(${smallImageUrl})`,
        }}
        className={classes["loading-img"]}
      />

      {content}
    </div>
  )
}

export default LazyImage;