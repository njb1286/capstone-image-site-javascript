import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";

import classes from "./HomePage.module.scss";

import Card from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import ErrorPage from "../Components/ErrorPage";
import { ImageState, imageStore } from "../store/images-store";
import { getImageSlice } from "../store/images-actions";

const cardHeight = 600;

function HomePage() {
  const searchValue = useSelector((state: ImageState) => state.searchValue);
  const selectedCategory = useSelector((state: ImageState) => state.selectedCategory);
  const hasMore = useSelector((state: ImageState) => state.hasMoreItems);
  const imageItems = useSelector((state: ImageState) => state.imageItems);
  const dispatch = useDispatch<typeof imageStore.dispatch>();

  const cardsRef = useRef<HTMLDivElement>(null);

  const [cardsInViewHeight, setCardsInViewHeight] = useState<number | null>(null);

  const cardsPerRow = useRef(3);
  const cardsOverflowCount = useRef(6);
  const cardsRendered = useRef(0);

  function getCardsInView(element: HTMLElement) {
    const result = Math.max(Math.ceil(element.clientHeight / cardHeight * cardsPerRow.current), cardsPerRow.current);

    return Math.ceil(result / 3) * 3;
  }

  const updateCardData = () => {
    if (window.innerWidth < 768) {
      cardsPerRow.current = 1;
      cardsOverflowCount.current = 3;
      return;
    }

    cardsPerRow.current = 3;
    cardsOverflowCount.current = 6;
  }

  const initialRender = (cardsInHeight: number) => {
    cardsRendered.current = cardsInHeight + cardsOverflowCount.current;
    
    dispatch(getImageSlice(0, cardsRendered.current));
  }

  const renderNextCards = () => {
    console.log("Offset", cardsRendered.current + 1, "Count", cardsOverflowCount.current);
    
    dispatch(getImageSlice(cardsRendered.current + 1, cardsOverflowCount.current));

    cardsRendered.current += cardsOverflowCount.current;
  }

  useEffect(() => {
    if (cardsRef.current) {
      const cardCount = getCardsInView(cardsRef.current);

      initialRender(cardCount);

      updateCardData();
      setCardsInViewHeight(cardCount + cardsOverflowCount.current);

      window.addEventListener("resize", () => {
        updateCardData();

        const cardsCount = getCardsInView(cardsRef.current!)
        setCardsInViewHeight(cardsCount + cardsOverflowCount.current);
      })
    }
  }, []);

  const filteredImageItems = useMemo(() => {
    return imageItems.filter(item => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = !searchValue || item.title.toLowerCase().includes(searchValue.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchValue, imageItems]);

  const content = !filteredImageItems.length ? (
    <ErrorPage message="No images found" />
  ) : (
    <>{filteredImageItems.map(item => {
      return <Card {...item} key={item.id} />;
    })}</>
  );

  return (
    <>
      {hasMore && <button onClick={renderNextCards}>Load more images</button>}
      <SearchBar />
      <div className={classes.cards} ref={cardsRef}>
        {content}
      </div>
    </>
  );
}

export default HomePage;