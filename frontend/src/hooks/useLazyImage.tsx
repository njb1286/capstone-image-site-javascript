import { useEffect, useRef, useState } from "react";
import { backendUrl } from "../store/backend-url";
import classes from "./LazyImage.module.scss";
import { Spinner } from "react-bootstrap";

type LazyImageOptions = {
  wrapperClassName?: string;
  imageClassName?: string;
  loadingImageClassName?: string
  size?: "small" | "medium" | "large";
  defaultImageShouldLoad?: boolean;
}

// This keeps the images loaded in memory so they don't have to be re-fetched when this component un-renders
const loadedImages = new Set<HTMLImageElement>();

const loadImage = (src: string, onLoad?: () => void) => {
  const image = new Image();
  image.src = src;

  loadedImages.add(image);

  if (onLoad) {
    image.onload = onLoad;
  }
};

/**
 * 
 * @param id - The id of the image
 * @param title - The title of the image
 * @param options - An object with the following properties:
 * - wrapperClassName: The class name for the wrapper div
 * - imageClassName: The class name for the image
 * - loadingImageClassName: The class name for the loading image
 * - size: The size of the image to load. Can be "small", "medium", or "large"
 * - defaultImageShouldLoad: A boolean that determines if the image should load by default
 * 
 * @returns A tuple with the following properties:
 * - The first element is the component to render
 * - The second element is a function that re-observes the image
 */

export const useLazyImage = (id: number, title: string, options: LazyImageOptions = {
  wrapperClassName: "",
  imageClassName: "",
  loadingImageClassName: "",
  size: "large",
  defaultImageShouldLoad: false,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [shouldRenderImage, setShouldRenderImage] = useState(options.defaultImageShouldLoad ?? false);
  
  const smallImageUrl = `${backendUrl}/get-image?id=${id}&size=small`;
  const imageUrl = `${backendUrl}/get-image?id=${id}&size=${options.size ?? "large"}`;
  
  const elementRef = useRef<HTMLImageElement>(null);
  const imageRendered = useRef(false);
  const observerRef = useRef(new IntersectionObserver(([entry]) => {
    setShouldRenderImage(entry.isIntersecting);
  }, {
    root: null,
    rootMargin: '0px',
    threshold: .1,
  }));

  useEffect(() => {
    if (imageRendered.current) return;

    loadImage(smallImageUrl);

    if (!shouldRenderImage) return;

    loadImage(imageUrl, () => {
      setImageLoaded(true);
    });

    imageRendered.current = true;
  }, [id, shouldRenderImage]);

  // This useEffect hook is used to observe the image element on mount
  useEffect(() => {
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
    if (!elementRef.current) return;

    observerRef.current.unobserve(elementRef.current);
    observerRef.current.observe(elementRef.current);
  }

  let content: JSX.Element | null = <img
    alt={title}
    src={imageUrl}
    loading="lazy"
    className={`${options.imageClassName} ${classes.image} ${shouldRenderImage ? classes.visible : ""} ${imageLoaded ? classes.loaded : ""}`}
  />;

  if (!shouldRenderImage && !imageRendered.current) {
    content = null;
  }

  const component = <div ref={elementRef} className={`${options.wrapperClassName} ${classes["image-wrapper"]}`}>

    <div className={`${classes["loading-img"]} ${options.loadingImageClassName}`}>
      <img src={smallImageUrl} alt={title} />
    </div>
    <div className={classes["spinner-wrapper"]}><Spinner className={classes.spinner} variant="primary" animation="border" /></div>

    {content}
  </div>

  return [component, reobserve] as const;
}