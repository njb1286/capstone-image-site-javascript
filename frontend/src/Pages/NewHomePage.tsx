import { useEffect, useRef, useState } from "react";
import LoadingPage from "../Components/LoadingPage";
import SearchBar from "../Components/SearchBar";
import classes from "./HomePage.module.scss";
import { useInfiniteLoad } from "../hooks/useInfiniteLoad";
import { backendUrl } from "../store/backend-url";
import { getToken } from "../helpers/token";
import { ImageItem } from "../store/images-store";
import Card from "../Components/Card";
import { useConsecutiveLoad } from "../hooks/useConsecutiveLoad";

const cardHeight = 600;
const cardWidth = 455;

const NewHomePage = () => {
  const loadingElementRef = useRef<HTMLDivElement>(null);
  const cardsElementRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  // const { items, renderNext, hasMore, setCardRenderCount, initialRender } = useInfiniteLoad(
  //   fetchRequest,
  //   (item) => item.id,
  //   {
  //     renderCount: 9,
  //   }
  // );

  const { items, renderNext, hasMore } = useConsecutiveLoad({ defaultCategory: "All" });

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
      const cardsInWidth = Math.floor(cardsElement.clientWidth / cardWidth);
      const cardsInHeight = Math.floor(elementHeight / cardHeight) + 3;

      const cardsToRender = cardsInWidth * cardsInHeight;

      // setCardRenderCount(cardsToRender);
      // initialRender(cardsToRender);
      // renderNext(cardsToRender);
    }

  }, [mounted]);

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