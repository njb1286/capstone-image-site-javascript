import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";

import classes from "./HomePage.module.scss";

import Card from "../Components/Card";
import SearchBar from "../Components/SearchBar";
import ErrorPage from "../Components/ErrorPage";
import { ImageState, imageStore } from "../store/images-store";
import { getCategoryItems, getImageSlice } from "../store/images-actions";
import LoadingPage from "../Components/LoadingPage";

const cardHeight = 600;

function HomePage() {
  const searchValue = useSelector((state: ImageState) => state.searchValue);
  const selectedCategory = useSelector((state: ImageState) => state.selectedCategory);
  const hasMore = useSelector((state: ImageState) => state.hasMoreItems);
  const imageItems = useSelector((state: ImageState) => state.imageItems);
  const dispatch = useDispatch<typeof imageStore.dispatch>();
  const [loadingImages, setLoadingImages] = useState(false);

  const cardsRef = useRef<HTMLDivElement>(null);

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

    if (imageItems.length >= cardsRendered.current) return;    

    dispatch(getImageSlice(imageItems.length, cardsRendered.current));
  }

  const renderNextCards = () => {    
    const doneLoading = () => {
      setLoadingImages(false);
    }

    dispatch(getImageSlice(cardsRendered.current + 1, cardsOverflowCount.current, doneLoading));

    cardsRendered.current += cardsOverflowCount.current;
  }

  useEffect(() => {
    if (!hasMore) return;

    if (selectedCategory === "All") return;

    dispatch(getCategoryItems(selectedCategory));
  }, [selectedCategory]);

  useEffect(() => {
    if (!hasMore) return;

    updateCardData();

    if (cardsRef.current) {
      const cardCount = getCardsInView(cardsRef.current);

      initialRender(cardCount);

      updateCardData();

      window.addEventListener("resize", () => {
        updateCardData();
      });
    }
  }, []);

  const scrollHandler = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const element = event.target as HTMLDivElement;

    if (Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 50 && !loadingImages) {
      setLoadingImages(true);
      renderNextCards();
    }
  }

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
    <>
      {filteredImageItems.map(item => {
        return <Card {...item} key={item.id} />;
      })}
      {hasMore && selectedCategory === "All" && !searchValue && <LoadingPage fullScreen={false} className={classes["loading-images"]} />}
    </>
  );

  return (
    <>
      <SearchBar />
      <div onScroll={scrollHandler} className={classes.cards} ref={cardsRef}>
        {content}

      </div>
    </>
  );
}

export default HomePage;