import { useEffect, useRef, useState } from "react";
import LoadingPage from "../Components/LoadingPage";
import SearchBar from "../Components/SearchBar";
import classes from "./HomePage.module.scss";
import { useInfiniteLoad } from "../hooks/useInfiniteLoad";
import { backendUrl } from "../store/backend-url";
import { getToken } from "../helpers/token";
import { ImageItem } from "../store/images-store";
import Card from "../Components/Card";

const cardHeight = 600;

const NewHomePage = () => {
  const loadingElementRef = useRef<HTMLDivElement>(null);
  const cardsElementRef = useRef<HTMLDivElement>(null);
  const [cardRenderCount, setCardRenderCount] = useState(9);
  const [mounted, setMounted] = useState(false);

  const { items, renderNext, hasMore } = useInfiniteLoad(
    fetchRequest,
    (item) => item.id,
    {
      renderCount: cardRenderCount,
    }
  );

  const observer = useRef(new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    renderNext();
  }, {
    rootMargin: "0px",
    threshold: 0.1
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  // Make sure the component is mounted before observing the loading element
  useEffect(() => {
    if (!mounted) return;
    if (loadingElementRef.current) {
      observer.current.observe(loadingElementRef.current);
    }

    if (cardsElementRef.current) {
      const cardsElement = cardsElementRef.current;
      const elementHeight = cardsElement.clientHeight;
      

      console.log("Cards Height", elementHeight);
      console.log("Cards Element", cardsElement);
    }
  }, [mounted]);

  async function fetchRequest(offset: number, limit: number) {
    const loadedItems = items
      .map(item => item.id)
      // Ensure that the scope of the loaded items is within the offset and limit
      .filter(id => id >= offset && id <= offset + limit)
      .join(",");

    const response = await fetch(`${backendUrl}/get-slice?offset=${offset}&limit=${limit}`, {
      method: "GET",
      headers: {
        token: getToken() ?? "",
        loadedItems,
      }
    });

    const data = await response.json() as { hasMore: boolean, data: ImageItem[] };

    return data;
  }

  return (
    <>
      <SearchBar />
      <div className={classes["cards-wrapper"]} ref={cardsElementRef}>
        <div className={`${classes.cards} ${classes.grid}`}>
          {items.map((item, index) => {
            return <Card {...item} itemIndex={index} stateToListenTo={items} key={`card_${index}`} />
          })}
        </div>
        <LoadingPage ref={loadingElementRef} fullScreen={false} className={`${classes["loading-images"]} ${hasMore ? classes.visible : ""}`} />
      </div>
    </>
  )
}

export default NewHomePage;