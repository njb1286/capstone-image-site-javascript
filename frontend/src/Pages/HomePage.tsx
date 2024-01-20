import { useDispatch, useSelector } from "react-redux";
import { ChangeEvent, UIEvent, useEffect, useMemo, useRef, useState } from "react";

import classes from "./HomePage.module.scss";

import Card from "../Components/Card";
import SearchBar, { SearchBarCategory } from "../Components/SearchBar";
import ErrorPage from "../Components/ErrorPage";
import { ImageState, imageStore } from "../store/images-store";
import { getCategoryItems, getImageSlice } from "../store/images-actions";
import LoadingPage from "../Components/LoadingPage";

const cardHeight = 600;

function HomePage() {
  const hasMore = useSelector((state: ImageState) => state.hasMoreItems);
  const imageItems = useSelector((state: ImageState) => state.imageItems);
  const loadedCategories = useSelector((state: ImageState) => state.loadedCategories);
  const dispatch = useDispatch<typeof imageStore.dispatch>();
  const [loadingImages, setLoadingImages] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<SearchBarCategory>("All");

  const cardsRef = useRef<HTMLDivElement>(null);

  const cardsPerRow = useRef(3);
  const cardsOverflowCount = useRef(6);
  const cardsRendered = useRef(0);
  const loadedImages = useRef(imageItems.map(item => item.id));

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

  const initialRender = async (cardsInHeight: number) => {
    cardsRendered.current = cardsInHeight + cardsOverflowCount.current;

    setLoadingImages(true);

    await dispatch(getImageSlice(0, cardsRendered.current, undefined, imageItems.map(item => item.id)));

    setLoadingImages(false);
  }

  const renderNextCards = () => {
    const doneLoading = () => {
      setLoadingImages(false);
    }

    dispatch(getImageSlice(cardsRendered.current, cardsOverflowCount.current, doneLoading, loadedImages.current));

    cardsRendered.current += cardsOverflowCount.current;
  }

  const resizeHandler = () => {
    updateCardData();
  }

  useEffect(() => {
    const fn = async () => {
      if (!hasMore) return;

      if (selectedCategory === "All") return;

      if (loadedCategories.includes(selectedCategory)) return;

      setLoadingImages(true);

      const loadedItems = imageItems.filter(item => item.category === selectedCategory).map(item => item.id);

      await dispatch(getCategoryItems(selectedCategory, loadedItems));

      setLoadingImages(false);
    }

    fn();
  }, [selectedCategory]);

  useEffect(() => {
    if (!hasMore) return;

    updateCardData();

    if (cardsRef.current) {
      const cardCount = getCardsInView(cardsRef.current);

      initialRender(cardCount);

      updateCardData();

      window.addEventListener("resize", resizeHandler);
    }

    return () => {
      window.removeEventListener("resize", resizeHandler);
    }
  }, []);

  function scrollHandler(event: UIEvent<HTMLDivElement>) {
    if (!hasMore) return;

    const element = event.target as HTMLDivElement;

    const condition = element.scrollHeight - element.scrollTop - element.clientHeight;

    if (Math.abs(condition) < 25 && !loadingImages) {
      setLoadingImages(true);
      renderNextCards();
    }
  }

  const filteredImageItems = useMemo(() => {
    return (selectedCategory === "All" && !searchValue) ? imageItems : imageItems.filter(item => {
      const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
      const matchesSearch = !searchValue || item.title.toLowerCase().includes(searchValue.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchValue, imageItems]);

  const content = !filteredImageItems.length && !loadingImages ? (
    <ErrorPage message="No images found" />
  ) : (
    <>
      {filteredImageItems.map((item) => {
        return <Card {...item} key={item.id} />;
      })}
      {hasMore && selectedCategory === "All" && !searchValue && <LoadingPage fullScreen={false} className={classes["loading-images"]} />}
    </>
  );

  return (
    <>
      <SearchBar onSelectCategory={setSelectedCategory} onChange={setSearchValue} />
      <div onScroll={scrollHandler} className={classes.cards} ref={cardsRef}>
        {content}
      </div>
    </>
  );
}

export default HomePage;