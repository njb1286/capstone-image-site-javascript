import { useEffect, useRef, useState } from "react";
import { backendUrl } from "../store/backend-url";
import classes from "./LazyImage.module.scss";
import { Spinner } from "react-bootstrap";

/**
 * @typedef {{
 *   id: number;
 *   title: string;
 *   wrapperClassName?: string;
 *   imageClassName?: string;
 *   loadingImageClassName?: string;
 *   size?: "small" | "medium" | "large";
 *   defaultImageShouldLoad?: boolean;
 * }} LazyImageProps
 */

/**
 * @param {LazyImageProps} props 
 * @returns {[JSX.Element, () => void]}
 */

export const useLazyImage = (props) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const elementRef = useRef(null);
  const [shouldRenderImage, setShouldRenderImage] = useState(props.defaultImageShouldLoad ?? false);

  const smallImageUrl = `${backendUrl}/get-image?id=${props.id}&size=small`;
  const imageUrl = `${backendUrl}/get-image?id=${props.id}&size=${props.size ?? "large"}`;

  const imageRendered = useRef(false);

  /** @type {MutableRefObject<IntersectionObserver | null>} */
  const observerRef = useRef(null);

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
  }, [props.id, shouldRenderImage]);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setShouldRenderImage(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: .1,
      }
    );

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      // Clean up the observer when the component unmounts.
      if (elementRef.current) {
        observerRef.current.unobserve(elementRef.current);
      }
    };
  }, []);

  const reobserve = () => {
    observerRef.current.unobserve(elementRef.current);
    observerRef.current.observe(elementRef.current);
  }

  let content = <img
    alt={props.title}
    src={imageUrl}
    loading="lazy"
    className={`${props.imageClassName ?? ""} ${classes.image} ${shouldRenderImage ? classes.visible : ""} ${imageLoaded ? classes.loaded : ""}`}
  />;

  if (!shouldRenderImage && !imageRendered.current) {
    content = null;
  }

  const component = <div ref={elementRef} className={`${props.wrapperClassName} ${classes["image-wrapper"]}`}>

    <div className={`${classes["loading-img"]} ${props.loadingImageClassName ?? ""}`}>
      <img src={smallImageUrl} alt={props.title} />
    </div>
    <div className={classes["spinner-wrapper"]}><Spinner className={classes.spinner} variant="primary" animation="border" /></div>

    {content}
  </div>

  return [component, reobserve];
}